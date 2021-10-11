import { BigNumberish } from 'ethers'
import { Contract, ContractCall, Provider } from 'ethers-multicall'
import { tokenInfo, vaultInfo } from '../abis'
import Batcher, { BatchedCall, toBatchedCalls } from './batcher'
import TwoPi from '../twoPi'
import Vault from '../vault'

export type VaultInfo = {
  [key: string]: BigNumberish
}

const callsFor = (address: string, ethcallProvider: Provider, vault: Vault): Array<BatchedCall> => {
  const vaultData     = vaultInfo(vault)
  const tokenData     = tokenInfo(vault)
  const vaultContract = new Contract(vaultData.address, vaultData.abi)

  let balance, allowance

  if (tokenData.abi) {
    const tokenContract = new Contract(tokenData.address, tokenData.abi)

    balance   = tokenContract.balanceOf(address)
    allowance = tokenContract.allowance(address, vaultData.address)
  } else {
    // MATIC is native so it needs other functions
    balance   = ethcallProvider.getEthBalance(address)
    allowance = ethcallProvider.getEthBalance(address) // fake allowance
  }

  return toBatchedCalls(vault, [
    ['balance',   balance],
    ['allowance', allowance],
    ['shares',    vaultContract.balanceOf(address)]
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
    const address: string = args.shift()
    const twoPi: TwoPi    = args.shift()
    const ethcallProvider = new Provider(twoPi.provider, twoPi.chainId)

    const batchedCalls = twoPi.getVaults().flatMap(vault => {
      if (vault.pool === 'aave') {
        return callsFor(address, ethcallProvider, vault)
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

  public async getWalletData(twoPi: TwoPi, vault: Vault): Promise<VaultInfo> {
    if (! twoPi.signer) return Promise.resolve({})

    const address = await twoPi.signer.getAddress()

    await this.perform(address, twoPi)

    return this.data[vault.id]
  }
}

const fetcher = new Fetcher()

const getWalletData = async (twoPi: TwoPi, vault: Vault): Promise<VaultInfo> => {
  return await fetcher.getWalletData(twoPi, vault)
}

export default getWalletData
