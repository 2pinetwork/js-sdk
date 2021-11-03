import axios from 'axios'
import { startOfMinute, subDays } from 'date-fns'
import { BigNumberish } from 'ethers'
import { Contract, ContractCall, Provider } from 'ethers-multicall'
import { poolInfo, vaultTokenInfo, vaultInfo } from '../abis'
import Batcher, { BatchedCall, toBatchedCalls } from './batcher'
import TwoPi from '../twoPi'
import Vault from '../vault'
import {
  putSushiApys,
  sushiGraphQuery,
  SushiResponse
} from '../helpers/sushiApy'

type VaultInfo = {
  [key: string]: BigNumberish | { [key: string]: BigNumberish }
}

const sushiGraphUrls = {
  // 137:   'https://api.thegraph.com/subgraphs/name/sushiswap/matic-exchange',
  80001: 'https://api.thegraph.com/subgraphs/name/gwydce/mumbai-sushi-exchange'
}

export const getUtcSecondsFromDayRange = (daysAgo0: number, daysAgo1: number) => {
  const endDate   = startOfMinute(subDays(Date.now(), daysAgo0))
  const startDate = startOfMinute(subDays(Date.now(), daysAgo1))

  return [ startDate, endDate ].map(date => Math.floor(Number(date) / 1000))
}

const aaveCallsFor = (ethcallProvider: Provider, vault: Vault): Array<BatchedCall> => {
  const vaultData     = vaultInfo(vault)
  const tokenData     = vaultTokenInfo(vault)
  const poolData      = poolInfo(vault)
  const vaultContract = new Contract(vaultData.address, vaultData.abi)

  let tokenDecimals

  if (tokenData.abi) {
    const tokenContract = new Contract(tokenData.address, tokenData.abi)

    tokenDecimals = tokenContract.decimals()
  } else {
    // MATIC is native so it needs other functions
    tokenDecimals = vaultContract.decimals(vault.pid) // same decimals
  }

  const dataProvider                = poolData.dataProvider
  const distributionManager         = poolData.distributionManager
  const dataProviderContract        = new Contract(dataProvider.address, dataProvider.abi)
  const distributionManagerContract = new Contract(distributionManager.address, distributionManager.abi)

  return toBatchedCalls(vault, [
    ['tokenDecimals',      tokenDecimals],
    ['dataProvider',       dataProviderContract.getReserveData(tokenData.address)],
    ['distributionSupply', distributionManagerContract.assets(vaultData.aToken.address)],
    ['distributionBorrow', distributionManagerContract.assets(vaultData.debtToken.address)]
  ])
}

class Fetcher extends Batcher {
  private data: {
    [id: string]: VaultInfo
  }

  constructor() {
    // Refresh every 60 seconds
    super(60 * 1000)

    this.data = {}
  }

  public async getApyData(twoPi: TwoPi, vault: Vault): Promise<VaultInfo> {
    await this.perform(twoPi)

    return this.data[vault.id]
  }

  protected getPromise(...args: Array<any>): Promise<any> {
    const twoPi: TwoPi = args.shift()

    return Promise.all([
      this.getAaveApys(twoPi),
      this.getSushiApys(twoPi)
    ])
  }

  private getAaveApys(twoPi: TwoPi): Promise<void> {
    const ethcallProvider = new Provider(twoPi.provider, twoPi.chainId)

    const batchedCalls = twoPi.getVaults().flatMap(vault => {
      if (vault.pool === 'aave') {
        return aaveCallsFor(ethcallProvider, vault)
      } else {
        return []
      }
    })

    return this.runBatchedCalls(ethcallProvider, batchedCalls, this.data)
  }

  private async getSushiApys(twoPi: TwoPi): Promise<void> {
    const url                                  = sushiGraphUrls[twoPi.chainId]
    const addresses: { [key: string]: string } = {}

    twoPi.getVaults().filter(v => v.pool === 'sushi').forEach(vault => {
      this.data[vault.id] = { tradingFeeApy: 0 }

      addresses[vaultTokenInfo(vault).address] = vault.id
    })

    const [ start0, end0 ] = getUtcSecondsFromDayRange(1, 2)
    const [ start1, end1 ] = getUtcSecondsFromDayRange(3, 4)

    const response0: SushiResponse = await axios.post(url, {
      query: sushiGraphQuery(Object.keys(addresses), start0, end0)
    })

    const response1: SushiResponse = await axios.post(url, {
      query: sushiGraphQuery(Object.keys(addresses), start1, end1)
    })

    putSushiApys(addresses, response0, response1, this.data)
  }
}

const fetcher = new Fetcher()

const getApyData = async (twoPi: TwoPi, vault: Vault): Promise<VaultInfo> => {
  return await fetcher.getApyData(twoPi, vault)
}

export default getApyData
