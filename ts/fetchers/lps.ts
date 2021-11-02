import { BigNumberish } from 'ethers'
import { Contract, ContractCall, Provider } from 'ethers-multicall'
import { tokenInfo, vaultTokenInfo } from '../abis'
import Batcher, { BatchedCall, toBatchedCalls } from './batcher'
import TwoPi from '../twoPi'
import Vault from '../vault'

type LpInfo = {
  [key: string]: BigNumberish
}

type LpsInfo = {
  [id: string]: LpInfo
}

const callsFor = (ethcallProvider: Provider, vault: Vault): Array<BatchedCall> => {
  const lpTokenData                = vaultTokenInfo(vault)
  const [ token0Data, token1Data ] = vault.token.split('-').map(tokenName => {
    return tokenInfo(vault.chainId, tokenName)
  })

  const token0Abi       = token0Data.abi || token0Data.wabi
  const token1Abi       = token1Data.abi || token1Data.wabi
  const lpTokenContract = new Contract(lpTokenData.address, lpTokenData.abi)
  const token0Contract  = new Contract(token0Data.address, token0Abi)
  const token1Contract  = new Contract(token1Data.address, token1Abi)

  return toBatchedCalls(vault, [
    ['decimals',       lpTokenContract.decimals()],
    ['totalSupply',    lpTokenContract.totalSupply()],
    ['token0Balance',  token0Contract.balanceOf(lpTokenData.address)],
    ['token0Decimals', token0Contract.decimals()],
    ['token1Balance',  token1Contract.balanceOf(lpTokenData.address)],
    ['token1Decimals', token1Contract.decimals()]
  ])
}

class Fetcher extends Batcher {
  private data: LpsInfo

  constructor() {
    // Refresh every 60 seconds
    super(60 * 1000)

    this.data = {}
  }

  protected getPromise(...args: Array<any>): Promise<void> {
    const twoPi: TwoPi    = args.shift()
    const ethcallProvider = new Provider(twoPi.provider, twoPi.chainId)

    const batchedCalls = twoPi.getVaults().flatMap(vault => {
      if (vault.oracle === 'lps') {
        return callsFor(ethcallProvider, vault)
      } else {
        return []
      }
    })

    return this.runBatchedCalls(ethcallProvider, batchedCalls, this.data)
  }

  public async getLpData(twoPi: TwoPi): Promise<LpsInfo> {
    await this.perform(twoPi)

    return this.data
  }
}

const fetcher = new Fetcher()

const getLpData = async (twoPi: TwoPi): Promise<LpsInfo> => {
  return await fetcher.getLpData(twoPi)
}

export default getLpData
