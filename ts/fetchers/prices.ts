import { BigNumberish } from 'ethers'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import Batcher from './batcher'
import TwoPi from '../twoPi'
import Vault from '../vault'
import getVaults from '../data/vaults'
import getLpData from './lps'

const currency  = 'usd'
const oracleUrl = 'https://api.coingecko.com/api/v3/simple/price'
const graphUrls = {
  43113: 'https://api.thegraph.com/subgraphs/name/gwydce/fuji-pi',
  43114: 'https://api.thegraph.com/subgraphs/name/gwydce/fuji-pi', // don't really matters now
  80001: 'https://api.thegraph.com/subgraphs/name/gwydce/mumbai-pi'
}

const priceIds: { [token: string]: string }  = {
  '2pi': '2pi',
  avax:  'avalanche-2',
  dai:   'dai',
  matic: 'matic-network',
  btc:   'bitcoin',
  eth:   'ethereum',
  usdc:  'usd-coin',
  usdt:  'tether'
}

const extraApiPriceIds: { [chainId: number]: Array<string> } = {
  43113: ['dai', 'avalanche-2'],
  43114: ['dai', 'avalanche-2']
}

class Fetcher extends Batcher {
  private prices: {
    [key: string]: number
  }

  constructor() {
    // Refresh every 60 seconds
    super(60 * 1000)

    this.prices = {}
  }

  public async getPrices(twoPi: TwoPi) {
    await this.perform(twoPi)

    return this.prices
  }

  protected getPromise(...args: TwoPi[]): Promise<void> {
    const twoPi = args.find(_ => true) as TwoPi

    return (async () => {
      await Promise.all([
        this.getGraphPrices(twoPi),
        this.getApiPrices(twoPi)
      ])

      // Must be last, it depends on the other prices been set
      await this.getLpPrices(twoPi)

      this.setRefreshedAt(new Date())
    })()
  }

  private getGraphPrices(twoPi: TwoPi): Promise<void> {
    return axios.post(graphUrls[twoPi.chainId], {
      query: `{
        bundle(id: 0) {
          priceUSD
        }
      }`
    }).then(result => {
      const data = result.data.data as {
        bundle: {
          priceUSD: string
        }
      }

      this.prices['2pi'] = +data.bundle.priceUSD
    })
  }

  private getApiPrices(twoPi: TwoPi): Promise<void> {
    const priceIds = getVaults(twoPi.chainId).filter(vault => {
      return vault.oracle === 'api'
    }).map(vault => {
      return vault.priceId
    }).concat(
      extraApiPriceIds[twoPi.chainId] || []
    ).join()

    return axios.get(oracleUrl, {
      params: { ids: priceIds, vs_currencies: currency }
    }).then(result => {
      const data = result.data as {
        [key: string]: {
          [key: string]: number
        }
      }

      Object.entries(data).forEach(([token, values]) => {
        this.prices[token] = values[currency]
      })
    })
  }

  private getLpPrices(twoPi: TwoPi): Promise<void> {
    const vaults = twoPi.getVaults()

    return (async () => {
      const data = await getLpData(twoPi) as {
        [vaultId: string]: {
          decimals:       BigNumberish
          totalSupply:    BigNumberish
          token0Balance:  BigNumberish
          token0Decimals: BigNumberish
          token1Balance:  BigNumberish
          token1Decimals: BigNumberish
        }
      }

      Object.entries(data).forEach(([vaultId, values]) => {
        const vault              = vaults.find(v => v.id === vaultId) as Vault
        const [ token0, token1 ] = vault.token.names().map(t => priceIds[t])

        if (! (token0 && token1)) {
          throw new Error('LP tokens price ID was not found!')
        }

        const token0UsdBalance = new BigNumber(values.token0Balance.toString())
          .times(this.prices[token0])
          .div(values.token0Decimals.toString())

        const token1UsdBalance = new BigNumber(values.token1Balance.toString())
          .times(this.prices[token1])
          .div(values.token1Decimals.toString())

        this.prices[vault.priceId] = token0UsdBalance
          .plus(token1UsdBalance)
          .times(values.decimals.toString())
          .div(values.totalSupply.toString())
          .toNumber()
      })
    })()
  }
}

const getPrices = async (twoPi: TwoPi): Promise<{[key: string]: number}> => {
  const fetcher = Fetcher.getInstance(`prices-${twoPi.chainId}`)

  return await fetcher.getPrices(twoPi)
}

export const getPrice = async (vault: Vault): Promise<number> => {
  const prices = await getPrices(vault.twoPi)

  return prices[vault.priceId]
}

export default getPrices
