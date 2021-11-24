const { JsonRpcProvider } = require('@ethersproject/providers')
const { TwoPi }           = require('@2pi-network/js-sdk')

const chainId  = 80001 // 80001 is Polygon testnet, best known as Mumbai
const rpcUrl   = 'https://matic-mumbai.chainstacklabs.com/'
const provider = new JsonRpcProvider(rpcUrl, chainId)

const main = async () => {
  const twoPi        = await TwoPi.create(provider)
  const logVaultApys = twoPi.getVaults().map(async vault => {
    const apy = await vault.apy() || 0

    console.log(`${vault.id}\tAPY ${(apy * 100).toFixed(2)}%`)
  })

  await Promise.all(logVaultApys)
}

main().then(() => {
  process.exit(0)
}).catch(error => {
  console.error(error)
  process.exit(1)
})
