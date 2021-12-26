import BigNumber from 'bignumber.js'
import ethers, { BigNumberish } from 'ethers'
import Vault from '../vault'
import { getPrice } from '../fetchers/prices'

const SECONDS_PER_DAY = 24 * 60 * 60

const AVERAGE_BLOCK_MINE_TIME_IN_SECONDS: { [key: number]: number } = {
  43113: 2.0, // This is discouraged, but we have to "guess" and this is the closest value
  43114: 2.0, // This is discouraged, but we have to "guess" and this is the closest value
  80001: 2.1
}

const blocksPerDayFor = (chainId: number) => {
  return SECONDS_PER_DAY / AVERAGE_BLOCK_MINE_TIME_IN_SECONDS[chainId]
}

export const getRewardsApr = async (vault: Vault): Promise<number | undefined> => {
  if (vault.isPowerVault()) return 0

  const twoPi           = vault.twoPi
  const twoPiVault      = twoPi.getVaults().find(v => v.token.name === '2pi') as Vault

  console.log(twoPiVault)
  if (!twoPiVault) return 0

  const blocksPerDay    = blocksPerDayFor(vault.chainId)
  const twoPiDecimals   = await twoPiVault.tokenDecimals()
  const twoPiPrice      = await getPrice(twoPiVault)
  const piTokenPerBlock = await twoPi.piTokenPerBlock()
  const totalWeighing   = await twoPi.totalWeighing()
  const weighing        = await vault.weighing()
  const tvl             = await vault.tvl()
  const tokenDecimals   = await vault.tokenDecimals()
  const price           = await getPrice(vault)

  const tvlInUSD = new BigNumber(tvl?.toString() || 0)
    .div(new BigNumber(10).pow(tokenDecimals?.toString() || 0))
    .times(price)

  const piTokensPerDay = new BigNumber(piTokenPerBlock?.toString() || 0)
    .times(blocksPerDay)
    .times(totalWeighing?.toString() || 0)
    .div(weighing?.toString() || 0)

  const dailyPiTokensInUSD = new BigNumber(piTokensPerDay?.toString())
    .times(twoPiPrice)
    .div(new BigNumber(10).pow(twoPiDecimals?.toString() || 0))

  const apr = dailyPiTokensInUSD.times(365).div(tvlInUSD)

  return apr.isFinite() && apr.isPositive() ? apr.toNumber() : 0
}
