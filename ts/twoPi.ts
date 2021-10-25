import { Signer, VoidSigner } from 'ethers'
import { Provider } from '@ethersproject/abstract-provider'
import Vault from './vault'
import { ZERO_ADDRESS } from './data/constants'
import getVaults from './data/vaults'

type Chain = 80001

export default class TwoPi {
  readonly chainId:  Chain
  readonly provider: Provider
  readonly signer:   Signer

  constructor(chainId: Chain, provider: Provider, signer?: Signer) {
    this.chainId  = chainId
    this.provider = provider
    this.signer   = signer || new VoidSigner(ZERO_ADDRESS, provider)
  }

  getVaults(): Array<Vault> {
    return getVaults(this.chainId).map(data => new Vault(this, data))
  }
}
