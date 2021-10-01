import { BigNumberish } from 'ethers'
import aaveApy from './aaveApy'
import curveApy from './curveApy'
import Tpi from '../tpi'
import Vault from '../vault'

export const toCompoundRate = (r: number, n = 365): number => (
  (1 + r / n) ** n - 1
)

const getApy = async (tpi: Tpi, vault: Vault): Promise<number> => {
  switch (vault.pool) {
    case 'aave':
      return await aaveApy(tpi, vault)
      break
    case 'curve':
      return await curveApy(tpi, vault)
      break
  }
}

export default getApy
