const { Wallet }         = require('ethers')
const { InfuraProvider } = require('@ethersproject/providers')
const { Tpi }            = require('@2pi-network/sdk')

const projectId        = process.env.INFURA_PROJECT_ID
const projectSecret    = process.env.INFURA_PROJECT_SECRET
const walletPrivateKey = process.env.POLYGON_WALLET_PRIVATE_KEY

if (! projectId) {
  throw new Error('You must provide an Infura project ID via INFURA_PROJECT_ID env variable')
}

if (! projectSecret) {
  throw new Error('You must provide an Infura project secret via INFURA_PROJECT_SECRET env variable')
}

if (! walletPrivateKey) {
  throw new Error('You must provide a wallet private key via POLYGON_WALLET_PRIVATE_KEY env variable')
}

const chainId  = 80001 // 80001 is Polygon testnet, best known as Mumbai
const provider = new InfuraProvider('maticmum', { projectId, projectSecret })
const wallet   = new Wallet(walletPrivateKey, provider)
const tpi      = new Tpi(chainId, provider, wallet)

tpi.getVaults().forEach(async vault => {
  const apy = await vault.apy() || 0

  console.log(`${vault.id}\tAPY ${(apy * 100).toFixed(2)}%`)
})
