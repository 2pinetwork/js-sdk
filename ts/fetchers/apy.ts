import { BigNumberish } from 'ethers'
import { Contract, ContractCall, Provider } from 'ethers-multicall'
import { poolInfo, tokenInfo, vaultInfo } from '../abis'
import Batcher, { BatchedCall, toBatchedCalls } from './batcher'
import TwoPi from '../twoPi'
import Vault from '../vault'

type VaultInfo = {
  [key: string]: BigNumberish | { [key: string]: BigNumberish }
}

const callsFor = (ethcallProvider: Provider, vault: Vault): Array<BatchedCall> => {
  const vaultData     = vaultInfo(vault)
  const tokenData     = tokenInfo(vault)
  const poolData      = poolInfo(vault)
  const vaultContract = new Contract(vaultData.address, vaultData.abi)

  let tokenDecimals

  if (tokenData.abi) {
    const tokenContract = new Contract(tokenData.address, tokenData.abi)

    tokenDecimals = tokenContract.decimals()
  } else {
    // MATIC is native so it needs other functions
    tokenDecimals = vaultContract.decimals() // same decimals
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

  protected getPromise(...args: Array<any>): Promise<void> {
    const twoPi: TwoPi    = args.shift()
    const vault: Vault    = args.shift()
    const ethcallProvider = new Provider(twoPi.provider, vault.chainId)

    const batchedCalls = twoPi.getVaults().flatMap(vault => {
      if (vault.pool === 'aave') {
        return callsFor(ethcallProvider, vault)
      } else {
        return []
      }
    })

    const calls: Array<ContractCall> = batchedCalls.map((batchedCall): ContractCall => {
      return batchedCall.call
    })

    return ethcallProvider.all(calls).then(results => {
      results.forEach((result, i) => {
        const batchedCall: BatchedCall = batchedCalls[i]

        this.data[batchedCall.id]                  ||= {}
        this.data[batchedCall.id][batchedCall.key]   = result
      })

      this.setRefreshedAt(new Date())
    })
  }

  public async getApyData(twoPi: TwoPi, vault: Vault): Promise<VaultInfo> {
    await this.perform(twoPi, vault)

    return this.data[vault.id]
  }
}

const fetcher = new Fetcher()

const getApyData = async (twoPi: TwoPi, vault: Vault): Promise<VaultInfo> => {
  return await fetcher.getApyData(twoPi, vault)
}

export default getApyData
