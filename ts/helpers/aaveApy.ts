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
  const { supplyBase, supplyMatic, borrowBase, borrowMatic } = getVaultData(
    vault, tokenDecimals, dataProvider, distributionManager, prices
  )

  const {
    leveragedSupplyBase,
    leveragedBorrowBase,
    leveragedSupplyMatic,
    leveragedBorrowMatic,
  } = getLeveragedApys(
    supplyBase,
    borrowBase,
    supplyMatic,
    borrowMatic,
    depth,
    vault.borrow?.percentage || 0
  )

  const totalMatic          = leveragedSupplyMatic.plus(leveragedBorrowMatic)
  const totalMaticAfterFees = totalMatic.times(1 - PERFORMANCE_FEE).toNumber()
  const compoundedMatic     = toCompoundRate(totalMaticAfterFees, BASE_HPY)

  return leveragedSupplyBase.minus(leveragedBorrowBase).plus(compoundedMatic).toNumber()
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

  const { supplyMaticInUsd, borrowMaticInUsd } = getMaticPerYear(
    vault, distributionManager, prices
  )

  const supplyMatic = supplyMaticInUsd.div(totalSupplyInUsd)
  const borrowMatic = totalBorrowInUsd.isZero()
    ? new BigNumber(0)
    : borrowMaticInUsd.div(totalBorrowInUsd)

  return { supplyBase, supplyMatic, borrowBase, borrowMatic }
}

const getLeveragedApys = (
  supplyBase:    BigNumber,
  borrowBase:    BigNumber,
  supplyMatic:   BigNumber,
  borrowMatic:   BigNumber,
  depth:         number,
  borrowPercent: number
) => {
  const percentage = new BigNumber(borrowPercent)

  // Always the supply will be the original supply percentage
  let leveragedSupplyBase  = supplyBase
  let leveragedSupplyMatic = supplyMatic
  let leveragedBorrowBase  = new BigNumber(0)
  let leveragedBorrowMatic = new BigNumber(0)

  for (let i = 1; i <= depth; i++) {
    const borrowPercentExp = percentage.pow(i)

    leveragedSupplyBase = leveragedSupplyBase.plus(
      supplyBase.times(borrowPercentExp)
    )
    leveragedSupplyMatic = leveragedSupplyMatic.plus(
      supplyMatic.times(borrowPercentExp)
    )
    leveragedBorrowBase = leveragedBorrowBase.plus(
      borrowBase.times(borrowPercentExp)
    )
    leveragedBorrowMatic = leveragedBorrowMatic.plus(
      borrowMatic.times(borrowPercentExp)
    )
  }

  return {
    leveragedSupplyBase,
    leveragedBorrowBase,
    leveragedSupplyMatic,
    leveragedBorrowMatic
  }
}

const getMaticPerYear = (
  vault:               Vault,
  distributionManager: DistributionInfo,
  prices:              PricesInfo
) => {
  const supplyRateString = distributionManager.supply.emissionPerSecond.toString()
  const borrowRateString = distributionManager.borrow.emissionPerSecond.toString()
  const supplyMaticRate  = new BigNumber(supplyRateString)
  const borrowMaticRate  = new BigNumber(borrowRateString)
  const maticPrice       = prices['matic-network'] || 0

  const supplyMaticInUsd = supplyMaticRate
    .times(SECONDS_PER_YEAR)
    .times(maticPrice)
    .div(COMMON_DECIMALS)

  const borrowMaticInUsd = borrowMaticRate
    .times(SECONDS_PER_YEAR)
    .times(maticPrice)
    .div(COMMON_DECIMALS)

  return { supplyMaticInUsd, borrowMaticInUsd }
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
