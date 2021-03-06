import { BigNumberish } from 'ethers'
import aaveApy from './aaveApy'
import curveApy from './curveApy'
import TwoPi from '../twoPi'
import Vault from '../vault'

export const toCompoundRate = (r: number, n = 365): number => (
  (1 + r / n) ** n - 1
)

const getApy = async (twoPi: TwoPi, vault: Vault): Promise<number> => {
  switch (vault.pool) {
    case 'aave':
      return await aaveApy(twoPi, vault)
      break
    case 'curve':
      return await curveApy(twoPi, vault)
      break
  }
}

export default getApy
