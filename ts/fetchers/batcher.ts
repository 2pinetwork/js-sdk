import { ContractCall, Provider, setMulticallAddress } from 'ethers-multicall'
import Vault from '../vault'

type Identifiable = {
  id: string
}

export type BatchedCall = {
  id:   string
  key:  string
  call: ContractCall
}

type Data = {
  [key: string]: {
    [key: string]: {}
  }
}

const batchers: { [key: string]: any } = {}

export const toBatchedCalls = (identifiable: Identifiable, calls: Array<[string, ContractCall]>): Array<BatchedCall> => {
  return calls.map(([key, call]): BatchedCall => {
    return { id: identifiable.id, key, call }
  })
}

export default class Batcher {
  private promise:      Promise<void> | null
  private refreshedAt:  number | null
  private refreshEvery: number

  constructor(refreshEvery: number = 0.1 * 1000) {
    this.promise      = null
    this.refreshedAt  = null
    this.refreshEvery = refreshEvery

    // TODO: remove when included on ethers-multicall
    setMulticallAddress(43113, '0xD4FE9297023b845FdC94B3E4958C7Dd13Bd1A0af')
    setMulticallAddress(43114, '0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3')
  }

  static getInstance(key: string) {
    if (! batchers[key]) {
      batchers[key] = new this
    }

    return batchers[key]
  }

  protected getPromise(...args: Array<any>): Promise<void> {
    throw new Error('Must be implemented')
  }

  protected setRefreshedAt(date: Date): void {
    this.refreshedAt = date.getTime()
  }

  protected perform(...args: Array<any>): Promise<void> {
    if (this.promise) {
      this.maybeResetPromise()
    }

    if (! this.promise) {
      this.setPromise(...args)
    }

    return this.promise || Promise.resolve()
  }

  protected runBatchedCalls(ethcallProvider: Provider, batchedCalls: Array<BatchedCall>, data: Data): Promise<void> {
    const calls: Array<ContractCall> = batchedCalls.map((batchedCall): ContractCall => {
      return batchedCall.call
    })

    return ethcallProvider.all(calls).then(results => {
      results.forEach((result, i) => {
        const batchedCall: BatchedCall = batchedCalls[i]

        data[batchedCall.id]                  ||= {}
        data[batchedCall.id][batchedCall.key]   = result
      })

      this.setRefreshedAt(new Date())
    })
  }

  private maybeResetPromise() {
    if (this.refreshedAt) {
      const elapsed = Date.now() - this.refreshedAt

      if (elapsed > this.refreshEvery) {
        this.promise = null
      }
    }
  }

  private setPromise(...args: Array<any>) {
    this.promise = this.getPromise(...args)
  }
}
