import { BigNumberish } from 'ethers'
import { Contract, ContractCall, Provider } from 'ethers-multicall'
import { tokenInfo, vaultInfo } from '../abis'
import Batcher, { BatchedCall, toBatchedCalls } from './batcher'
import TwoPi from '../twoPi'
import Vault from '../vault'

export type VaultInfo = {
  [key: string]: BigNumberish
}

const callsFor = (ethcallProvider: Provider, vault: Vault): Array<BatchedCall> => {
  const vaultData     = vaultInfo(vault)
  const tokenData     = tokenInfo(vault)
  const vaultContract = new Contract(vaultData.address, vaultData.abi)

  let tokenDecimals

  if (tokenData.abi) {
    const tokenContract = new Contract(tokenData.address, tokenData.abi)

    tokenDecimals = tokenContract.decimals()
  } else {
    // MATIC is native so it needs other functions
    tokenDecimals = vaultContract.decimals(vault.pid) // same decimals
  }

  return toBatchedCalls(vault, [
    ['pricePerFullShare', vaultContract.getPricePerFullShare(vault.pid)],
    ['vaultDecimals',     vaultContract.decimals(vault.pid)],
    ['tvl',               vaultContract.balance(vault.pid)],
    ['tokenDecimals',     tokenDecimals]
  ])
}

class Fetcher extends Batcher {
  private data: {
    [id: string]: VaultInfo
  }

  constructor() {
    // Refresh every 2 seconds
    super(2 * 1000)

    this.data = {}
  }

  protected getPromise(...args: Array<any>): Promise<void> {
    const twoPi: TwoPi    = args.shift()
    const ethcallProvider = new Provider(twoPi.provider, twoPi.chainId)

    const batchedCalls = twoPi.getVaults().flatMap(vault => {
      return callsFor(ethcallProvider, vault)
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

  public async getPoolData(twoPi: TwoPi, vault: Vault): Promise<VaultInfo> {
    await this.perform(twoPi)

    return this.data[vault.id]
  }
}

const fetcher = new Fetcher()

const getPoolData = async (twoPi: TwoPi, vault: Vault): Promise<VaultInfo> => {
  return await fetcher.getPoolData(twoPi, vault)
}

export default getPoolData
