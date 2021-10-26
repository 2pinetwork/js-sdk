export type VaultData = {
  id:      string
  token:   string
  earn:    string
  priceId: string
  uses:    'Aave' | 'Curve'
  pool:    'aave' | 'curve'
  symbol:  string
  pid:     string
  chainId: number
  borrow?: { depth: number, percentage: number }
}

const polygonVaults = (chainId: number): Array<VaultData> => {
  const vaults: Array<VaultData> = [
    {
      id:      'polygon-dai-aave',
      token:   'dai',
      earn:    'DAI',
      priceId: 'dai',
      uses:    'Aave',
      pool:    'aave',
      symbol:  'DAI',
      pid:     '4',
      borrow:  { depth: 8, percentage: 0.73 },
      chainId
    },

    {
      id:      'polygon-matic-aave',
      token:   'matic',
      earn:    'MATIC',
      priceId: 'matic-network',
      uses:    'Aave',
      pool:    'aave',
      symbol:  'MATIC',
      pid:     '3',
      borrow:  { depth: 8, percentage: 0.48 },
      chainId
    },

    {
      id:      'polygon-btc-aave',
      token:   'btc',
      earn:    'BTC',
      priceId: 'bitcoin',
      uses:    'Aave',
      pool:    'aave',
      symbol:  'BTC',
      pid:     '8',
      borrow:  { depth: 8, percentage: 0.68 },
      chainId
    },

    {
      id:      'polygon-eth-aave',
      token:   'eth',
      earn:    'ETH',
      priceId: 'ethereum',
      uses:    'Aave',
      pool:    'aave',
      symbol:  'ETH',
      pid:     '7',
      borrow:  { depth: 8, percentage: 0.78 },
      chainId
    },

    {
      id:      'polygon-usdc-aave',
      token:   'usdc',
      earn:    'USDC',
      priceId: 'usd-coin',
      uses:    'Aave',
      pool:    'aave',
      symbol:  'USDC',
      pid:     '6',
      borrow:  { depth: 8, percentage: 0.78 },
      chainId
    },

    {
      id:      'polygon-usdt-aave',
      token:   'usdt',
      earn:    'USDT',
      priceId: 'tether',
      uses:    'Aave',
      pool:    'aave',
      symbol:  'USDT',
      pid:     '5',
      borrow:  { depth: 0, percentage: 0 },
      chainId
    }
  ]

  return vaults
}

const vaults: { [key: number]: Array<VaultData> } = {
  80001: polygonVaults(80001)
}

const getVaults = (chainId: number): Array<VaultData> => {
  return vaults[chainId]
}

export default getVaults
