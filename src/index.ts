import { Trade, Token, TokenAmount, JSBI } from '@uniswap/sdk'
import { getTradingPairs } from './trades.js'
import { BestPathOptions } from './options.js'
import { BEST_PATH_OPTIONS } from './constants/defaults.js'

export { BestPathOptions }

/**
 * Finds the best price path for exactly the amount of tokenA.
 *
 * @param {Token} tokenA The token in as an instance of Uniswap.Token.
 * @param {Token} tokenB The token out as an instance of Uniswap.Token.
 * @param {any} exactTokenA The exact amount of token in. Is converted to a
 * string so number libraries such as BigNumber.js can be used provided there
 * is a toString() method available. Alternatively, provider the amount as a
 * string.
 * @param {any} provider A provider object compatible with the EIP-1193
 * standard.
 * @param {BestPathOptions} opts One or more options for the best path
 * calculation. Overrides the default best path options.
 * @returns An array of token addresses representing the best price path from
 * tokenIn to tokenOut for the exact amount of tokenIn.
 */
export async function findBestPathExactTokenAToTokenB (tokenA: Token, tokenB: Token, exactTokenA: any, provider: any, opts: BestPathOptions = {}): Promise<string[]> {
  const bestTrades: Trade[] = await computeExactTokenAToTokenB(tokenA, tokenB, exactTokenA, provider, opts)

  const bestTrade = bestTrades.pop()

  return (bestTrade != null)
    ? bestTrade.route.path.map((token) => token.address) ?? []
    : []
}

/**
 * Finds one or more best price paths between tokenA and tokenB for an exact
 * amount of tokenA.
 *
 * @param {Token} tokenA The token in as an instance of Uniswap.Token.
 * @param {Token} tokenB The token out as an instance of Uniswap.Token.
 * @param {any} exactTokenA The exact amount of token in. Is converted to a
 * string so number libraries such as BigNumber.js can be used provided there
 * is a toString() method available. Alternatively, provider the amount as a
 * string.
 * @param {any} provider A provider object compatible with the EIP-1193
 * standard.
 * @param {BestPathOptions} opts One or more options for the best path
 * calculation. Overrides the default best path options.
 * @returns A list of one or more best paths, each of which will contain an
 * array of token addresses representing the best price path from tokenB to
 * tokenB for the exact amount of tokenA.
 */
export async function computeExactTokenAToTokenB (tokenA: Token, tokenB: Token, exactTokenA: any, provider: any, opts: BestPathOptions = {}): Promise<Trade[]> {
  const options: BestPathOptions = { ...BEST_PATH_OPTIONS, ...opts }

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

/**
 * Finds the best price path for exactly the amount of tokenB.
 *
 * @param {Token} tokenA The token in as an instance of Uniswap.Token.
 * @param {Token} tokenB The token out as an instance of Uniswap.Token.
 * @param {any} exactTokenB The exact amount of token in. Is converted to a
 * string so number libraries such as BigNumber.js can be used provided there
 * is a toString() method available. Alternatively, provider the amount as a
 * string.
 * @param {any} provider A provider object compatible with the EIP-1193
 * standard.
 * @param {BestPathOptions} opts One or more options for the best path
 * calculation. Overrides the default best path options.
 * @returns An array of token addresses representing the best price path from
 * tokenIn to tokenOut for the exact amount of tokenIn.
 */
export async function findBestPathTokenAToExactTokenB (tokenA: Token, tokenB: Token, exactTokenB: any, provider: any, opts: BestPathOptions = {}): Promise<string[]> {
  const bestTrades: Trade[] = await computeTokenAToExactTokenB(tokenA, tokenB, exactTokenB, provider, opts)

  const bestTrade = bestTrades.pop()

  return (bestTrade != null)
    ? bestTrade.route.path.map((token) => token.address) ?? []
    : []
}

/**
 * Finds one or more best price paths between tokenA and tokenB for an exact
 * amount of tokenB.
 *
 * @param {Token} tokenA The token in as an instance of Uniswap.Token.
 * @param {Token} tokenB The token out as an instance of Uniswap.Token.
 * @param {any} exactTokenB The exact amount of token in. Is converted to a
 * string so number libraries such as BigNumber.js can be used provided there
 * is a toString() method available. Alternatively, provider the amount as a
 * string.
 * @param {any} provider A provider object compatible with the EIP-1193
 * standard.
 * @param {BestPathOptions} opts One or more options for the best path
 * calculation. Overrides the default best path options.
 * @returns A list of one or more best paths, each of which will contain an
 * array of token addresses representing the best price path from tokenA to
 * tokenB for the exact amount of tokenB.
 */
export async function computeTokenAToExactTokenB (tokenA: Token, tokenB: Token, exactTokenB: any, provider: any, opts: BestPathOptions = {}): Promise<Trade[]> {
  const options: BestPathOptions = { ...BEST_PATH_OPTIONS, ...opts }

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
