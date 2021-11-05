import TwoPi from './twoPi'
import Vault from './vault'



// -- POOLS --

// Polygon testnet (Mumbai)
import mumbaiAavePool from './abis/pools/80001/aave'



// -- TOKENS --

// Polygon testnet (Mumbai)
import mumbai2piToken from './abis/tokens/80001/2Pi'
import mumbaiBtcToken from './abis/tokens/80001/btc'
import mumbaiDaiToken from './abis/tokens/80001/dai'
import mumbaiEthToken from './abis/tokens/80001/eth'
import mumbaiMaticToken from './abis/tokens/80001/matic'
import mumbaiUsdcToken from './abis/tokens/80001/usdc'
import mumbaiUsdtToken from './abis/tokens/80001/usdt'



// -- LPS --

// Polygon testnet (Mumbai)
import mumbaiEth2piLp from './abis/lps/80001/eth-2pi'
import mumbaiDai2piLp from './abis/lps/80001/dai-2pi'
import mumbaiMatic2piLp from './abis/lps/80001/matic-2pi'



// -- VAULTS --

// Polygon testnet (Mumbai)
import mumbaiArchimedes from './abis/main/80001/archimedes'
import mumbai2pi from './abis/main/80001/2Pi'



// -- REFERRAL --

// Polygon testnet (Mumbai)
import mumbaiReferral from './abis/main/80001/referral'



// -- CONTROLLERS --

// Polygon testnet (Mumbai)
import {
  abi       as mumbaiControllerAbi,
  addresses as mumbaiControllerAddresses
} from './abis/main/80001/controller'

type AbiLib = {
  [key: number]: {
    [key: string]: any
  }
}

const archimedesAbis: AbiLib = {
  80001: mumbaiArchimedes
}

const referralAbis: AbiLib = {
  80001: mumbaiReferral
}

const poolAbis: AbiLib = {
  80001: {
    'aave': mumbaiAavePool
  }
}

const tokenAbis: AbiLib = {
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

export const archimedesInfo = (twoPi: TwoPi) => {
  return archimedesAbis[twoPi.chainId]
}

export const referralInfo = (twoPi: TwoPi) => {
  return referralAbis[twoPi.chainId]
}

export const poolInfo = (vault: Vault) => {
  return poolAbis[vault.chainId][vault.pool]
}

export const tokenInfo = (chainId: number, token: string) => {
  return tokenAbis[chainId][token]
}

export const vaultTokenInfo = (vault: Vault) => {
  return tokenInfo(vault.chainId, vault.token)
}

export const vaultInfo = (vault: Vault) => {
  return vaultAbis[vault.chainId][`${vault.pool}-${vault.token}`]
}

export const controllerInfo = (vault: Vault) => {
  return controllerAbis[vault.chainId][`${vault.pool}-${vault.token}`]
}
