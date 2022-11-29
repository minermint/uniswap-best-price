import { Token, Trade } from '@uniswap/sdk'
import { Contract } from 'web3-eth-contract'
import { BestPriceOptions } from '../types/options'
import * as Base from '../index'
import { BEST_PRICE_OPTIONS, CHAIN_ID_DEFAULT } from '../constants/defaults'

export async function findBestPathExactTokenAToTokenB (tokenA: Contract, tokenB: Contract, exactTokenA: any, provider: any, opts: BestPriceOptions = {}): Promise<string[]> {
  const uniTokenA: Token = await fromWeb3ToUniswapToken(tokenA, opts)
  const uniTokenB: Token = await fromWeb3ToUniswapToken(tokenB, opts)

  return await Base.findBestPathExactTokenAToTokenB(uniTokenA, uniTokenB, exactTokenA, provider, opts)
}

export async function computeExactTokenAToTokenB (tokenA: Contract, tokenB: Contract, exactTokenA: any, provider: any, opts: BestPriceOptions = {}): Promise<Trade[]> {
  const uniTokenA: Token = await fromWeb3ToUniswapToken(tokenA, opts)
  const uniTokenB: Token = await fromWeb3ToUniswapToken(tokenB, opts)

  return await Base.computeExactTokenAToTokenB(uniTokenA, uniTokenB, exactTokenA, provider, opts)
}

export async function findBestPathTokenAToExactTokenB (tokenA: Contract, tokenB: Contract, exactTokenB: any, provider: any, opts: BestPriceOptions = {}): Promise<string[]> {
  const uniTokenA: Token = await fromWeb3ToUniswapToken(tokenA, opts)
  const uniTokenB: Token = await fromWeb3ToUniswapToken(tokenB, opts)

  return await Base.findBestPathTokenAToExactTokenB(uniTokenA, uniTokenB, exactTokenB, provider, opts)
}

export async function computeTokenAToExactTokenB (tokenA: Contract, tokenB: Contract, exactTokenB: any, provider: any, opts: BestPriceOptions = {}): Promise<Trade[]> {
  const uniTokenA: Token = await fromWeb3ToUniswapToken(tokenA, opts)
  const uniTokenB: Token = await fromWeb3ToUniswapToken(tokenB, opts)

  return await Base.computeTokenAToExactTokenB(uniTokenA, uniTokenB, exactTokenB, provider, opts)
}

export async function fromWeb3ToUniswapToken (token: Contract, opts: BestPriceOptions = {}): Promise<Token> {
  const options: BestPriceOptions = { ...BEST_PRICE_OPTIONS, ...opts }

  return new Token(
    options.selectedChainId ?? CHAIN_ID_DEFAULT,
    token.options.address,
    await token.methods.decimals().call(),
    await token.methods.symbol().call(),
    await token.methods.name().call()
  )
}
