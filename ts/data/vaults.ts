import Vault from '../vault'

const polygonVaults = (chainId: number) => {
  const vaults = [
    new Vault({
      id:      'polygon-dai-aave',
      token:   'dai',
      earn:    'DAI',
      priceId: 'dai',
      uses:    'Aave',
      pool:    'aave',
      symbol:  'DAI',
      borrow:  { depth: 8, percentage: 0.73 },
      chainId
    }),

    new Vault({
      id:      'polygon-matic-aave',
      token:   'matic',
      earn:    'MATIC',
      priceId: 'matic-network',
      uses:    'Aave',
      pool:    'aave',
      symbol:  'MATIC',
      borrow:  { depth: 8, percentage: 0.48 },
      chainId
    }),

    new Vault({
      id:      'polygon-btc-aave',
      token:   'btc',
      earn:    'BTC',
      priceId: 'bitcoin',
      uses:    'Aave',
      pool:    'aave',
      symbol:  'BTC',
      borrow:  { depth: 8, percentage: 0.68 },
      chainId
    }),

    new Vault({
      id:      'polygon-eth-aave',
      token:   'eth',
      earn:    'ETH',
      priceId: 'ethereum',
      uses:    'Aave',
      pool:    'aave',
      symbol:  'ETH',
      borrow:  { depth: 8, percentage: 0.78 },
      chainId
    }),

    new Vault({
      id:      'polygon-usdc-aave',
      token:   'usdc',
      earn:    'USDC',
      priceId: 'usd-coin',
      uses:    'Aave',
      pool:    'aave',
      symbol:  'USDC',
      borrow:  { depth: 8, percentage: 0.78 },
      chainId
    }),

    new Vault({
      id:      'polygon-usdt-aave',
      token:   'usdt',
      earn:    'USDT',
      priceId: 'tether',
      uses:    'Aave',
      pool:    'aave',
      symbol:  'USDT',
      borrow:  { depth: 0, percentage: 0 },
      chainId
    })
  ]

  if (chainId === 137) {
    vaults.unshift(
      new Vault({
        id:      'polygon-btc-curve',
        token:   'btc',
        earn:    'BTC',
        priceId: 'bitcoin',
        uses:    'Curve',
        pool:    'curve',
        symbol:  'BTC',
        chainId
      })
    )
  }

  return vaults
}

const vaults: { [key: number]: Array<Vault> } = {
  137:   polygonVaults(137),
  80001: polygonVaults(80001)
}

const getVaults = (chainId: number): Array<Vault> => {
  return vaults[chainId]
}

export default getVaults
