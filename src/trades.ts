import { Token, Pair, Fetcher } from '@uniswap/sdk'
import flatMap from 'lodash.flatmap'
import { BASES } from './constants/tokens'
import { BEST_PRICE_OPTIONS } from './constants/defaults'
import { BestPriceOptions } from './types/options'

export const getAllTradingPairs = (
  fromToken: Token,
  toToken: Token,
  opts: BestPriceOptions = {}
): [Token, Token] => {
  const options: BestPriceOptions = { ...BEST_PRICE_OPTIONS, ...opts }

  const tokens: any[] = []

  BASES[options.selectedChainId].forEach((token: any) => {
    tokens.push(
      new Token(
        options.selectedChainId, // @TODO can we pull this from BASES?
        token.address,
        token.decimals,
        token.symbol,
        token.name
      )
    )
  })

  const pairs = []

  // add tokenA tokenB pair.
  pairs.push([fromToken, toToken])

  // add fromToken other tokens pairs
  pairs.push(...tokens.map((token) => [fromToken, token]))

  // add toToken other tokens pairs
  pairs.push(...tokens.map((token) => [toToken, token]))

  pairs.push(
    ...flatMap(tokens, (token) =>
      tokens.map((otherToken) => [token, otherToken])
    )
  )

  return pairs
    .filter(([t0, t1]) => t0.address !== t1.address)
    .reduce((previousValue: any, currentValue: any) => {
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

export const getTradingPairs = async (
  fromToken: Token,
  toToken: Token,
  provider: any,
  opts: BestPriceOptions = {}
): Promise<Pair[]> => {
  const pairs = []
  const allPairs = getAllTradingPairs(fromToken, toToken, opts)

  for (let i = 0; i < allPairs.length; i++) {
    try {
      pairs.push(
        await Fetcher.fetchPairData(
          allPairs[i][0],
          allPairs[i][1],
          provider
        )
      )
    } catch (error) {
      console.error(allPairs[i][0].symbol + ':' + allPairs[i][1].symbol, 'No reserve, ignoring...')
    }
  }

  return pairs
}
