import { BigNumberish } from 'ethers'
import Tpi from '../tpi'
import Vault from '../vault'
import getVaultData, { VaultInfo } from '../fetchers/data'

const getData = async (tpi: Tpi, vault: Vault): Promise<VaultInfo> => {
  return await getVaultData(tpi, vault)
}

export default getData
