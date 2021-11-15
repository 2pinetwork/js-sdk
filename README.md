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

# Public classes

* [TwoPi](#twopi-instance)
  * [Attributes](#twopi-public-attributes)
  * [Methods](#twopi-public-methods)
* [Vault](#vault-instance)
  * [Attributes](#vault-public-attributes)
  * [Methods](#vault-public-methods)
* [Token](#token-instance)
  * [Attributes](#token-public-attributes)
  * [Methods](#token-public-methods)
* [Zap](#zap-instance)
  * [Attributes](#zap-public-attributes)
  * [Methods](#zap-public-methods)


## TwoPi instance

This is the entry point of almost any interaction. You will be asked to provide 3 arguments:

* The chain ID as an integer, for the time being the only supported value is 80001, which identifies Polygon Mumbai (test net).
* The provider, can be any RCP that supports the selected network.
* The wallet to be used for every operation that requires it.

### TwoPi public attributes

On every `twoPi` instance you can access the following attributes:

* `id`: string with this instance identification, it contains the fixed string "twoPi" together with the `chainId` attribute, separated by an hyphen.
* `chainId`: the chain to be used.
* `provider`: the RPC provided instance.
* `signer`: the signer of any transaction that requires it (usually the user's wallet).

### TwoPi public methods

* `constructor(chainId, provider, signer)` refer to [TwoPi public attributes](#twopi-public-attributes) to get a description of each argument.
* `getVaults()` it returns an array of Vault instances, initialized with this instance for the selected network.
* `piTokenPerBlock()` it returns the amount of 2PI tokens per block assigned to liquidity mining.
* `totalWeighing()` it returns the sum of all the vault weighing, used to know the amount of tokens distributed to a given vault.
* `referralTotalPaid()` it returns the sum of all the rewards payed to referrals, expressed in PI token weis.
* `referralsCount()` it returns the amount of referrals for the current signer (if any).
* `referralsPaid()` it returns the amount of rewards paid to the current signer (if any), expressed in PI token weis.


## Vault instance

This class represents a unique vault and can be used to interact and query information.

### Vault public attributes

On every `vault` instance you can access the following attributes:

* `twoPi`: instance of the main TwoPi object being used.
* `id`: string with the vault unique identifier (in the form of network-token-pool, for example polygon-dai-aave).
* `address`: string with the vault main contract address.
* `token`: string identifying the token to be maximized.
* `earn`: string identifying what you'll be receiving as a reward.
* `priceId`: string identifying which price will be queried to the oracle.
* `oracle`: string identifying which oracle will be queried to obtain the token price.
* `uses`: string identifying the protocol being used (can be 'Aave' or 'Curve' at the time being).
* `pool`: string identifying the pool being used (can be 'aave' or 'curve' at the time being).
* `pid`: string identifying pool ID on the Archimedes contract.
* `chainId`: number identifying the chain in which the vault it is deployed.
* `borrow`?: optional object containing the borrow depth and percentage used by the vault.

### Vault public methods

* `constructor(twoPi: TwoPi, data: {id, token, earn, priceId, uses, pool, symbol, chainId, borrow, twoPi})` refer to [Vault public attributes](#vault-public-attributes) to get a description of each argument and attribute.
* `signer()` returns the current assigned signer.
* `canSign()` whether the current signer is a read-only signer or not.
* `isPowerVault()` returns true only for 2PI vault (since it is a _special_ vault, with no strategy nor transfers to other protocols).
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
* `async rewardsApr()` returns the vault current rewards APR as a multiplier (for example, 5% it is represented as 0.05).
* `async weighing()` returns the vault current weighing. This value is used to determine how many 2PI tokens will be assigned during liquidity mining. Relates to twoPi `totalWeighing`, with that you can calculate the portion of tokens given to the vault using `weighing / totalWeighing`.
* `async depositCap()` returns the vault current deposit cap (in wei using same decimals as want token). 0 means unlimited.
* `async availableDeposit()` returns the vault current maximum amount allowed to be deposited (in wei using same decimals as want token).
* `async paused()` returns true if the vault is paused (which means it does not accept deposits for the time being).


## Token instance

This class represents a unique token and can be used to interact and query information.

### Token public attributes

On every `token` instance you can access the following attributes:

* `name`: string identifying the token.
* `symbol`: string identifying the token symbol.
* `chainId`: number identifying the chain in which the vault it is deployed.
* `type`: string identifying the token type, can be `token` (means a single token) or `lp`.

### Token public methods

* `constructor(data: {name, chainId})` refer to [Token public attributes](#token-public-attributes) to get a description of each argument and attribute.
* `abiInfo()` returns an array of objects with `{address, abi, wabi}` for each individual token (just one when single token and multiple when LP). The `address` attribute contains the contract address, the `abi` and `wabi` attributes contains the ABI data for that token. Only one of both is guaranteed to be defined, `abi` represents the "direct" ABI and `wabi` represents the wrapper ABI. For example, in case of native tokens like "Matic", `abi` will be undefined and `wabi` will contain the "WMATIC" ABI.
* `addLiquidityUrl()` returns a string with the URL of an exchange that will allow adding liquidity to the current token (useful mostly for LPs).
* `names()` returns an array of strings with each individual token name. In case of single tokens is the same as `[token.name]`.
* `toString()` returns a string representation for the token.


## Zap instance

This class is used to swap and build LPs from single tokens. Basically a fancy and convenient wrapper so we can _omit_ going to an external exchange.

### Zap public attributes

On every `zap` instance you can access the following attributes:

* `twoPi`: instance of the main TwoPi object being used.

### Zap public methods

* `constructor(twoPi: TwoPi)` refer to [Zap public attributes](#zap-public-attributes) to get a description of each argument and attribute.
* `tokenAddresses()` returns the current supported tokens as a map with `tokenId` as keys and `tokenAddress` values.
* `async zapIn(from, to, amount)` swap `from` tokens for `to` tokens (both as addresses) by `amount` (expressed on wei using `from` units). If `to` address points to an LP, it will be automatically created and "balanced" on equal parts. If `to` is a simple token, it behaves like a usual swap.
* `async zapOut(from, amount)` split `from` LP token back to the "original" tokens, `amount` is expressed using the LP units in wei. It only works on LPs.
* `async estimateReceiveTokens(from, to, amount)` estimates the amount of tokens to be received in case of confirming the swap of `amount` tokens `from` to tokens `to`.

# Let's talk!

* [Join our #devs](https://discord.gg/fyc42N2d) channel on Discord!
