export interface BestPathOptions {
  selectedChainId?: number
  maxHops?: number
  maxNumResults?: number
}

export interface BestPathOptionsDefault extends BestPathOptions {
  selectedChainId: number
}
