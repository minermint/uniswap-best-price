import { ChainId } from '@uniswap/sdk'
import { BestPriceOptions } from '../types/options'

export const MAX_HOPS_DEFAULT: number = 3
export const MAX_NUM_RESULTS_DEFAULT: number = 1

export const BEST_PRICE_OPTIONS: BestPriceOptions = {
  selectedChainId: ChainId.MAINNET,
  maxHops: MAX_HOPS_DEFAULT,
  maxNumResults: MAX_NUM_RESULTS_DEFAULT
}
