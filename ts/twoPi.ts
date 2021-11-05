import { BigNumberish, Signer, VoidSigner } from 'ethers'
import { Provider } from '@ethersproject/abstract-provider'
import Vault from './vault'
import { ZERO_ADDRESS } from './data/constants'
import getVaults from './data/vaults'
import getArchimedesData, { ArchimedesInfo } from './fetchers/archimedes'

type Chain = 80001

export default class TwoPi {
  readonly id:       string
  readonly chainId:  Chain
  readonly provider: Provider
  readonly signer:   Signer

  constructor(chainId: Chain, provider: Provider, signer?: Signer) {
    this.id       = `twoPi-${chainId}`
    this.chainId  = chainId
    this.provider = provider
    this.signer   = signer || new VoidSigner(ZERO_ADDRESS, provider)
  }

  getVaults(): Array<Vault> {
    return getVaults(this.chainId).map(data => new Vault(this, data))
  }

  async piTokenPerBlock(): Promise<BigNumberish | undefined> {
    const info = await this.getArchimedesData()

    return info?.piTokenPerBlock
  }

  async totalWeighing(): Promise<BigNumberish | undefined> {
    const info = await this.getArchimedesData()

    return info?.totalWeighing
  }

  private getArchimedesData(): Promise<ArchimedesInfo> {
    return getArchimedesData(this)
  }
}
