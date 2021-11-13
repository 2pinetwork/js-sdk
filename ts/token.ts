import { Abi, tokenInfo } from './abis'
import { BASE_SUSHI_ADD_URL } from './data/constants'

export default class Token {
  readonly name:    string
  readonly symbol:  string
  readonly chainId: number
  readonly type:    'token' | 'lp'

  constructor(data: { name: string, chainId: number }) {
    this.name    = data.name
    this.chainId = data.chainId
    this.symbol  = this.name.toUpperCase()
    this.type    = this.name.includes('-') ? 'lp' : 'token'
  }

  abiInfo(): Array<{address: string, abi?: Abi, wabi?: Abi}> {
    return this.names().map(tokenName => {
      const token = new Token({ name: tokenName, chainId: this.chainId })

      return tokenInfo(this.chainId, token)
    })
  }

  addLiquidityUrl(): string {
    const path = this.abiInfo().map(tokenInfo => tokenInfo.address).join('/')

    return `${BASE_SUSHI_ADD_URL}/${path}`
  }

  names(): Array<string> {
    return this.name.split('-')
  }

  toString(): string {
    return this.name
  }
}
