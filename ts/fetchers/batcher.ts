import { ContractCall, Provider } from 'ethers-multicall'
import Vault from '../vault'

type Identifiable = {
  id: string
}

export const toBatchedCalls = (identifiable: Identifiable, calls: Array<[string, ContractCall]>): Array<BatchedCall> => {
  return calls.map(([key, call]): BatchedCall => {
    return { id: identifiable.id, key, call }
  })
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

export default class Batcher {
  private promise:      Promise<void> | null
  private refreshedAt:  Date | null
  private refreshEvery: number

  constructor(refreshEvery: number = 60 * 1000) {
    this.promise      = null
    this.refreshedAt  = null
    this.refreshEvery = refreshEvery
  }

  protected getPromise(...args: Array<any>): Promise<void> {
    throw new Error('Must be implemented')
  }

  protected setRefreshedAt(date: Date): void {
    this.refreshedAt = date
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
      const now     = new Date()
      const elapsed = now.getTime() - this.refreshedAt.getTime()

      if (elapsed > this.refreshEvery) {
        this.promise = null
      }
    }
  }

  private setPromise(...args: Array<any>) {
    this.promise = this.getPromise(...args)
  }
}
