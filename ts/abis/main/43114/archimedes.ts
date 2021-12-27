import { abi } from '../../shared/main/archimedesNative'

const address = '0x61E2b34204fA41fEfFE322c12B0Ad14C256825c3'

// TODO: We should use getReserveTokensAddresses() for this
const aToken = {
  address: '0x47AFa96Cdc9fAb46904A55a6ad4bf6660B53c38a'
}

const debtToken = {
  address: '0x1852DC24d1a8956a0B356AA18eDe954c7a0Ca5ae'
}

export default { abi, address, aToken, debtToken }
