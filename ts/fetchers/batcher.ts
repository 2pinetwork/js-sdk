import { ContractCall } from 'ethers-multicall'
import Vault from '../vault'

export const toBatchedCalls = (vault: Vault, calls: Array<[string, ContractCall]>): Array<BatchedCall> => {
  return calls.map(([key, call]): BatchedCall => {
    return { id: vault.id, key, call }
  })
}

export type BatchedCall = {
  id:   string
  key:  string
  call: ContractCall
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
