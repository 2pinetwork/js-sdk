import { BigNumberish } from 'ethers'
import { Contract, ContractCall, Provider } from 'ethers-multicall'
import Batcher, { BatchedCall, toBatchedCalls } from './batcher'
import TwoPi from '../twoPi'
import Vault from '../vault'
import {
  controllerInfo,
  strategyInfo,
  vaultTokenInfo,
  vaultInfo
} from '../abis'

export type VaultInfo = {
  [key: string]: BigNumberish
}

const callsFor = (ethcallProvider: Provider, vault: Vault): Array<BatchedCall> => {
  const vaultData      = vaultInfo(vault)
  const tokenData      = vaultTokenInfo(vault)
  const controllerData = controllerInfo(vault)
  const strategyData   = strategyInfo(vault)
  const vaultContract  = new Contract(vaultData.address, vaultData.abi)

  let tokenDecimals,
      poolInfo,
      pricePerFullShare,
      vaultDecimals,
      tvl,
      withdrawalFee,
      depositCap,
      availableDeposit,
      paused

  if (tokenData.abi) {
    const tokenContract = new Contract(tokenData.address, tokenData.abi)

    tokenDecimals = tokenContract.decimals()
  } else {
    // MATIC is native so it needs other functions
    tokenDecimals = vaultContract.decimals(vault.pid) // same decimals
  }

  if (vault.isPowerVault()) {
    pricePerFullShare = vaultContract.getPricePerFullShare()
    vaultDecimals     = vaultContract.decimals()
    tvl               = vaultContract.balance()
    withdrawalFee     = tokenDecimals // _fake_ value
    poolInfo          = tokenDecimals // _fake_ value
    depositCap        = tokenDecimals // _fake_ value
    availableDeposit  = tokenDecimals // _fake_ value
    paused            = tokenDecimals // _fake_ value
  } else {
    const controllerContract = new Contract(controllerData.address, controllerData.abi)
    const strategyContract   = new Contract(strategyData.address, strategyData.abi)

    pricePerFullShare = vaultContract.getPricePerFullShare(vault.pid)
    vaultDecimals     = vaultContract.decimals(vault.pid)
    tvl               = vaultContract.balance(vault.pid)
    withdrawalFee     = controllerContract.withdrawFee()
    poolInfo          = vaultContract.poolInfo(vault.pid)
    depositCap        = controllerContract.depositCap()
    availableDeposit  = controllerContract.availableDeposit()
    paused            = strategyContract.paused()
  }

  return toBatchedCalls(vault, [
    ['pricePerFullShare', pricePerFullShare],
    ['vaultDecimals',     vaultDecimals],
    ['tvl',               tvl],
    ['withdrawalFee',     withdrawalFee],
    ['tokenDecimals',     tokenDecimals],
    ['depositCap',        depositCap],
    ['availableDeposit',  availableDeposit],
    ['paused',            paused],
    ['poolInfo',          poolInfo]
  ])
}

class Fetcher extends Batcher {
  private data: {
    [id: string]: VaultInfo
  }

  constructor() {
    // Refresh every 0.1 seconds
    super(0.1 * 1000)

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

const getPoolData = async (twoPi: TwoPi, vault: Vault): Promise<VaultInfo> => {
  const fetcher = Fetcher.getInstance(`pool-${twoPi.chainId}`)

  return await fetcher.getPoolData(twoPi, vault)
}

export default getPoolData
