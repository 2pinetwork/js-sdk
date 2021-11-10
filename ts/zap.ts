import { BigNumberish, Contract, Signer, Transaction, VoidSigner } from 'ethers'
import { tokenAddresses, zapInfo } from './abis'
import TwoPi from './twoPi'

export default class Zap {
  readonly twoPi: TwoPi

  constructor(twoPi: TwoPi) {
    this.twoPi = twoPi
  }

  tokenAddresses(): Map<string, string> {
    return tokenAddresses(this.twoPi.chainId)
  }

  zapIn(from: string, to: string, amount: BigNumberish): Promise<Transaction> {
    if (! this.canSign()) throw new Error('Missing signer')

    const matic    = this.tokenAddresses().get('matic')
    const contract = this.contract()

    if (from === matic) {
      return contract.zapIn(to, { value: amount })
    } else {
      return contract.zapInToken(from, amount, to)
    }
  }

  zapOut(from: string, amount: BigNumberish): Promise<Transaction> {
    if (! this.canSign()) throw new Error('Missing signer')

    const contract = this.contract()

    return contract.zapOut(from, amount)
  }

  private signer(): Signer {
    return this.twoPi.signer
  }

  canSign(): boolean {
    return !(this.signer() instanceof VoidSigner)
  }

  private contract(): Contract {
    const { address, abi } = zapInfo(this.twoPi)

    return new Contract(address, abi, this.signer())
  }
}
