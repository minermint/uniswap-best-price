import * as Uniswap from '@uniswap/sdk'

/** @const base tokens for finding best path. The more base tokens the more
    accurate the pricing.
 */
export const BASES: {
  [chainId in Uniswap.ChainId]?: Array<{ address: string, symbol: string, name: string, decimals: number }>;
} = {
  [Uniswap.ChainId.MAINNET]: [
    {
      address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      symbol: 'WBTC',
      name: 'Wrapped BTC',
      decimals: 8
    },
    {
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      symbol: 'DAI',
      name: 'Dai Stable Coin',
      decimals: 18
    },
    {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      symbol: 'USDC',
      name: 'USDC',
      decimals: 6
    },
    {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      symbol: 'USDT',
      name: 'USDT',
      decimals: 6
    },
    {
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      symbol: 'WETH',
      name: 'WETH',
      decimals: 18
    }
  ],
  [Uniswap.ChainId.GÖRLI]: [
    {
      address: '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60',
      symbol: 'DAI',
      name: 'Dai Stable Coin',
      decimals: 18
    },
    {
      address: '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C',
      symbol: 'USDC',
      name: 'USDC',
      decimals: 6
    },
    {
      address: '0xC04B0d3107736C32e19F1c62b2aF67BE61d63a05',
      symbol: 'WBTC',
      name: 'Wrapped BTC',
      decimals: 6
    },
    {
      address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
      symbol: 'WETH',
      name: 'WETH',
      decimals: 18
    }
  ]
}
