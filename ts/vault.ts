import { BigNumber, BigNumberish, Contract, ethers, Signer } from 'ethers'
import getApy from './helpers/apy'
import getData from './helpers/data'
import TwoPi from './twoPi'
import { VaultInfo } from './fetchers/data'

type Borrow           = { depth: number, percentage: number }
type PublicProperties = 'id'      |
                        'token'   |
                        'earn'    |
                        'priceId' |
                        'uses'    |
                        'pool'    |
                        'symbol'  |
                        'chainId' |
                        'borrow'  |
                        'twoPi'

export default class Vault {
  id:      string
  token:   string
  earn:    string
  priceId: string
  uses:    'Aave' | 'Curve'
  pool:    'aave' | 'curve'
  symbol:  string
  chainId: number
  borrow?: Borrow
  twoPi?:  TwoPi

  constructor(data: Pick<Vault, PublicProperties>) {
    this.id      = data.id
    this.token   = data.token
    this.earn    = data.earn
    this.priceId = data.priceId
    this.uses    = data.uses
    this.pool    = data.pool
    this.symbol  = data.symbol
    this.chainId = data.chainId
    this.borrow  = data.borrow
    this.twoPi   = data.twoPi
  }

  signer(): Signer | undefined {
    return this.twoPi?.signer
  }

  async shares(): Promise<BigNumberish | undefined> {
    const info = await this.getData()

    return info?.shares
  }

  async allowance(): Promise<BigNumberish | undefined> {
    const info = await this.getData()

    return info?.allowance
  }

  async balance(): Promise<BigNumberish | undefined> {
    const info = await this.getData()

    return info?.balance
  }

  async decimals(): Promise<BigNumberish | undefined> {
    const info = await this.getData()

    return info?.vaultDecimals
  }

  async tokenDecimals(): Promise<BigNumberish | undefined> {
    const info = await this.getData()

    return info?.tokenDecimals
  }

  async pricePerFullShare(): Promise<BigNumberish | undefined> {
    const info = await this.getData()

    return info?.pricePerFullShare
  }

  async tvl(): Promise<BigNumberish | undefined> {
    const info = await this.getData()

    return info?.tvl
  }

  async deposit(amount: BigNumberish): Promise<undefined> {
    const contract = this.contract()

    if (contract && this.twoPi) {
      const address = await this.twoPi.signer.getAddress()

      if (this.token === 'matic') {
        return contract.depositMATIC().send({ from: address, value: amount })
      } else {
        return contract.deposit(amount).send({ from: address })
      }
    }
  }

  async depositAll(): Promise<undefined> {
    const contract = this.contract()

    if (contract && this.twoPi) {
      const address = await this.twoPi.signer.getAddress()

      if (this.token === 'matic') {
        const amount = await this.maxDepositAmount()

        if (! amount || amount.lte(0)) {
          throw new Error('You need at least 0.025 MATIC')
        }

        return contract.depositMATIC().send({ from: address, value: amount })
      } else {
        return contract.depositAll().send({ from: address })
      }
    }
  }

  async withdraw(amount: BigNumberish): Promise<undefined> {
    const contract = this.contract()

    if (contract && this.twoPi) {
      const address = await this.twoPi.signer.getAddress()

      return contract.withdraw(amount).send({ from: address })
    }
  }

  async withdrawAll(): Promise<undefined> {
    const contract = this.contract()

    if (contract && this.twoPi) {
      const address = await this.twoPi.signer.getAddress()

      return contract.withdrawAll().send({ from: address })
    }
  }

  async apy(): Promise<number | undefined> {
    if (this.twoPi) {
      return await getApy(this.twoPi, this)
    }
  }

  protected contractData() {
    const path = `./abis/vaults/${this.chainId}/${this.pool}-${this.token}`

    return require(path).default
  }

  protected tokenData() {
    const path = `./abis/tokens/${this.chainId}/${this.token}`

    return require(path).default
  }

  protected contract(): Contract | undefined {
    if (this.signer()) {
      const contractData = this.contractData()

      return new ethers.Contract(
        contractData.address,
        contractData.abi,
        this.signer()
      )
    }
  }

  protected tokenContract(): Contract | undefined {
    if (this.signer()) {
      const tokenData = this.tokenData()

      return new ethers.Contract(
        tokenData.address,
        tokenData.abi,
        this.signer()
      )
    }
  }

  protected async maxDepositAmount(): Promise<BigNumber | undefined> {
    if (this.twoPi) {
      const reserve = BigNumber.from(`${0.025e18}`)
      const balance = await this.balance()

      if (balance) {
        const amount = BigNumber.from(balance).sub(reserve)

        return amount.gt(0) ? amount : BigNumber.from(0)
      }
    }
  }

  private async getData(): Promise<VaultInfo | undefined> {
    if (this.twoPi) {
      return await getData(this.twoPi, this)
    }
  }
}
