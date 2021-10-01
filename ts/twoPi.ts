import { Signer } from 'ethers'
import { Provider } from '@ethersproject/abstract-provider'
import Vault from './vault'
import getVaults from './data/vaults'

type Chain = 80001

export default class TwoPi {
  chainId:  Chain
  provider: Provider
  signer:   Signer

  constructor(chainId: Chain, provider: Provider, signer: Signer) {
    this.chainId  = chainId
    this.provider = provider
    this.signer   = signer
  }

  getVaults(): Array<Vault> {
    return getVaults(this.chainId).map(vault => {
      vault.twoPi = this

      return vault
    })
  }
}
