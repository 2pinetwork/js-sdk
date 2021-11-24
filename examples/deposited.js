// You should be using some sort of mechanism to operate safely with big numbers,
// We are using bignumber.js but in no way is the only alternative.
const BigNumber           = require('bignumber.js')
const { Wallet }          = require('ethers')
const { JsonRpcProvider } = require('@ethersproject/providers')
const { TwoPi }           = require('@2pi-network/js-sdk')

const walletPrivateKey = process.env.POLYGON_WALLET_PRIVATE_KEY

if (! walletPrivateKey) {
  throw new Error('You must provide a wallet private key via POLYGON_WALLET_PRIVATE_KEY env variable')
}

const chainId  = 80001 // 80001 is Polygon testnet, best known as Mumbai
const rpcUrl   = 'https://matic-mumbai.chainstacklabs.com/'
const provider = new JsonRpcProvider(rpcUrl, chainId)
const wallet   = new Wallet(walletPrivateKey, provider)

const main = async () => {
  const twoPi            = await TwoPi.create(provider, wallet)
  const logVaultDeposits = twoPi.getVaults().map(async vault => {
    const pricePerFullShare = new BigNumber(`${await vault.pricePerFullShare()}`)
    const sharesInWei       = new BigNumber(`${await vault.shares()}`)
    const vaultDecimals     = await vault.decimals()
    const tokenDecimals     = await vault.tokenDecimals()
    const shares            = sharesInWei.div(10 ** vaultDecimals)
    const sharePrice        = pricePerFullShare.div(10 ** tokenDecimals)
    const deposited         = shares.times(sharePrice)

    console.log(`${vault.id}\tDeposited tokens ${deposited.toFixed(6)}\t${vault.token.symbol}`)
  })

  await Promise.all(logVaultDeposits)
}

main().then(() => {
  process.exit(0)
}).catch(error => {
  console.error(error)
  process.exit(1)
})
