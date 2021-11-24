import {
  abi,
  dataProviderAbi,
  distributionManagerAbi
} from '../../shared/pools/aave'

const address = '0x9198F13B08E299d85E096929fA9781A1E3d5d827'

const dataProvider = {
  abi:     dataProviderAbi,
  address: '0x0668EDE013c1c475724523409b8B6bE633469585'
}

const distributionManager = {
  abi:     distributionManagerAbi,
  address: '0xa1EF206fb9a8D8186157FC817fCddcC47727ED55'
}

export default { abi, address, dataProvider, distributionManager }
