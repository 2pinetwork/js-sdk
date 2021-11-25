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
  const twoPi       = await TwoPi.create(provider, wallet)
  const vault       = twoPi.getVaults().find(vault => vault.token.name === 'eth')
  const shares      = await vault.shares()
  const balance     = await vault.balance()
  const decimals    = await vault.tokenDecimals()
  const amount      = new BigNumber('0.1') // this amount is expressed in ETH
  const amountInWei = amount.times(10 ** decimals).toFixed()

  console.log('Wallet current vault shares balance in Wei', shares.toString())
  console.log('Wallet current token balance in Wei', balance.toString())

  // For _native_ tokens, the approval step should be skipped
  // They will be Eth on Ethereum, Matic for Polygon and Avax for Avalanche
  // Returns the ethers Transaction instance
  const approveTx = await vault.approve(amountInWei)

  console.log('Approve transaction sent', approveTx.hash)

  // Returns the ethers TransactionReceipt instance
  const approveReceipt = await approveTx.wait()

  // Status === 1 means success, 0 means it was rejected
  if (approveReceipt.status) {
    console.log('Approve transaction completed', approveReceipt.transactionHash)
  } else {
    console.log('Approve transaction failed', approveReceipt.transactionHash)
  }

  // Returns the ethers Transaction instance
  const depositTx = await vault.deposit(amountInWei)

  console.log('Deposit transaction sent', depositTx.hash)

  // Returns the ethers TransactionReceipt instance
  const depositReceipt = await depositTx.wait()

  // Status === 1 means success, 0 means it was rejected
  if (depositReceipt.status) {
    console.log('Deposit transaction completed', depositReceipt.transactionHash)
  } else {
    console.log('Deposit transaction failed', depositReceipt.transactionHash)
  }

  const newShares  = await vault.shares()
  const newBalance = await vault.balance()

  // Do not expect shares to be increased equally in different times,
  // they vary as time, deposit and rewards progresses
  console.log('New wallet vault shares balance in Wei, after deposit', newShares.toString())
  // Balance indeed should be exactly less than deposit.
  // Native tokens are the exceptions, since you need gas also =)
  console.log('New wallet token balance in Wei, after deposit', newBalance.toString())
}

main().then(() => {
  process.exit(0)
}).catch(error => {
  console.error(error)
  process.exit(1)
})
