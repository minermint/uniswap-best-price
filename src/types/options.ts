export interface BestPriceOptions {
  selectedChainId?: number
  maxHops?: number
  maxNumResults?: number
}

export interface BestPriceOptionsDefault extends BestPriceOptions {
  selectedChainId: number
}
