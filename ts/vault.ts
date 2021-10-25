import { BigNumber, BigNumberish, Contract, Signer, VoidSigner } from 'ethers'
import { VaultData } from './data/vaults'
import { tokenInfo, vaultInfo } from './abis'
import getApy from './helpers/apy'
import getPoolData, { VaultInfo } from './fetchers/pool'
import getWalletData from './fetchers/wallet'
import TwoPi from './twoPi'

type Referral = string | undefined

export default class Vault {
  readonly twoPi:    TwoPi
  readonly id:       string
  readonly token:    string
  readonly earn:     string
  readonly priceId:  string
  readonly uses:     'Aave' | 'Curve'
  readonly pool:     'aave' | 'curve'
  readonly symbol:   string
  readonly pid:      string
  readonly chainId:  number
  readonly borrow?:  { depth: number, percentage: number }

  constructor(twoPi: TwoPi, data: VaultData) {
    this.twoPi   = twoPi
    this.id      = data.id
    this.token   = data.token
    this.earn    = data.earn
    this.priceId = data.priceId
    this.uses    = data.uses
    this.pool    = data.pool
    this.symbol  = data.symbol
    this.pid     = data.pid
    this.chainId = data.chainId
    this.borrow  = data.borrow
  }

  signer(): Signer {
    return this.twoPi.signer
  }

  canSign(): boolean {
    return !(this.signer() instanceof VoidSigner)
  }

  async shares(): Promise<BigNumberish | undefined> {
    const info = await this.getWalletData()

    return info?.shares
  }

  async allowance(): Promise<BigNumberish | undefined> {
    const info = await this.getWalletData()

    return info?.allowance
  }

  async balance(): Promise<BigNumberish | undefined> {
    const info = await this.getWalletData()

    return info?.balance
  }

  async pendingPiTokens(): Promise<BigNumberish | undefined> {
    const info = await this.getWalletData()

    return info?.pendingPiTokens
  }

  async decimals(): Promise<BigNumberish | undefined> {
    const info = await this.getPoolData()

    return info?.vaultDecimals
  }

  async tokenDecimals(): Promise<BigNumberish | undefined> {
    const info = await this.getPoolData()

    return info?.tokenDecimals
  }

  async pricePerFullShare(): Promise<BigNumberish | undefined> {
    const info = await this.getPoolData()

    return info?.pricePerFullShare
  }

  async tvl(): Promise<BigNumberish | undefined> {
    const info = await this.getPoolData()

    return info?.tvl
  }

  async approve(amount: BigNumberish): Promise<undefined> {
    if (! this.canSign()) throw new Error('Missing signer')

    const contract = this.tokenContract()
    const spender  = vaultInfo(this).address
    const from     = await this.signer().getAddress()

    return contract.approve(spender, amount).send({ from })
  }

  async deposit(amount: BigNumberish, referral: Referral): Promise<undefined> {
    if (! this.canSign()) throw new Error('Missing signer')

    const contract = this.contract()
    const from     = await this.signer().getAddress()

    switch (this.token) {
      case '2Pi':
        return contract.deposit(amount).send({ from })
      case 'matic':
        return contract.depositMATIC(this.pid, referral).send({
          from, value: amount
        })
      default:
        return contract.deposit(this.pid, amount, referral).send({ from })
    }
  }

  async depositAll(referral: Referral): Promise<undefined> {
    if (! this.canSign()) throw new Error('Missing signer')

    const contract = this.contract()
    const from     = await this.signer().getAddress()

    if (this.token === '2Pi') {
      return contract.depositAll().send({ from })
    } else if (this.token === 'matic') {
      const balance = (await this.balance()) || 0
      const reserve = BigNumber.from(`${0.025e18}`)
      const amount  = BigNumber.from(balance).sub(reserve)

      if (amount.lte(0)) throw new Error('You need at least 0.025 MATIC')

      return contract.depositMATIC(this.pid, referral).send({
        from, value: amount
      })
    }

    return contract.depositAll(this.pid, referral).send({ from })
  }

  async withdraw(amount: BigNumberish): Promise<undefined> {
    if (! this.canSign()) throw new Error('Missing signer')

    const contract = this.contract()
    const from     = await this.signer().getAddress()

    if (this.token === '2Pi') {
      return contract.withdraw(amount).send({ from })
    } else {
      return contract.withdraw(this.pid, amount).send({ from })
    }
  }

  async withdrawAll(): Promise<undefined> {
    if (! this.canSign()) throw new Error('Missing signer')

    const contract = this.contract()
    const from     = await this.signer().getAddress()

    if (this.token === '2Pi') {
      return contract.withdrawAll().send({ from })
    } else {
      return contract.withdrawAll(this.pid).send({ from })
    }
  }

  async harvest(): Promise<undefined> {
    if (! this.canSign()) throw new Error('Missing signer')

    const contract = this.contract()
    const from     = await this.signer().getAddress()

    if (contract.harvest) {
      return contract.harvest(this.pid).send({ from })
    } else {
      throw new Error('There is nothing to harvest on this vault')
    }
  }

  async apy(): Promise<number | undefined> {
    return getApy(this.twoPi, this)
  }

  protected contract(): Contract {
    const { address, abi } = vaultInfo(this)

    return new Contract(address, abi, this.signer())
  }

  protected tokenContract(): Contract {
    const { address, abi } = tokenInfo(this)

    return new Contract(address, abi, this.signer())
  }

  private async getPoolData(): Promise<VaultInfo> {
    return getPoolData(this.twoPi, this)
  }

  private async getWalletData(): Promise<VaultInfo> {
    return getWalletData(this.twoPi, this)
  }
}
