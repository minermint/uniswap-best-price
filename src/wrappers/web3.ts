/**
 * Provides a web3 wrapper for native Best Price Path functions.
 */

import { Token, Trade } from '@uniswap/sdk'
import { Contract } from 'web3-eth-contract'
import { BestPriceOptions } from '../types/options'
import * as Base from '../index'
import { BEST_PRICE_OPTIONS, CHAIN_ID_DEFAULT } from '../constants/defaults'

/**
 * Finds the best price path for exactly the amount of tokenA.
 *
 * @param {Contract} tokenA The token in as an instance of web3.eth.Contract.
 * @param {Contract} tokenB The token out as an instance of web3.eth.Contract.
 * @param {any} exactTokenA The exact amount of token in. Is converted to a
 * string so number libraries such as BigNumber.js can be used provided there
 * is a toString() method available. Alternatively, provider the amount as a
 * string.
 * @param {any} provider A provider object compatible with the EIP-1193
 * standard.
 * @param {BestPriceOptions} opts One or more options for the best path
 * calculation. Overrides the default best price options.
 * @returns An array of token addresses representing the best price path from
 * tokenIn to tokenOut for the exact amount of tokenIn.
 */
export async function findBestPathExactTokenAToTokenB (tokenA: Contract, tokenB: Contract, exactTokenA: any, provider: any, opts: BestPriceOptions = {}): Promise<string[]> {
  const uniTokenA: Token = await fromWeb3ToUniswapToken(tokenA, opts)
  const uniTokenB: Token = await fromWeb3ToUniswapToken(tokenB, opts)

  return await Base.findBestPathExactTokenAToTokenB(uniTokenA, uniTokenB, exactTokenA, provider, opts)
}

/**
 * Finds one or more best price paths between tokenA and tokenB for an exact
 * amount of tokenA.
 *
 * @param {Contract} tokenA The token in as an instance of web3.eth.Contract.
 * @param {Contract} tokenB The token out as an instance of web3.eth.Contract.
 * @param {any} exactTokenA The exact amount of token in. Is converted to a
 * string so number libraries such as BigNumber.js can be used provided there
 * is a toString() method available. Alternatively, provider the amount as a
 * string.
 * @param {any} provider A provider object compatible with the EIP-1193
 * standard.
 * @param {BestPriceOptions} opts One or more options for the best path
 * calculation. Overrides the default best price options.
 * @returns A list of one or more best paths, each of which will contain an
 * array of token addresses representing the best price path from tokenB to
 * tokenB for the exact amount of tokenA.
 */
export async function computeExactTokenAToTokenB (tokenA: Contract, tokenB: Contract, exactTokenA: any, provider: any, opts: BestPriceOptions = {}): Promise<Trade[]> {
  const uniTokenA: Token = await fromWeb3ToUniswapToken(tokenA, opts)
  const uniTokenB: Token = await fromWeb3ToUniswapToken(tokenB, opts)

  return await Base.computeExactTokenAToTokenB(uniTokenA, uniTokenB, exactTokenA, provider, opts)
}

/**
 * Finds the best price path for exactly the amount of tokenB.
 *
 * @param {Contract} tokenA The token in as an instance of web3.eth.Contract.
 * @param {Contract} tokenB The token out as an instance of web3.eth.Contract.
 * @param {any} exactTokenB The exact amount of token in. Is converted to a
 * string so number libraries such as BigNumber.js can be used provided there
 * is a toString() method available. Alternatively, provider the amount as a
 * string.
 * @param {any} provider A provider object compatible with the EIP-1193
 * standard.
 * @param {BestPriceOptions} opts One or more options for the best path
 * calculation. Overrides the default best price options.
 * @returns An array of token addresses representing the best price path from
 * tokenIn to tokenOut for the exact amount of tokenIn.
 */
export async function findBestPathTokenAToExactTokenB (tokenA: Contract, tokenB: Contract, exactTokenB: any, provider: any, opts: BestPriceOptions = {}): Promise<string[]> {
  const uniTokenA: Token = await fromWeb3ToUniswapToken(tokenA, opts)
  const uniTokenB: Token = await fromWeb3ToUniswapToken(tokenB, opts)

  return await Base.findBestPathTokenAToExactTokenB(uniTokenA, uniTokenB, exactTokenB, provider, opts)
}

/**
 * Finds one or more best price paths between tokenA and tokenB for an exact
 * amount of tokenB.
 *
 * @param {Contract} tokenA The token in as an instance of web3.eth.Contract.
 * @param {Contract} tokenB The token out as an instance of web3.eth.Contract.
 * @param {any} exactTokenB The exact amount of token in. Is converted to a
 * string so number libraries such as BigNumber.js can be used provided there
 * is a toString() method available. Alternatively, provider the amount as a
 * string.
 * @param {any} provider A provider object compatible with the EIP-1193
 * standard.
 * @param {BestPriceOptions} opts One or more options for the best path
 * calculation. Overrides the default best price options.
 * @returns A list of one or more best paths, each of which will contain an
 * array of token addresses representing the best price path from tokenA to
 * tokenB for the exact amount of tokenB.
 */
export async function computeTokenAToExactTokenB (tokenA: Contract, tokenB: Contract, exactTokenB: any, provider: any, opts: BestPriceOptions = {}): Promise<Trade[]> {
  const uniTokenA: Token = await fromWeb3ToUniswapToken(tokenA, opts)
  const uniTokenB: Token = await fromWeb3ToUniswapToken(tokenB, opts)

  return await Base.computeTokenAToExactTokenB(uniTokenA, uniTokenB, exactTokenB, provider, opts)
}

/**
 * Converts an ERC20 token as represented by web3.eth.Contract to a
 * Uniswap.Token object.
 *
 * @param {Contract} token The token being converted.
 * @param {BestPriceOptions} opts One or more options for the best path
 * calculation. Overrides the default best price options.
 * @returns A Uniswap.Token representation of the ERC20 token.
 */
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
