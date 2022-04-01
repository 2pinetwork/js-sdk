import { BigNumberish } from 'ethers'
import aaveApy from './aaveApy'
import curveApy from './curveApy'
import sushiApy from './sushiApy'
import pangolinApy from './pangolinApy'
import TwoPi from '../twoPi'
import Vault from '../vault'

export const toCompoundRate = (r: number, n = 365): number => (
  (1 + r / n) ** n - 1
)

export const aprToYearlyApy = (apr: number): number => (1 + apr / 365) ** 365 - 1

const getApy = async (twoPi: TwoPi, vault: Vault): Promise<number> => {
  switch (vault.pool) {
    case 'aave':
      return await aaveApy(twoPi, vault)
      break
    case 'curve':
      return await curveApy(twoPi, vault)
      break
    case 'sushi':
      return await sushiApy(twoPi, vault)
      break
    case 'pangolin':
      return await pangolinApy(twoPi, vault)
      break
    case 'quickswap':
      // TODO: implement properly
      return Promise.resolve(0.1)
      break
    case 'mstable':
      // TODO: implement properly
      return Promise.resolve(0.1)
      break
    case '2pi':
      return Promise.resolve(0.1)
      break
  }
}

export default getApy
