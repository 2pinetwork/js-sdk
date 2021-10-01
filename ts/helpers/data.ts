import { BigNumberish } from 'ethers'
import TwoPi from '../twoPi'
import Vault from '../vault'
import getVaultData, { VaultInfo } from '../fetchers/data'

const getData = async (twoPi: TwoPi, vault: Vault): Promise<VaultInfo> => {
  return await getVaultData(twoPi, vault)
}

export default getData
