import { ChainId } from '@uniswap/sdk'
import { BestPriceOptions } from '../types/options'

export const CHAIN_ID_DEFAULT = ChainId.MAINNET
export const MAX_HOPS_DEFAULT: number = 3
export const MAX_NUM_RESULTS_DEFAULT: number = 1

export const BEST_PRICE_OPTIONS: BestPriceOptions = {
  selectedChainId: CHAIN_ID_DEFAULT,
  maxHops: MAX_HOPS_DEFAULT,
  maxNumResults: MAX_NUM_RESULTS_DEFAULT
}
