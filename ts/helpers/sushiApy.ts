import BigNumber from 'bignumber.js'
import TwoPi from '../twoPi'
import Vault from '../vault'
import getApyData from '../fetchers/apy'

type DayData = {
  id:         string
  volumeUSD:  string
  reserveUSD: string
}

export type SushiResponse = {
  data: {
    data: {
      pairs: Array<{ dayData: Array<DayData> }>
    }
  }
}

const SUSHI_LP_FEE = 0.0025

const zip = (arrays: Array<Array<any>>): Array<any> => {
  return (arrays.find(_ => true) as Array<any>).map((_, i) => {
    return arrays.map(array => array[i])
  })
}

const apy = (apr: number): number => (1 + apr / 365) ** 365 - 1

export const sushiGraphQuery = (addresses: Array<string>, startTimestamp: number, endTimestamp: number) => {
  return `{
    pairs(where: { id_in: [${addresses.map(a => `"${a}"`).join(',')}] }) {
      dayData(first: 1000, orderBy: date, orderDirection: asc, where: {
        date_gt: ${startTimestamp}, date_lt: ${endTimestamp}
      }) {
        id
        volumeUSD
        reserveUSD
      }
    }
  }`
}

export const putSushiApys = (
  addresses: { [key: string]: string },
  response0: SushiResponse,
  response1: SushiResponse,
  data: { [key: string]: { [key: string]: {} } }
) => {
  const dayDatas0 = response0.data.data.pairs.map(pair => pair.dayData[0])
  const dayDatas1 = response1.data.data.pairs.map(pair => pair.dayData[0])

  for (const pairDayData of zip([ dayDatas0, dayDatas1 ])) {
    if (pairDayData && pairDayData[0] && pairDayData[1]) {
      const address = pairDayData[0].id.split('-')[0]

      const volume = new BigNumber(pairDayData[0].volumeUSD)
        .plus(pairDayData[1].volumeUSD)
        .dividedBy(2)

      const reserve = new BigNumber(pairDayData[0].reserveUSD)
        .plus(pairDayData[1].reserveUSD)
        .dividedBy(2)

      if (! reserve.isZero()) {
        const tradingFeeApr = new BigNumber(volume)
          .times(SUSHI_LP_FEE)
          .times(365)
          .dividedBy(reserve)
          .toNumber()

        const tradingFeeApy = apy(tradingFeeApr)

        data[addresses[address]] = { tradingFeeApy }
      }
    }
  }
}

const sushiApy = async (twoPi: TwoPi, vault: Vault): Promise<number> => {
  const info = await getApyData(twoPi, vault)

  return info.tradingFeeApy as number
}

export default sushiApy
