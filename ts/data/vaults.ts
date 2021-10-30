export type VaultData = {
  id:      string
  token:   string
  earn:    string
  priceId: string
  uses:    'Aave' | 'Curve' | 'Sushi' | '2pi'
  pool:    'aave' | 'curve' | 'sushi' | '2pi'
  symbol:  string
  pid:     string
  chainId: number
  borrow?: { depth: number, percentage: number }
}

const polygonVaults = (chainId: number): Array<VaultData> => {
  const vaults: Array<VaultData> = [
    {
      id:      'polygon-2pi-maxi',
      token:   '2pi',
      earn:    '2PI',
      priceId: '2pi',
      uses:    '2pi',
      pool:    '2pi',
      symbol:  '2PI',
      pid:     '-1',
      borrow:  { depth: 0, percentage: 0 },
      chainId
    },

    {
      id:      'polygon-dai-aave',
      token:   'dai',
      earn:    'DAI',
      priceId: 'dai',
      uses:    'Aave',
      pool:    'aave',
      symbol:  'DAI',
      pid:     '1',
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
      pid:     '0',
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
      pid:     '5',
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
      pid:     '4',
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
      pid:     '3',
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
      pid:     '2',
      borrow:  { depth: 0, percentage: 0 },
      chainId
    },

    {
      id:      'polygon-eth-2pi-sushi',
      token:   'eth-2pi',
      earn:    'ETH-2PI',
      priceId: 'eth-2pi',
      uses:    'Sushi',
      pool:    'sushi',
      symbol:  'ETH-2PI',
      pid:     '7',
      borrow:  { depth: 0, percentage: 0 },
      chainId
    },

    {
      id:      'polygon-dai-2pi-sushi',
      token:   'dai-2pi',
      earn:    'DAI-2PI',
      priceId: 'dai-2pi',
      uses:    'Sushi',
      pool:    'sushi',
      symbol:  'DAI-2PI',
      pid:     '6',
      borrow:  { depth: 0, percentage: 0 },
      chainId
    },

    {
      id:      'polygon-matic-2pi-sushi',
      token:   'matic-2pi',
      earn:    'MATIC-2PI',
      priceId: 'matic-2pi',
      uses:    'Sushi',
      pool:    'sushi',
      symbol:  'MATIC-2PI',
      pid:     '8',
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
