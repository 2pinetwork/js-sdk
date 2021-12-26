import {
  abi,
  dataProviderAbi,
  distributionManagerAbi
} from '../../shared/pools/aave'

const address = '0x4F01AeD16D97E3aB5ab2B501154DC9bb0F1A5A2C'

const dataProvider = {
  abi:     dataProviderAbi,
  address: '0x65285E9dfab318f57051ab2b139ccCf232945451'
}

const distributionManager = {
  abi:     distributionManagerAbi,
  address: '0x01D83Fe6A10D2f2B7AF17034343746188272cAc9'
}

export default { abi, address, dataProvider, distributionManager }
