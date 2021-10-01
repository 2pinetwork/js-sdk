import { BigNumberish } from 'ethers'
import { Contract, ContractCall, Provider } from 'ethers-multicall'
import Batcher, { BatchedCall, toBatchedCalls } from './batcher'
import Tpi from '../tpi'
import Vault from '../vault'

export type VaultInfo = {
  [key: string]: BigNumberish
}

const callsFor = (address: string, ethcallProvider: Provider, vault: Vault): Array<BatchedCall> => {
  const vaultPath     = `../abis/vaults/${vault.chainId}/${vault.pool}-${vault.token}`
  const tokenPath     = `../abis/tokens/${vault.chainId}/${vault.token}`
  const poolPath      = `../abis/pools/${vault.chainId}/${vault.pool}`
  const vaultData     = require(vaultPath).default
  const tokenData     = require(tokenPath).default
  const poolData      = require(poolPath).default
  const vaultContract = new Contract(vaultData.address, vaultData.abi)

  let tokenDecimals, balance, allowance

  if (tokenData.abi) {
    const tokenContract = new Contract(tokenData.address, tokenData.abi)

    tokenDecimals = tokenContract.decimals()
    balance       = tokenContract.balanceOf(address)
    allowance     = tokenContract.allowance(address, vaultData.address)
  } else {
    // MATIC is native so it needs other functions
    tokenDecimals = vaultContract.decimals() // same decimals
    balance       = ethcallProvider.getEthBalance(address)
    allowance     = ethcallProvider.getEthBalance(address) // fake allowance
  }

  return toBatchedCalls(vault, [
    ['tokenDecimals',     tokenDecimals],
    ['pricePerFullShare', vaultContract.getPricePerFullShare()],
    ['tvl',               vaultContract.balance()],
    ['vaultDecimals',     vaultContract.decimals()],
    ['balance',           balance],
    ['allowance',         allowance],
    ['shares',            vaultContract.balanceOf(address)],
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
    const tpi: Tpi        = args.shift()
    const vault: Vault    = args.shift()
    const ethcallProvider = new Provider(tpi.provider, tpi.chainId)

    const batchedCalls = tpi.getVaults().flatMap(vault => {
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

  public async getVaultData(tpi: Tpi, vault: Vault): Promise<VaultInfo> {
    const address = await tpi.signer.getAddress()

    await this.perform(address, tpi, vault)

    return this.data[vault.id]
  }
}

const fetcher = new Fetcher()

const getVaultData = async (tpi: Tpi, vault: Vault): Promise<VaultInfo> => {
  return await fetcher.getVaultData(tpi, vault)
}

export default getVaultData
