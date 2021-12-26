import { BigNumberish, Signer, VoidSigner } from 'ethers'
import { JsonRpcProvider } from '@ethersproject/providers'
import Vault from './vault'
import { ZERO_ADDRESS } from './data/constants'
import getVaults from './data/vaults'
import getArchimedesData, { ArchimedesInfo } from './fetchers/archimedes'
import getReferralData, { ReferralInfo } from './fetchers/referral'

type Chain = 43113 | 43114 | 80001

export default class TwoPi {
  readonly id:       string
  readonly chainId:  Chain
  readonly provider: JsonRpcProvider
  readonly signer:   Signer

  private constructor(chainId: Chain, provider: JsonRpcProvider, signer?: Signer) {
    this.id       = `twoPi-${chainId}`
    this.chainId  = chainId
    this.provider = provider
    this.signer   = signer || new VoidSigner(ZERO_ADDRESS, provider)
  }

  static async create(provider: JsonRpcProvider, signer?: Signer): Promise<TwoPi> {
    const currentSigner = signer || provider.getSigner()
    const chainId       = await currentSigner.getChainId() as Chain

    return new TwoPi(chainId, provider, currentSigner)
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
