export interface BestPathOptions {
  selectedChainId?: number
  maxHops?: number
  maxNumResults?: number
  bases?: any[]
  additionalBases?: any[]
}

export interface BestPathOptionsDefault extends BestPathOptions {
  selectedChainId: number
}
