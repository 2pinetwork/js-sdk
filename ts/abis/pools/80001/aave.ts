import {
  abi,
  dataProviderAbi,
  distributionManagerAbi
} from '../../shared/pools/aave'

const address = '0x9198F13B08E299d85E096929fA9781A1E3d5d827'

const dataProvider = {
  abi:     dataProviderAbi,
  address: '0xFA3bD19110d986c5e5E9DD5F69362d05035D045B'
}

const distributionManager = {
  abi:     distributionManagerAbi,
  address: '0xd41aE58e803Edf4304334acCE4DC4Ec34a63C644'
}

export default { abi, address, dataProvider, distributionManager }
