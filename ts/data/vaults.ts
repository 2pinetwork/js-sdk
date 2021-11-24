export type VaultData = {
  id:      string
  token:   string
  earn:    string
  priceId: string
  oracle:  'api' | 'lps' | 'graph'
  uses:    'Aave' | 'Curve' | 'Sushi' | 'Pangolin' | '2pi'
  pool:    'aave' | 'curve' | 'sushi' | 'pangolin' | '2pi'
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
      oracle:  'graph',
      uses:    '2pi',
      pool:    '2pi',
      pid:     '-1',
      borrow:  { depth: 0, percentage: 0 },
      chainId
    },

    {
      id:      'polygon-dai-aave',
      token:   'dai',
      earn:    'DAI',
      priceId: 'dai',
      oracle:  'api',
      uses:    'Aave',
      pool:    'aave',
      pid:     '1',
      borrow:  { depth: 8, percentage: 0.73 },
      chainId
    },

    {
      id:      'polygon-matic-aave',
      token:   'matic',
      earn:    'MATIC',
      priceId: 'matic-network',
      oracle:  'api',
      uses:    'Aave',
      pool:    'aave',
      pid:     '0',
      borrow:  { depth: 8, percentage: 0.48 },
      chainId
    },

    {
      id:      'polygon-btc-aave',
      token:   'btc',
      earn:    'BTC',
      priceId: 'bitcoin',
      oracle:  'api',
      uses:    'Aave',
      pool:    'aave',
      pid:     '5',
      borrow:  { depth: 8, percentage: 0.68 },
      chainId
    },

    {
      id:      'polygon-eth-aave',
      token:   'eth',
      earn:    'ETH',
      priceId: 'ethereum',
      oracle:  'api',
      uses:    'Aave',
      pool:    'aave',
      pid:     '4',
      borrow:  { depth: 8, percentage: 0.78 },
      chainId
    },

    {
      id:      'polygon-usdc-aave',
      token:   'usdc',
      earn:    'USDC',
      priceId: 'usd-coin',
      oracle:  'api',
      uses:    'Aave',
      pool:    'aave',
      pid:     '3',
      borrow:  { depth: 8, percentage: 0.78 },
      chainId
    },

    {
      id:      'polygon-usdt-aave',
      token:   'usdt',
      earn:    'USDT',
      priceId: 'tether',
      oracle:  'api',
      uses:    'Aave',
      pool:    'aave',
      pid:     '2',
      borrow:  { depth: 0, percentage: 0 },
      chainId
    },

    {
      id:      'polygon-eth-2pi-sushi',
      token:   'eth-2pi',
      earn:    'ETH-2PI',
      priceId: 'eth-2pi',
      oracle:  'lps',
      uses:    'Sushi',
      pool:    'sushi',
      pid:     '7',
      borrow:  { depth: 0, percentage: 0 },
      chainId
    },

    {
      id:      'polygon-dai-2pi-sushi',
      token:   'dai-2pi',
      earn:    'DAI-2PI',
      priceId: 'dai-2pi',
      oracle:  'lps',
      uses:    'Sushi',
      pool:    'sushi',
      pid:     '6',
      borrow:  { depth: 0, percentage: 0 },
      chainId
    },

    {
      id:      'polygon-matic-2pi-sushi',
      token:   'matic-2pi',
      earn:    'MATIC-2PI',
      priceId: 'matic-2pi',
      oracle:  'lps',
      uses:    'Sushi',
      pool:    'sushi',
      pid:     '8',
      borrow:  { depth: 0, percentage: 0 },
      chainId
    }
  ]

  return vaults
}

const avalancheVaults = (chainId: number): Array<VaultData> => {
  const vaults: Array<VaultData> = [
    {
      id:      'avalanche-2pi-maxi',
      token:   '2pi',
      earn:    '2PI',
      priceId: '2pi',
      oracle:  'graph',
      uses:    '2pi',
      pool:    '2pi',
      pid:     '-1',
      borrow:  { depth: 0, percentage: 0 },
      chainId
    },

    {
      id:      'avalanche-avax-aave',
      token:   'avax',
      earn:    'AVAX',
      priceId: 'avalanche-2',
      oracle:  'api',
      uses:    'Aave',
      pool:    'aave',
      pid:     '0',
      borrow:  { depth: 8, percentage: 0.48 },
      chainId
    },

    {
      id:      'avalanche-btc-aave',
      token:   'btc',
      earn:    'BTC',
      priceId: 'bitcoin',
      oracle:  'api',
      uses:    'Aave',
      pool:    'aave',
      pid:     '2',
      borrow:  { depth: 8, percentage: 0.68 },
      chainId
    },

    {
      id:      'avalanche-eth-aave',
      token:   'eth',
      earn:    'ETH',
      priceId: 'ethereum',
      oracle:  'api',
      uses:    'Aave',
      pool:    'aave',
      pid:     '1',
      borrow:  { depth: 8, percentage: 0.78 },
      chainId
    },

    {
      id:      'avalanche-avax-2pi-pangolin',
      token:   'avax-2pi',
      earn:    'AVAX-2PI',
      priceId: 'avax-2pi',
      oracle:  'lps',
      uses:    'Pangolin',
      pool:    'pangolin',
      pid:     '3',
      borrow:  { depth: 0, percentage: 0 },
      chainId
    },

    {
      id:      'avalanche-btc-2pi-pangolin',
      token:   'btc-2pi',
      earn:    'BTC-2PI',
      priceId: 'btc-2pi',
      oracle:  'lps',
      uses:    'Pangolin',
      pool:    'pangolin',
      pid:     '5',
      borrow:  { depth: 0, percentage: 0 },
      chainId
    },

    {
      id:      'avalanche-eth-2pi-pangolin',
      token:   'eth-2pi',
      earn:    'ETH-2PI',
      priceId: 'eth-2pi',
      oracle:  'lps',
      uses:    'Pangolin',
      pool:    'pangolin',
      pid:     '4',
      borrow:  { depth: 0, percentage: 0 },
      chainId
    },

    {
      id:      'avalanche-dai-2pi-pangolin',
      token:   'dai-2pi',
      earn:    'DAI-2PI',
      priceId: 'dai-2pi',
      oracle:  'lps',
      uses:    'Pangolin',
      pool:    'pangolin',
      pid:     '6',
      borrow:  { depth: 0, percentage: 0 },
      chainId
    }
  ]

  return vaults
}

const vaults: { [key: number]: Array<VaultData> } = {
  43113: avalancheVaults(43113),
  80001: polygonVaults(80001)
}

const getVaults = (chainId: number): Array<VaultData> => {
  return vaults[chainId]
}

export default getVaults
