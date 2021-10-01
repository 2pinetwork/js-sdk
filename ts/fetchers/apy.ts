import { BigNumberish } from 'ethers'
import { Contract, ContractCall, Provider } from 'ethers-multicall'
import Batcher, { BatchedCall, toBatchedCalls } from './batcher'
import Tpi from '../tpi'
import Vault from '../vault'

type VaultInfo = {
  [key: string]: BigNumberish | { [key: string]: BigNumberish }
}

const callsFor = (ethcallProvider: Provider, vault: Vault): Array<BatchedCall> => {
  const vaultPath     = `../abis/vaults/${vault.chainId}/${vault.pool}-${vault.token}`
  const tokenPath     = `../abis/tokens/${vault.chainId}/${vault.token}`
  const poolPath      = `../abis/pools/${vault.chainId}/${vault.pool}`
  const vaultData     = require(vaultPath).default
  const tokenData     = require(tokenPath).default
  const poolData      = require(poolPath).default
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
    const tpi: Tpi        = args.shift()
    const vault: Vault    = args.shift()
    const ethcallProvider = new Provider(tpi.provider, vault.chainId)

    const batchedCalls = tpi.getVaults().flatMap(vault => {
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

  public async getApyData(tpi: Tpi, vault: Vault): Promise<VaultInfo> {
    await this.perform(tpi, vault)

    return this.data[vault.id]
  }
}

const fetcher = new Fetcher()

const getApyData = async (tpi: Tpi, vault: Vault): Promise<VaultInfo> => {
  return await fetcher.getApyData(tpi, vault)
}

export default getApyData
