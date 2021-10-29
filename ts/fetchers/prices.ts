import axios from 'axios'
import Batcher from './batcher'
import Vault from '../vault'
import getVaults from '../data/vaults'

const currency  = 'usd'
const oracleUrl = 'https://api.coingecko.com/api/v3/simple/price'

class Fetcher extends Batcher {
  private prices: {
    [key: string]: number
  }

  constructor() {
    // Refresh every 60 seconds
    super(60 * 1000)

    this.prices = {
      '2pi': 0.8 // TODO: remove when listed
    }
  }

  protected getPromise(...args: number[]): Promise<void> {
    const chainId  = args.find(_ => true) || 80001
    const priceIds = getVaults(chainId).map(vault => vault.priceId).join()

    if (priceIds) {
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

        this.setRefreshedAt(new Date())
      })
    } else {
      this.prices = { '2pi': 0.8 }

      return Promise.resolve(undefined)
    }
  }

  public async getPrices(chainId: number) {
    await this.perform(chainId)

    return this.prices
  }
}

const fetcher = new Fetcher()

const getPrices = async (chainId: number): Promise<{[key: string]: number}> => {
  return await fetcher.getPrices(chainId)
}

export const getPrice = async (vault: Vault): Promise<number> => {
  const prices = await getPrices(vault.chainId)

  return prices[vault.priceId]
}

export default getPrices
