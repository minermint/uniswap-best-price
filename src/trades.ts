import { Token, Pair, Fetcher } from '@uniswap/sdk'
import flatMap from 'lodash.flatmap'
import { BASES } from './constants/tokens.js'
import { BEST_PATH_OPTIONS, CHAIN_ID_DEFAULT } from './constants/defaults.js'
import { BestPathOptions } from './options.js'
import { ethers } from 'ethers'

/**
 * Gets a list of all pairs based on a pre-determined list of high liquidity
 * tokens.
 *
 * See constants/tokens.ts for list of default tokens.
 *
 * @param {Token} fromToken The token in as an instance of Uniswap.Token.
 * @param {Token} toToken The token out as an instance of Uniswap.Token.
 * @param {BestPathOptions} opts One or more options for the best path
 * calculation. Overrides the default best path options.
 * @returns An array of possibly tradeable token pairs.
 */
const getAllPairs = (
  fromToken: Token,
  toToken: Token,
  opts: BestPathOptions = {}
): [Token, Token] => {
  const options: BestPathOptions = { ...BEST_PATH_OPTIONS, ...opts }

  const tokens: any[] = []

  console.log(options.additionalBases)

  let bases = options.bases !== undefined ? opts.bases : BASES[options.selectedChainId ?? CHAIN_ID_DEFAULT]

  if (options.additionalBases !== undefined) {
    bases = [...bases, ...options.additionalBases]
  }

  bases.forEach((token: any) => {
    tokens.push(
      new Token(
        options.selectedChainId ?? CHAIN_ID_DEFAULT, // @TODO can we pull this from BASES?
        token.address,
        token.decimals,
        token.symbol,
        token.name
      )
    )
  })

  const pairs: Array<[Token, Token]> = []

  // add tokenA tokenB pair.
  pairs.push([fromToken, toToken])

  // add fromToken other tokens pairs
  pairs.push(...tokens.map((token: Token): [Token, Token] => [fromToken, token]))

  // add toToken other tokens pairs
  pairs.push(...tokens.map((token: Token): [Token, Token] => [toToken, token]))

  pairs.push(
    ...flatMap(tokens, (token: Token) =>
      tokens.map((otherToken: Token): [Token, Token] => [token, otherToken])
    )
  )

  return pairs
    .filter(([t0, t1]) => t0.address !== t1.address)
    .reduce((previousValue: any, currentValue: any): [Token, Token] => {
      if (
        !previousValue.find(
          (value: any) =>
            value[0].address === currentValue[0].address &&
            value[1].address === currentValue[1].address
        )
      ) {
        previousValue.push(currentValue)
      }

      return previousValue
    }, [])
    .reduce((previousValue: any, currentValue: any) => {
      if (
        !previousValue.find(
          (value: any) =>
            value[0].address === currentValue[1].address &&
            value[1].address === currentValue[0].address
        )
      ) {
        previousValue.push(currentValue)
      }

      return previousValue
    }, [])
}

/**
 * Gets a list of the tradeable pairs.
 *
 * Pairs without liquidity are filtered out of the list.
 *
 * @param {Token} fromToken The token in as an instance of Uniswap.Token.
 * @param {Token} toToken The token out as an instance of Uniswap.Token.
 * @param {any} provider A provider object compatible with the EIP-1193
 * standard.
 * @param {BestPathOptions} opts One or more options for the best path
 * calculation. Overrides the default best path options.
 * @returns An array of tradeable pairs.
 */
export const getTradingPairs = async (
  fromToken: Token,
  toToken: Token,
  provider: any,
  opts: BestPathOptions = {}
): Promise<Pair[]> => {
  const pairs: Pair[] = []
  const allPairs: [Token, Token] = getAllPairs(fromToken, toToken, opts)

  for (let i = 0; i < allPairs.length; i++) {
    try {
      pairs.push(
        await Fetcher.fetchPairData(
          allPairs[i][0],
          allPairs[i][1],
          provider.constructor.name === 'HttpProvider' ? new ethers.providers.Web3Provider(provider as ethers.providers.ExternalProvider) : provider // simple test to wrap a web3 provider. Not sure how robust this is.
        )
      )
    } catch (error) {
      console.error(String(allPairs[i][0].symbol) + ':' + String(allPairs[i][1].symbol), 'No reserve, ignoring...')
    }
  }

  return pairs
}
