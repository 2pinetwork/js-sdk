import BigNumber from 'bignumber.js'
import TwoPi from '../twoPi'
import Vault from '../vault'
import getApyData from '../fetchers/apy'
import { aprToYearlyApy } from '../helpers/apy'

type PangolinDayData = {
  id:             string
  dailyVolumeUSD: string
  reserveUSD:     string
}

export type PangolinResponse = {
  data: {
    data: {
      pairDayDatas: Array<PangolinDayData>
    }
  }
}

const PANGOLIN_LP_FEE = 0.0025

export const pangolinGraphQuery = (addresses: Array<string>, startTimestamp: number, endTimestamp: number) => {
  return `{
    pairDayDatas(
      first: 1000, orderBy: date, orderDirection: asc,
      where: {
        pairAddress_in: [${addresses.map(a => `"${a}"`).join(',')}],
        date_gt: ${startTimestamp},
        date_lt: ${endTimestamp}
      }
    ) {
      id
      dailyVolumeUSD
      reserveUSD
    }
  }`
}

export const putPangolinApys = (
  addresses: { [key: string]: string },
  response: PangolinResponse,
  data: { [key: string]: { [key: string]: {} } }
) => {
  for (const pairDayData of response.data.data.pairDayDatas) {
    const address = pairDayData.id.split('-')[0]
    const volume  = new BigNumber(pairDayData.dailyVolumeUSD)
    const reserve = new BigNumber(pairDayData.reserveUSD)

    if (! reserve.isZero()) {
      const tradingFeeApr = new BigNumber(volume)
        .times(PANGOLIN_LP_FEE)
        .times(365)
        .dividedBy(reserve)
        .toNumber()

      const tradingFeeApy = aprToYearlyApy(tradingFeeApr)

      data[addresses[address]] = { tradingFeeApy }
    }
  }
}

const pangolinApy = async (twoPi: TwoPi, vault: Vault): Promise<number> => {
  const info = await getApyData(twoPi, vault)

  return (info?.tradingFeeApy || 0) as number
}

export default pangolinApy
