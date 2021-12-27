import BigNumber from 'bignumber.js'
import { BigNumberish } from 'ethers'
import { toCompoundRate } from './apy'
import getPrices from '../fetchers/prices'
import TwoPi from '../twoPi'
import Vault from '../vault'
import getApyData from '../fetchers/apy'

const SECONDS_PER_YEAR = 31536000
const BASE_HPY         = 8760
const RAY_DECIMALS     = '1e27'
const COMMON_DECIMALS  = '1e18'
const PERFORMANCE_FEE  = 0.035

type PricesInfo = {
  [key: string]: number
}

type ProviderInfo = {
  [key: string]: BigNumberish
}

type DistributionInfo = {
  [key: string]: {
    [key: string]: BigNumberish
  }
}

const getVaultApy = (
  vault:               Vault,
  tokenDecimals:       BigNumberish,
  dataProvider:        ProviderInfo,
  distributionManager: DistributionInfo,
  prices:              PricesInfo,
  depth:               number
): number => {
  const { supplyBase, supplyNative, borrowBase, borrowNative } = getVaultData(
    vault, tokenDecimals, dataProvider, distributionManager, prices
  )

  const {
    leveragedSupplyBase,
    leveragedBorrowBase,
    leveragedSupplyNative,
    leveragedBorrowNative,
  } = getLeveragedApys(
    supplyBase,
    borrowBase,
    supplyNative,
    borrowNative,
    depth,
    vault.borrow?.percentage || 0
  )

  const totalNative      = leveragedSupplyNative.plus(leveragedBorrowNative)
  const compoundedNative = toCompoundRate(totalNative.toNumber(), BASE_HPY)

  return leveragedSupplyBase
    .minus(leveragedBorrowBase)
    .plus(compoundedNative)
    .times(1 - PERFORMANCE_FEE)
    .toNumber()
}

const getVaultData = (
  vault:               Vault,
  tokenDecimals:       BigNumberish,
  dataProvider:        ProviderInfo,
  distributionManager: DistributionInfo,
  prices:              PricesInfo
) => {
  const availableLiquidity = new BigNumber(dataProvider.availableLiquidity.toString())
  const totalStableDebt    = new BigNumber(dataProvider.totalStableDebt.toString())
  const totalVariableDebt  = new BigNumber(dataProvider.totalVariableDebt.toString())
  const liquidityRate      = new BigNumber(dataProvider.liquidityRate.toString())
  const variableBorrowRate = new BigNumber(dataProvider.variableBorrowRate.toString())
  const tokenDecimalsExp   = new BigNumber(10).pow(tokenDecimals.toString())

  const supplyBase = liquidityRate.div(RAY_DECIMALS)
  const borrowBase = variableBorrowRate.div(RAY_DECIMALS)

  const tokenPrice       = prices[vault.priceId]
  const totalBorrowInUsd = totalVariableDebt.times(tokenPrice).div(tokenDecimalsExp)
  const totalSupplyInUsd = availableLiquidity
    .plus(totalStableDebt)
    .plus(totalVariableDebt)
    .times(tokenPrice)
    .div(tokenDecimalsExp)

  const { supplyNativeInUsd, borrowNativeInUsd } = getNativePerYear(
    vault, distributionManager, prices
  )

  const supplyNative = supplyNativeInUsd.div(totalSupplyInUsd)
  const borrowNative = totalBorrowInUsd.isZero()
    ? new BigNumber(0)
    : borrowNativeInUsd.div(totalBorrowInUsd)

  return { supplyBase, supplyNative, borrowBase, borrowNative }
}

const getLeveragedApys = (
  supplyBase:    BigNumber,
  borrowBase:    BigNumber,
  supplyNative:  BigNumber,
  borrowNative:  BigNumber,
  depth:         number,
  borrowPercent: number
) => {
  const percentage = new BigNumber(borrowPercent)

  // Always the supply will be the original supply percentage
  let leveragedSupplyBase   = new BigNumber(0)
  let leveragedSupplyNative = new BigNumber(0)
  let leveragedBorrowBase   = new BigNumber(0)
  let leveragedBorrowNative = new BigNumber(0)

  for (let i = 0; i <= depth; i++) {
    leveragedSupplyBase = leveragedSupplyBase.plus(
      supplyBase.times(percentage.pow(i))
    )
    leveragedSupplyNative = leveragedSupplyNative.plus(
      supplyNative.times(percentage.pow(i))
    )
  }

  for (let i = 1; i <= depth; i++) {
    leveragedBorrowBase = leveragedBorrowBase.plus(
      borrowBase.times(percentage.pow(i))
    )
    leveragedBorrowNative = leveragedBorrowNative.plus(
      borrowNative.times(percentage.pow(i))
    )
  }

  return {
    leveragedSupplyBase,
    leveragedBorrowBase,
    leveragedSupplyNative,
    leveragedBorrowNative
  }
}

const getNativePrice = (vault: Vault, prices: PricesInfo): number => {
  if ([43113, 43114].includes(vault.chainId)) {
    return prices['avalanche-2'] || 0
  } else {
    return prices['matic-network'] || 0
  }
}

const getNativePerYear = (
  vault:               Vault,
  distributionManager: DistributionInfo,
  prices:              PricesInfo
) => {
  const supplyRateString = distributionManager.supply.emissionPerSecond.toString()
  const borrowRateString = distributionManager.borrow.emissionPerSecond.toString()
  const supplyNativeRate = new BigNumber(supplyRateString)
  const borrowNativeRate = new BigNumber(borrowRateString)
  const nativePrice      = getNativePrice(vault, prices)

  const supplyNativeInUsd = supplyNativeRate
    .times(SECONDS_PER_YEAR)
    .times(nativePrice)
    .div(COMMON_DECIMALS)

  const borrowNativeInUsd = borrowNativeRate
    .times(SECONDS_PER_YEAR)
    .times(nativePrice)
    .div(COMMON_DECIMALS)

  return { supplyNativeInUsd, borrowNativeInUsd }
}

const aaveApy = async (twoPi: TwoPi, vault: Vault): Promise<number> => {
  const prices              = await getPrices(twoPi)
  const info                = await getApyData(twoPi, vault)
  const depths              = [vault.borrow?.depth || 0, 0]
  const borrow: {}          = info.distributionBorrow
  const supply: {}          = info.distributionSupply
  const dataProvider: {}    = info.dataProvider
  const distributionManager = { borrow, supply }

  return Math.max(
    ...depths.map(depth => {
      return getVaultApy(
        vault,
        info.tokenDecimals.toString(),
        dataProvider,
        distributionManager,
        prices,
        depth
      )
    })
  )
}

export default aaveApy
