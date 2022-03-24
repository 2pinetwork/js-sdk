import { JsonFragment, Fragment } from '@ethersproject/abi'
import Token from './token'
import TwoPi from './twoPi'
import Vault from './vault'



// -- POOLS --

// Polygon testnet (Mumbai)
import mumbaiAavePool from './abis/pools/80001/aave'

// Avalanche testnet (Fuji)
import fujiAavePool from './abis/pools/43113/aave'

// Avalanche mainnet
import avaxAavePool from './abis/pools/43114/aave'


// -- TOKENS --

// Polygon testnet (Mumbai)
import polygonUsdcToken from './abis/tokens/137/usdc'

// Polygon testnet (Mumbai)
import mumbai2piToken from './abis/tokens/80001/2Pi'
import mumbaiBtcToken from './abis/tokens/80001/btc'
import mumbaiDaiToken from './abis/tokens/80001/dai'
import mumbaiEthToken from './abis/tokens/80001/eth'
import mumbaiMaticToken from './abis/tokens/80001/matic'
import mumbaiUsdcToken from './abis/tokens/80001/usdc'
import mumbaiUsdtToken from './abis/tokens/80001/usdt'

// Avalanche testnet (Fuji)
import fuji2piToken from './abis/tokens/43113/2Pi'
import fujiBtcToken from './abis/tokens/43113/btc'
import fujiDaiToken from './abis/tokens/43113/dai'
import fujiEthToken from './abis/tokens/43113/eth'
import fujiAvaxToken from './abis/tokens/43113/avax'

// Avalanche mainnet
import avaxDaiToken from './abis/tokens/43114/dai'


// -- LPS --

// Polygon testnet (Mumbai)
import mumbaiEth2piLp from './abis/lps/80001/eth-2pi'
import mumbaiDai2piLp from './abis/lps/80001/dai-2pi'
import mumbaiMatic2piLp from './abis/lps/80001/matic-2pi'

// Avalanche testnet (Fuji)
import fujiBtc2piLp from './abis/lps/43113/btc-2pi'
import fujiEth2piLp from './abis/lps/43113/eth-2pi'
import fujiDai2piLp from './abis/lps/43113/dai-2pi'
import fujiAvax2piLp from './abis/lps/43113/avax-2pi'



// -- VAULTS --


// Polygon (Matic)
import polygonArchimedes from './abis/main/137/archimedes'

// Polygon testnet (Mumbai)
import mumbaiArchimedes from './abis/main/80001/archimedes'
import mumbai2pi from './abis/main/80001/2Pi'

// Avalanche testnet (Fuji)
import fujiArchimedes from './abis/main/43113/archimedes'
import fuji2pi from './abis/main/43113/2Pi'

// Avalanche mainnet
import avaxArchimedes from './abis/main/43114/archimedes'


// -- REFERRAL --
//
// Polygon (Matic)
import polygonReferral from './abis/main/137/referral'

// Polygon testnet (Mumbai)
import mumbaiReferral from './abis/main/80001/referral'

// Avalanche testnet (Fuji)
import fujiReferral from './abis/main/43113/referral'

// Avalanche mainnet
import avaxReferral from './abis/main/43114/referral'


// -- ZAP --

// Polygon testnet (Mumbai)
import mumbaiZap from './abis/main/80001/zap'

// Polygon testnet (Fuji)
import fujiZap from './abis/main/43113/zap'



// -- CONTROLLERS --

// Polygon (Matic)
import {
  abi       as polygonControllerAbi,
  addresses as polygonControllerAddresses
} from './abis/main/137/controller'

// Polygon testnet (Mumbai)
import {
  abi       as mumbaiControllerAbi,
  addresses as mumbaiControllerAddresses
} from './abis/main/80001/controller'

// Avalanche testnet (Fuji)
import {
  abi       as fujiControllerAbi,
  addresses as fujiControllerAddresses
} from './abis/main/43113/controller'

// Avalanche mainnet
import {
  abi       as avaxControllerAbi,
  addresses as avaxControllerAddresses
} from './abis/main/43114/controller'


// -- STRATEGIES --

// Polygon (Matic)
import {
  abi       as polygonStrategyAbi,
  addresses as polygonStrategyAddresses
} from './abis/main/137/strategy'

// Polygon testnet (Mumbai)
import {
  abi       as mumbaiStrategyAbi,
  addresses as mumbaiStrategyAddresses
} from './abis/main/80001/strategy'

// Avalanche testnet (Fuji)
import {
  abi       as fujiStrategyAbi,
  addresses as fujiStrategyAddresses
} from './abis/main/43113/strategy'

// Avalanche mainnet
import {
  abi       as avaxStrategyAbi,
  addresses as avaxStrategyAddresses
} from './abis/main/43114/strategy'


// -- TYPES --

export type Abi = string[] | Fragment[] | JsonFragment[]

type AbiLib = {
  [key: number]: {
    [key: string]: Abi | any
  }
}



// -- HELPERS --

const archimedesAbis: AbiLib = {
  137:   polygonArchimedes,
  43113: fujiArchimedes,
  43114: avaxArchimedes,
  80001: mumbaiArchimedes
}

const referralAbis: AbiLib = {
  137:   polygonReferral,
  43113: fujiReferral,
  43114: avaxReferral,
  80001: mumbaiReferral
}

const zapAbis: AbiLib = {
  43113: fujiZap,
  80001: mumbaiZap
}

const poolAbis: AbiLib = {
  43113: {
    'aave': fujiAavePool
  },
  43114: {
    'aave': avaxAavePool
  },
  80001: {
    'aave': mumbaiAavePool
  }
}

const tokenAbis: AbiLib = {
  137: {
    'usdc': polygonUsdcToken
  },
  43113: {
    '2pi':      fuji2piToken,
    'avax':     fujiAvaxToken,
    'btc':      fujiBtcToken,
    'dai':      fujiDaiToken,
    'eth':      fujiEthToken,
    'avax-2pi': fujiAvax2piLp,
    'btc-2pi':  fujiBtc2piLp,
    'eth-2pi':  fujiEth2piLp,
    'dai-2pi':  fujiDai2piLp
  },
  43114: {
    'dai': avaxDaiToken
  },
  80001: {
    '2pi':       mumbai2piToken,
    'btc':       mumbaiBtcToken,
    'dai':       mumbaiDaiToken,
    'eth':       mumbaiEthToken,
    'matic':     mumbaiMaticToken,
    'usdc':      mumbaiUsdcToken,
    'usdt':      mumbaiUsdtToken,
    'eth-2pi':   mumbaiEth2piLp,
    'dai-2pi':   mumbaiDai2piLp,
    'matic-2pi': mumbaiMatic2piLp
  }
}

const vaultAbis: AbiLib = {
  137: {
    'mstable-usdc': polygonArchimedes
  },
  43113: {
    '2pi-2pi':           fuji2pi,
    'aave-btc':          fujiArchimedes,
    'aave-eth':          fujiArchimedes,
    'aave-avax':         fujiArchimedes,
    'pangolin-avax-2pi': fujiArchimedes,
    'pangolin-btc-2pi':  fujiArchimedes,
    'pangolin-eth-2pi':  fujiArchimedes,
    'pangolin-dai-2pi':  fujiArchimedes
  },
  43114: {
    'aave-dai': avaxArchimedes
  },
  80001: {
    '2pi-2pi':         mumbai2pi,
    'aave-btc':        mumbaiArchimedes,
    'aave-dai':        mumbaiArchimedes,
    'aave-eth':        mumbaiArchimedes,
    'aave-matic':      mumbaiArchimedes,
    'aave-usdc':       mumbaiArchimedes,
    'aave-usdt':       mumbaiArchimedes,
    'sushi-eth-2pi':   mumbaiArchimedes,
    'sushi-dai-2pi':   mumbaiArchimedes,
    'sushi-matic-2pi': mumbaiArchimedes
  }
}

const controllerAbis: AbiLib = {
  137: {
    'mstable-usdc': {
      abi:     polygonControllerAbi,
      address: polygonControllerAddresses['polygon-usdc-mstable']
    }
  },
  43113: {
    'aave-avax': {
      abi:     fujiControllerAbi,
      address: fujiControllerAddresses['avalanche-avax-aave']
    },
    'aave-btc': {
      abi:     fujiControllerAbi,
      address: fujiControllerAddresses['avalanche-btc-aave']
    },
    'aave-eth': {
      abi:     fujiControllerAbi,
      address: fujiControllerAddresses['avalanche-eth-aave']
    },
    'pangolin-avax-2pi': {
      abi:     fujiControllerAbi,
      address: fujiControllerAddresses['avalanche-avax-2pi-pangolin']
    },
    'pangolin-btc-2pi': {
      abi:     fujiControllerAbi,
      address: fujiControllerAddresses['avalanche-btc-2pi-pangolin']
    },
    'pangolin-eth-2pi': {
      abi:     fujiControllerAbi,
      address: fujiControllerAddresses['avalanche-eth-2pi-pangolin']
    },
    'pangolin-dai-2pi': {
      abi:     fujiControllerAbi,
      address: fujiControllerAddresses['avalanche-dai-2pi-pangolin']
    }
  },
  43114: {
    'aave-dai': {
      abi:     avaxControllerAbi,
      address: avaxControllerAddresses['avalanche-dai-aave']
    }
  },
  80001: {
    'aave-btc': {
      abi:     mumbaiControllerAbi,
      address: mumbaiControllerAddresses['polygon-btc-aave']
    },
    'aave-dai': {
      abi:     mumbaiControllerAbi,
      address: mumbaiControllerAddresses['polygon-dai-aave']
    },
    'aave-eth': {
      abi:     mumbaiControllerAbi,
      address: mumbaiControllerAddresses['polygon-eth-aave']
    },
    'aave-matic': {
      abi:     mumbaiControllerAbi,
      address: mumbaiControllerAddresses['polygon-matic-aave']
    },
    'aave-usdc': {
      abi:     mumbaiControllerAbi,
      address: mumbaiControllerAddresses['polygon-usdc-aave']
    },
    'aave-usdt': {
      abi:     mumbaiControllerAbi,
      address: mumbaiControllerAddresses['polygon-usdt-aave']
    },
    'sushi-eth-2pi': {
      abi:     mumbaiControllerAbi,
      address: mumbaiControllerAddresses['polygon-eth-2pi-sushi']
    },
    'sushi-dai-2pi': {
      abi:     mumbaiControllerAbi,
      address: mumbaiControllerAddresses['polygon-dai-2pi-sushi']
    },
    'sushi-matic-2pi': {
      abi:     mumbaiControllerAbi,
      address: mumbaiControllerAddresses['polygon-matic-2pi-sushi']
    }
  }
}

const strategyAbis: AbiLib = {
  137: {
    'mstable-usdc': {
      abi:     polygonStrategyAbi,
      address: polygonStrategyAddresses['polygon-usdc-mstable']
    }
  },
  43113: {
    'aave-avax': {
      abi:     fujiStrategyAbi,
      address: fujiStrategyAddresses['avalanche-avax-aave']
    },
    'aave-btc': {
      abi:     fujiStrategyAbi,
      address: fujiStrategyAddresses['avalanche-btc-aave']
    },
    'aave-eth': {
      abi:     fujiStrategyAbi,
      address: fujiStrategyAddresses['avalanche-eth-aave']
    },
    'pangolin-avax-2pi': {
      abi:     fujiStrategyAbi,
      address: fujiStrategyAddresses['avalanche-avax-2pi-pangolin']
    },
    'pangolin-btc-2pi': {
      abi:     fujiStrategyAbi,
      address: fujiStrategyAddresses['avalanche-btc-2pi-pangolin']
    },
    'pangolin-eth-2pi': {
      abi:     fujiStrategyAbi,
      address: fujiStrategyAddresses['avalanche-eth-2pi-pangolin']
    },
    'pangolin-dai-2pi': {
      abi:     fujiStrategyAbi,
      address: fujiStrategyAddresses['avalanche-dai-2pi-pangolin']
    }
  },
  43114: {
    'aave-dai': {
      abi:     avaxStrategyAbi,
      address: avaxStrategyAddresses['avalanche-dai-aave']
    },
  },
  80001: {
    'aave-btc': {
      abi:     mumbaiStrategyAbi,
      address: mumbaiStrategyAddresses['polygon-btc-aave']
    },
    'aave-dai': {
      abi:     mumbaiStrategyAbi,
      address: mumbaiStrategyAddresses['polygon-dai-aave']
    },
    'aave-eth': {
      abi:     mumbaiStrategyAbi,
      address: mumbaiStrategyAddresses['polygon-eth-aave']
    },
    'aave-matic': {
      abi:     mumbaiStrategyAbi,
      address: mumbaiStrategyAddresses['polygon-matic-aave']
    },
    'aave-usdc': {
      abi:     mumbaiStrategyAbi,
      address: mumbaiStrategyAddresses['polygon-usdc-aave']
    },
    'aave-usdt': {
      abi:     mumbaiStrategyAbi,
      address: mumbaiStrategyAddresses['polygon-usdt-aave']
    },
    'sushi-eth-2pi': {
      abi:     mumbaiStrategyAbi,
      address: mumbaiStrategyAddresses['polygon-eth-2pi-sushi']
    },
    'sushi-dai-2pi': {
      abi:     mumbaiStrategyAbi,
      address: mumbaiStrategyAddresses['polygon-dai-2pi-sushi']
    },
    'sushi-matic-2pi': {
      abi:     mumbaiStrategyAbi,
      address: mumbaiStrategyAddresses['polygon-matic-2pi-sushi']
    }
  }
}

export const archimedesInfo = (twoPi: TwoPi) => {
  return archimedesAbis[twoPi.chainId]
}

export const referralInfo = (twoPi: TwoPi) => {
  return referralAbis[twoPi.chainId]
}

export const zapInfo = (twoPi: TwoPi) => {
  return zapAbis[twoPi.chainId]
}

export const poolInfo = (vault: Vault) => {
  return poolAbis[vault.chainId][vault.pool]
}

export const tokenAddresses = (chainId: number) => {
  const abis   = tokenAbis[chainId]
  const result = new Map()

  for (const [token, data] of Object.entries(abis)) {
    result.set(token, data.address)
  }

  return result
}

export const tokenInfo = (chainId: number, token: Token) => {
  return tokenAbis[chainId][token.name]
}

export const vaultTokenInfo = (vault: Vault) => {
  return tokenInfo(vault.chainId, vault.token)
}

export const vaultInfo = (vault: Vault) => {
  return vaultAbis[vault.chainId][`${vault.pool}-${vault.token.name}`]
}

export const controllerInfo = (vault: Vault) => {
  return controllerAbis[vault.chainId][`${vault.pool}-${vault.token.name}`]
}

export const strategyInfo = (vault: Vault) => {
  return strategyAbis[vault.chainId][`${vault.pool}-${vault.token.name}`]
}
