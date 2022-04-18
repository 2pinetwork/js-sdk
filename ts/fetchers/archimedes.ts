import { BigNumberish } from 'ethers'
import { Contract, ContractCall, Provider } from 'ethers-multicall'
import { archimedesInfo } from '../abis'
import Batcher, { BatchedCall, toBatchedCalls } from './batcher'
import TwoPi from '../twoPi'

export type ArchimedesInfo = {
  [key: string]: BigNumberish
}

const callsFor = (ethcallProvider: Provider, twoPi: TwoPi): Array<BatchedCall> => {
  const archimedesData     = archimedesInfo(twoPi)
  const archimedesContract = new Contract(archimedesData.address, archimedesData.abi)

  return toBatchedCalls(twoPi, [
    ['piTokenPerBlock', archimedesContract.piTokenPerBlock()],
    ['totalWeighing',   archimedesContract.totalWeighing()]
  ])
}

class Fetcher extends Batcher {
  private data: {
    [key: string]: ArchimedesInfo
  }

  constructor() {
    // Refresh every 0.1 seconds
    super(0.1 * 1000)

    this.data = {}
  }

  public async getArchimedesData(twoPi: TwoPi): Promise<ArchimedesInfo> {
    await this.perform(twoPi)

    return this.data[twoPi.id]
  }

  protected getPromise(...args: Array<any>): Promise<void> {
    const twoPi: TwoPi    = args.shift()
    const ethcallProvider = new Provider(twoPi.provider, twoPi.chainId)
    const batchedCalls    = callsFor(ethcallProvider, twoPi)

    return this.runBatchedCalls(ethcallProvider, batchedCalls, this.data)
  }
}

const getArchimedesData = async (twoPi: TwoPi): Promise<ArchimedesInfo> => {
  const fetcher = Fetcher.getInstance(`archimedes-${twoPi.chainId}`)

  return await fetcher.getArchimedesData(twoPi)
}

export default getArchimedesData
