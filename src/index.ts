import { Trade, Token, TokenAmount, JSBI } from '@uniswap/sdk'
import { getTradingPairs } from './trades'
import { BestPriceOptions } from './types/options'
import { BEST_PRICE_OPTIONS } from './constants/defaults'

export async function findBestPathExactTokenAToTokenB (tokenA: Token, tokenB: Token, exactTokenA: any, provider: any, opts: BestPriceOptions = {}): Promise<string[]> {
  const bestTrades: Trade[] = await computeExactTokenAToTokenB(tokenA, tokenB, exactTokenA, provider, opts)

  const bestTrade = bestTrades.pop()

  return bestTrade
    ? bestTrade.route.path.map((token) => token.address) ?? []
    : []
}

export async function computeExactTokenAToTokenB (tokenA: Token, tokenB: Token, exactTokenA: any, provider: any, opts: BestPriceOptions = {}): Promise<Trade[]> {
  const options: BestPriceOptions = { ...BEST_PRICE_OPTIONS, ...opts }

  const pairs = await getTradingPairs(tokenA, tokenB, provider, options)

  return Trade.bestTradeExactIn(
    pairs,
    new TokenAmount(
      tokenA,
      JSBI.BigInt(exactTokenA.toString())
    ),
    tokenB,
    { maxHops: options.maxHops, maxNumResults: options.maxNumResults }
  )
}

export async function findBestPathTokenAToExactTokenB (tokenA: Token, tokenB: Token, exactTokenB: any, provider: any, opts: BestPriceOptions = {}): Promise<string[]> {
  const bestTrades: Trade[] = await computeTokenAToExactTokenB(tokenA, tokenB, exactTokenB, provider, opts)

  const bestTrade = bestTrades.pop()

  return bestTrade
    ? bestTrade.route.path.map((token) => token.address) ?? []
    : []
}

export async function computeTokenAToExactTokenB (tokenA: Token, tokenB: Token, exactTokenB: any, provider: any, opts: BestPriceOptions = {}): Promise<Trade[]> {
  const options: BestPriceOptions = { ...BEST_PRICE_OPTIONS, ...opts }

  const pairs = await getTradingPairs(tokenA, tokenB, provider, options)

  return Trade.bestTradeExactOut(
    pairs,
    tokenA,
    new TokenAmount(
      tokenB,
      JSBI.BigInt(exactTokenB.toString())
    ),
    { maxHops: options.maxHops, maxNumResults: options.maxNumResults }
  )
}
