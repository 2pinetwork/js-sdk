import Vault from './vault'



// -- POOLS --

// Polygon mainnet
import polygonAavePool from './abis/pools/137/aave'

// Polygon testnet (Mumbai)
import mumbaiAavePool from './abis/pools/80001/aave'



// -- TOKENS --

// Polygon mainnet
import polygonAaveBtcToken from './abis/tokens/137/aave-btc'
import polygonAaveDaiToken from './abis/tokens/137/aave-dai'
import polygonAaveEthToken from './abis/tokens/137/aave-eth'
import polygonAaveMaticToken from './abis/tokens/137/aave-matic'
import polygonAaveUsdcToken from './abis/tokens/137/aave-usdc'
import polygonAaveUsdtToken from './abis/tokens/137/aave-usdt'
import polygonCurveBtcToken from './abis/tokens/137/curve-btc'

// Polygon testnet (Mumbai)
import mumbaiBtcToken from './abis/tokens/80001/btc'
import mumbaiDaiToken from './abis/tokens/80001/dai'
import mumbaiEthToken from './abis/tokens/80001/eth'
import mumbaiMaticToken from './abis/tokens/80001/matic'
import mumbaiUsdcToken from './abis/tokens/80001/usdc'
import mumbaiUsdtToken from './abis/tokens/80001/usdt'



// -- VAULTS --

// Polygon mainnet
import polygonAaveBtcVault from './abis/vaults/137/aave-btc'
import polygonAaveDaiVault from './abis/vaults/137/aave-dai'
import polygonAaveEthVault from './abis/vaults/137/aave-eth'
import polygonAaveMaticVault from './abis/vaults/137/aave-matic'
import polygonAaveUsdcVault from './abis/vaults/137/aave-usdc'
import polygonAaveUsdtVault from './abis/vaults/137/aave-usdt'
import polygonCurveBtcVault from './abis/vaults/137/curve-btc'

// Polygon testnet (Mumbai)
import mumbaiAaveBtcVault from './abis/vaults/80001/aave-btc'
import mumbaiAaveDaiVault from './abis/vaults/80001/aave-dai'
import mumbaiAaveEthVault from './abis/vaults/80001/aave-eth'
import mumbaiAaveMaticVault from './abis/vaults/80001/aave-matic'
import mumbaiAaveUsdcVault from './abis/vaults/80001/aave-usdc'
import mumbaiAaveUsdtVault from './abis/vaults/80001/aave-usdt'

type AbiLib = {
  [key: number]: {
    [key: string]: any
  }
}

const poolAbis: AbiLib = {
  137: {
    'aave': polygonAavePool
  },
  80001: {
    'aave': mumbaiAavePool
  }
}

const tokenAbis: AbiLib = {
  137: {
    'aave-btc':   polygonAaveBtcToken,
    'aave-dai':   polygonAaveDaiToken,
    'aave-eth':   polygonAaveEthToken,
    'aave-matic': polygonAaveMaticToken,
    'aave-usdc':  polygonAaveUsdcToken,
    'aave-usdt':  polygonAaveUsdtToken,
    'curve-btc':  polygonCurveBtcToken
  },
  80001: {
    'btc':   mumbaiBtcToken,
    'dai':   mumbaiDaiToken,
    'eth':   mumbaiEthToken,
    'matic': mumbaiMaticToken,
    'usdc':  mumbaiUsdcToken,
    'usdt':  mumbaiUsdtToken,
  }
}

const vaultAbis: AbiLib = {
  137: {
    'aave-btc':   polygonAaveBtcVault,
    'aave-dai':   polygonAaveDaiVault,
    'aave-eth':   polygonAaveEthVault,
    'aave-matic': polygonAaveMaticVault,
    'aave-usdc':  polygonAaveUsdcVault,
    'aave-usdt':  polygonAaveUsdtVault,
    'curve-btc':  polygonCurveBtcVault
  },
  80001: {
    'aave-btc':   mumbaiAaveBtcVault,
    'aave-dai':   mumbaiAaveDaiVault,
    'aave-eth':   mumbaiAaveEthVault,
    'aave-matic': mumbaiAaveMaticVault,
    'aave-usdc':  mumbaiAaveUsdcVault,
    'aave-usdt':  mumbaiAaveUsdtVault
  }
}

export const poolInfo = (vault: Vault) => {
  return poolAbis[vault.chainId][vault.pool]
}

export const tokenInfo = (vault: Vault) => {
  let tokenId

  if (vault.chainId === 80001) {
    tokenId = vault.token
  } else {
    tokenId = `${vault.pool}-${vault.token}`
  }

  return tokenAbis[vault.chainId][tokenId]
}

export const vaultInfo = (vault: Vault) => {
  return vaultAbis[vault.chainId][`${vault.pool}-${vault.token}`]
}
