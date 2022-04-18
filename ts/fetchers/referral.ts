import { BigNumberish } from 'ethers'
import { Contract, ContractCall, Provider } from 'ethers-multicall'
import { referralInfo } from '../abis'
import Batcher, { BatchedCall, toBatchedCalls } from './batcher'
import TwoPi from '../twoPi'

export type ReferralInfo = {
  [key: string]: BigNumberish
}

const callsFor = (address: string | undefined, ethcallProvider: Provider, twoPi: TwoPi): Array<BatchedCall> => {
  const calls: Array<[string, ContractCall]> = []

  const referralData     = referralInfo(twoPi)
  const referralContract = new Contract(referralData.address, referralData.abi)

  if (address) {
    calls.push(['referralsCount', referralContract.referralsCount(address)])
    calls.push(['referralsPaid',  referralContract.referralsPaid(address)])
  }

  calls.push(['totalPaid', referralContract.totalPaid()])

  return toBatchedCalls(twoPi, calls)
}

class Fetcher extends Batcher {
  private data: {
    [key: string]: ReferralInfo
  }

  constructor() {
    // Refresh every 0.1 seconds
    super(0.1 * 1000)

    this.data = {}
  }

  public async getReferralData(twoPi: TwoPi): Promise<ReferralInfo> {
    const address = twoPi.signer && (await twoPi.signer.getAddress())

    await this.perform(address, twoPi)

    return this.data[twoPi.id]
  }

  protected getPromise(...args: Array<any>): Promise<void> {
    const address         = args.shift()
    const twoPi: TwoPi    = args.shift()
    const ethcallProvider = new Provider(twoPi.provider, twoPi.chainId)
    const batchedCalls    = callsFor(address, ethcallProvider, twoPi)

    return this.runBatchedCalls(ethcallProvider, batchedCalls, this.data)
  }
}

const getReferralData = async (twoPi: TwoPi): Promise<ReferralInfo> => {
  const fetcher = Fetcher.getInstance(`referral-${twoPi.chainId}`)

  return await fetcher.getReferralData(twoPi)
}

export default getReferralData
