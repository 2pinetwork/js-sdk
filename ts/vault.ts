import { BigNumber, BigNumberish, Contract, Signer, Transaction, VoidSigner } from 'ethers'
import { VaultData } from './data/vaults'
import { ZERO_ADDRESS } from './data/constants'
import { vaultTokenInfo, vaultInfo } from './abis'
import getApy from './helpers/apy'
import getPoolData, { VaultInfo } from './fetchers/pool'
import getWalletData from './fetchers/wallet'
import TwoPi from './twoPi'

type Referral = string | undefined

export default class Vault {
  readonly twoPi:    TwoPi
  readonly id:       string
  readonly address:  string
  readonly token:    string
  readonly earn:     string
  readonly priceId:  string
  readonly oracle:   'api' | 'lps' | 'graph'
  readonly uses:     'Aave' | 'Curve' | 'Sushi' | '2pi'
  readonly pool:     'aave' | 'curve' | 'sushi' | '2pi'
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
    this.oracle  = data.oracle
    this.uses    = data.uses
    this.pool    = data.pool
    this.symbol  = data.symbol
    this.pid     = data.pid
    this.chainId = data.chainId
    this.borrow  = data.borrow
    this.address = vaultInfo(this).address
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

  async paidRewards(): Promise<BigNumberish | undefined> {
    const info = await this.getWalletData()

    return info?.paidRewards
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

  async withdrawalFee(): Promise<BigNumberish | undefined> {
    const info = await this.getPoolData()

    return this.token === '2pi' ? BigNumber.from(0) : info?.withdrawalFee
  }

  approve(amount: BigNumberish): Promise<Transaction> {
    if (! this.canSign()) throw new Error('Missing signer')

    const contract = this.tokenContract()
    const spender  = vaultInfo(this).address

    return contract.approve(spender, amount)
  }

  deposit(amount: BigNumberish, referral: Referral): Promise<Transaction> {
    if (! this.canSign()) throw new Error('Missing signer')

    const ref      = referral || ZERO_ADDRESS
    const contract = this.contract()

    switch (this.token) {
      case '2pi':
        return contract.deposit(amount)
      case 'matic':
        return contract.depositMATIC(this.pid, ref, { value: amount })
      default:
        return contract.deposit(this.pid, amount, ref)
    }
  }

  async depositAll(referral: Referral): Promise<Transaction> {
    if (! this.canSign()) throw new Error('Missing signer')

    const ref      = referral || ZERO_ADDRESS
    const contract = this.contract()

    if (this.token === '2pi') {
      return contract.depositAll()
    } else if (this.token === 'matic') {
      const balance = (await this.balance()) || 0
      const reserve = BigNumber.from(`${0.025e18}`)
      const amount  = BigNumber.from(balance).sub(reserve)

      if (amount.lte(0)) throw new Error('You need at least 0.025 MATIC')

      return contract.depositMATIC(this.pid, ref, { value: amount })
    }

    return contract.depositAll(this.pid, ref)
  }

  withdraw(amount: BigNumberish): Promise<Transaction> {
    if (! this.canSign()) throw new Error('Missing signer')

    const contract = this.contract()

    if (this.token === '2pi') {
      return contract.withdraw(amount)
    } else {
      return contract.withdraw(this.pid, amount)
    }
  }

  withdrawAll(): Promise<Transaction> {
    if (! this.canSign()) throw new Error('Missing signer')

    const contract = this.contract()

    if (this.token === '2pi') {
      return contract.withdrawAll()
    } else {
      return contract.withdrawAll(this.pid)
    }
  }

  harvest(): Promise<Transaction> {
    if (! this.canSign()) throw new Error('Missing signer')

    const contract = this.contract()

    if (contract.harvest) {
      return contract.harvest(this.pid)
    } else {
      throw new Error('There is nothing to harvest on this vault')
    }
  }

  apy(): Promise<number | undefined> {
    return getApy(this.twoPi, this)
  }

  rewardsApr(): Promise<number | undefined> {
    return Promise.resolve(0.06)
  }

  protected contract(): Contract {
    const { address, abi } = vaultInfo(this)

    return new Contract(address, abi, this.signer())
  }

  protected tokenContract(): Contract {
    const { address, abi } = vaultTokenInfo(this)

    return new Contract(address, abi, this.signer())
  }

  private getPoolData(): Promise<VaultInfo> {
    return getPoolData(this.twoPi, this)
  }

  private getWalletData(): Promise<VaultInfo> {
    return getWalletData(this.twoPi, this)
  }
}
