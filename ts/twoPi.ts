import { BigNumberish, Signer, VoidSigner } from 'ethers'
import { Provider } from '@ethersproject/abstract-provider'
import Vault from './vault'
import { ZERO_ADDRESS } from './data/constants'
import getVaults from './data/vaults'
import getArchimedesData, { ArchimedesInfo } from './fetchers/archimedes'
import getReferralData, { ReferralInfo } from './fetchers/referral'

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

  async referralTotalPaid(): Promise<BigNumberish | undefined> {
    const info = await this.getReferralData()

    return info?.totalPaid
  }

  async referralsCount(): Promise<BigNumberish | undefined> {
    const info = await this.getReferralData()

    return info?.referralsCount
  }

  async referralsPaid(): Promise<BigNumberish | undefined> {
    const info = await this.getReferralData()

    return info?.referralsPaid
  }

  private getArchimedesData(): Promise<ArchimedesInfo> {
    return getArchimedesData(this)
  }

  private getReferralData(): Promise<ReferralInfo> {
    return getReferralData(this)
  }
}
