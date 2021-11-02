# Welcome to 2PI SDK

Javascript SDK for building with 2PI Protocol

* [Homepage](https://2pi.network)
* [2PI App](https://app.2pi.network/)
* [Docs](https://docs.2pi.network)

# Installation

## Using yarn

```console
yarn add @2pi-network/js-sdk
```

## Using npm

```console
npm i @2pi-network/js-sdk
```

# Usage

Here is a quick look at using the SDK.

```js
const { Wallet }         = require('ethers')
const { InfuraProvider } = require('@ethersproject/providers')
const { TwoPi }          = require('@2pi-network/js-sdk')

// This is only required when used inside node.
// Otherwise you can use a wallet via web3 as usual
const walletPrivateKey = process.env.POLYGON_WALLET_PRIVATE_KEY

// We use Infura here, but any RCP provider should work
const projectId     = process.env.INFURA_PROJECT_ID
const projectSecret = process.env.INFURA_PROJECT_SECRET

const chainId  = 80001 // 80001 is Polygon testnet, best known as Mumbai
const provider = new InfuraProvider('maticmum', { projectId, projectSecret })
const wallet   = new Wallet(walletPrivateKey, provider)
const twoPi    = new TwoPi(chainId, provider, wallet)

twoPi.getVaults().forEach(async vault => {
  const apy = await vault.apy() || 0

  console.log(`${vault.id}\tAPY ${(apy * 100).toFixed(2)}%`)
})
```


## TwoPi instance

This is the entry point of almost any interaction. You will be asked to provide 3 arguments:

* The chain ID as an integer, for the time being the only supported value is 80001, which identifies Polygon Mumbai (test net).
* The provider, can be any RCP that supports the selected network.
* The wallet to be used for every operation that requires it.

### Public attributes

On every `twoPi` instance you can access the following attributes:

* `chainId`: the chain to be used.
* `provider`: the RPC provided instance.
* `signer`: the signer of any transaction that requires it (usually the user's wallet).

### Public methods

* `constructor(chainId, provider, signer)` refer to "Public attributes" to get a description of each argument.
* `getVaults()` it returns an array of Vault instances, initialized with this instance for the selected network.


## Vault instance

This class represents a unique vault and can be used to interact and query information.

### Public attributes

On every `vault` instance you can access the following attributes:

* `twoPi`: instance of the main TwoPi object being used.
* `id`: string with the vault unique identifier (in the form of network-token-pool, for example polygon-dai-aave).
* `token`: string identifying the token to be maximized.
* `earn`: string identifying what you'll be receiving as a reward.
* `priceId`: string identifying which price will be queried to the oracle.
* `oracle`: string identifying which oracle will be queried to obtain the token price.
* `uses`: string identifying the protocol being used (can be 'Aave' or 'Curve' at the time being).
* `pool`: string identifying the pool being used (can be 'aave' or 'curve' at the time being).
* `symbol`: string identifying the token symbol name.
* `pid`: string identifying pool ID on the Archimedes contract.
* `chainId`: number identifying the chain in which the vault it is deployed.
* `borrow`?: optional object containing the borrow depth and percentage used by the vault.

### Public methods

* `constructor(twoPi: TwoPi, data: {id, token, earn, priceId, uses, pool, symbol, chainId, borrow, twoPi})` refer to "Public attributes" to get a description of each argument and attribute.
* `signer()` returns the current assigned signer.
* `canSign()` whether the current signer is a read-only signer or not.
* `async shares()` returns the shares of the current signer.
* `async allowance()` returns the vault's allowance in wei for the current signer.
* `async balance()` returns the token balance in wei for the current signer.
* `async pendingPiTokens()` returns the vault available 2PI tokens to be claimed by the current signer.
* `async paidRewards()` returns the vault paid 2PI tokens to the current signer.
* `async decimals()` returns the vault's decimals (not to be confused with the token decimals).
* `async tokenDecimals()` returns the token decimal places (not to be confused with the vault decimals).
* `async pricePerFullShare()` returns the vault's current price for every share.
* `async tvl()` returns the vault's current overall balance.
* `async withdrawalFee()` returns the vault's current withdrawal fee as a BigNumber using 2 decimal places, so 10 should be interpreted as 0.1%.
* `async approve(amount)` sets amount of tokens in wei as vault allowance over the signer's tokens.
* `async deposit(amount, referral)` deposits the amount of tokens in wei specified by the argument. The referral argument is optional and should be a valid address if provided.
* `async depositAll(referral)` deposits all the tokens owned by the signer. In case of native tokens (like MATIC) a reserve is taken so the user can afford the transaction gas. The referral argument is optional and should be a valid address if provided.
* `async withdraw(amount)` withdraw and transfer to the signer wallet the amount of tokens in wei specified by the argument.
* `async withdrawAll()` withdraw all the deposited tokens and transfers them to the signer wallet.
* `async harvest()` claim all the 2PI tokens rewarded by the vault to the current signer.
* `async apy()` returns the vault current APY as a multiplier (for example, 10% it is represented as 0.1).

# Let's talk!

* [Join our #devs](https://discord.gg/fyc42N2d) channel on Discord!
