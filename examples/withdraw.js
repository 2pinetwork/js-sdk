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
  const twoPi   = await TwoPi.create(provider, wallet)
  const vault   = twoPi.getVaults().find(vault => vault.token.name === 'eth')
  const shares  = await vault.shares()
  const balance = await vault.balance()

  console.log('Wallet current vault shares balance in Wei', shares.toString())
  console.log('Wallet current token balance in Wei', balance.toString())

  // Remember that this amount is expressed in shares
  // Returns the ethers Transaction instance
  const withdrawTx = await vault.withdraw('10000')

  console.log('Withdraw transaction sent', withdrawTx.hash)

  // Returns the ethers TransactionReceipt instance
  const withdrawReceipt = await withdrawTx.wait()

  // Status === 1 means success, 0 means it was rejected
  if (withdrawReceipt.status) {
    console.log('Withdraw transaction completed', withdrawReceipt.transactionHash)
  } else {
    console.log('Withdraw transaction failed', withdrawReceipt.transactionHash)
  }

  const newShares  = await vault.shares()
  const newBalance = await vault.balance()

  // Do not expect shares to be increased equally in different times,
  // they vary as time, withdraw and rewards progresses
  console.log('New wallet vault shares balance in Wei, after withdraw', newShares.toString())
  // Balance indeed should be exactly less than withdraw.
  // Native tokens are the exceptions, since you need gas also =)
  console.log('New wallet token balance in Wei, after withdraw', newBalance.toString())
}

main().then(() => {
  process.exit(0)
}).catch(error => {
  console.error(error)
  process.exit(1)
})
