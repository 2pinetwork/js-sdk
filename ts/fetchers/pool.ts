import { BigNumberish } from 'ethers'
import { Contract, ContractCall, Provider } from 'ethers-multicall'
import { controllerInfo, vaultTokenInfo, vaultInfo } from '../abis'
import Batcher, { BatchedCall, toBatchedCalls } from './batcher'
import TwoPi from '../twoPi'
import Vault from '../vault'

export type VaultInfo = {
  [key: string]: BigNumberish
}

const callsFor = (ethcallProvider: Provider, vault: Vault): Array<BatchedCall> => {
  const vaultData      = vaultInfo(vault)
  const tokenData      = vaultTokenInfo(vault)
  const controllerData = controllerInfo(vault)
  const vaultContract  = new Contract(vaultData.address, vaultData.abi)

  let tokenDecimals, pricePerFullShare, vaultDecimals, tvl, withdrawalFee

  if (tokenData.abi) {
    const tokenContract = new Contract(tokenData.address, tokenData.abi)

    tokenDecimals = tokenContract.decimals()
  } else {
    // MATIC is native so it needs other functions
    tokenDecimals = vaultContract.decimals(vault.pid) // same decimals
  }

  if (vault.token === '2pi') {
    pricePerFullShare = vaultContract.getPricePerFullShare()
    vaultDecimals     = vaultContract.decimals()
    tvl               = vaultContract.balance()
    withdrawalFee     = tokenDecimals // _fake_ value
  } else {
    const controllerContract = new Contract(controllerData.address, controllerData.abi)

    pricePerFullShare = vaultContract.getPricePerFullShare(vault.pid)
    vaultDecimals     = vaultContract.decimals(vault.pid)
    tvl               = vaultContract.balance(vault.pid)
    withdrawalFee     = controllerContract.withdrawFee()
  }

  return toBatchedCalls(vault, [
    ['pricePerFullShare', pricePerFullShare],
    ['vaultDecimals',     vaultDecimals],
    ['tvl',               tvl],
    ['withdrawalFee',     withdrawalFee],
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

  public async getPoolData(twoPi: TwoPi, vault: Vault): Promise<VaultInfo> {
    await this.perform(twoPi)

    return this.data[vault.id]
  }

  protected getPromise(...args: Array<any>): Promise<void> {
    const twoPi: TwoPi    = args.shift()
    const ethcallProvider = new Provider(twoPi.provider, twoPi.chainId)

    const batchedCalls = twoPi.getVaults().flatMap(vault => {
      return callsFor(ethcallProvider, vault)
    })

    return this.runBatchedCalls(ethcallProvider, batchedCalls, this.data)
  }
}

const fetcher = new Fetcher()

const getPoolData = async (twoPi: TwoPi, vault: Vault): Promise<VaultInfo> => {
  return await fetcher.getPoolData(twoPi, vault)
}

export default getPoolData
