import { Token, Pair, Fetcher } from '@uniswap/sdk'
import flatMap from 'lodash.flatmap'
import { BASES } from './constants/tokens'
import { BEST_PRICE_OPTIONS, CHAIN_ID_DEFAULT } from './constants/defaults'
import { BestPriceOptions } from './types/options'
import { ethers } from 'ethers'

export const getAllTradingPairs = (
  fromToken: Token,
  toToken: Token,
  opts: BestPriceOptions = {}
): [Token, Token] => {
  const options: BestPriceOptions = { ...BEST_PRICE_OPTIONS, ...opts }

  const tokens: any[] = []

  BASES[options.selectedChainId ?? CHAIN_ID_DEFAULT].forEach((token: any) => {
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

export const getTradingPairs = async (
  fromToken: Token,
  toToken: Token,
  provider: any,
  opts: BestPriceOptions = {}
): Promise<Pair[]> => {
  const pairs: Pair[] = []
  const allPairs: [Token, Token] = getAllTradingPairs(fromToken, toToken, opts)

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
