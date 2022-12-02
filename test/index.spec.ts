import * as dotenv from 'dotenv'
import { ethers } from 'ethers'
import { Token, ChainId } from '@uniswap/sdk'
import { findBestPathExactTokenAToTokenB, findBestPathTokenAToExactTokenB, BestPathOptions } from '../src/index.js'

dotenv.config()

jest.setTimeout(60000)

describe('Best Path', () => {
  let tokenA: Token, tokenB: Token
  let provider: any

  beforeAll(() => {
    provider = new ethers.providers.JsonRpcProvider(process.env.MAINNET_URL ?? '')

    tokenA = new Token(
      ChainId.MAINNET,
      '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      18,
      'UNI',
      'Uniswap'
    )

    tokenB = new Token(
      ChainId.MAINNET,
      '0xB4d930279552397bbA2ee473229f89Ec245bc365',
      18,
      'MAHA',
      'MahaDAO'
    )
  })

  test('should compute best path for exact token A to token B', async () => {
    const path = await findBestPathExactTokenAToTokenB(tokenA, tokenB, '1000000000000000000', provider)

    expect(path[0]).toEqual(tokenA.address)
    expect(path[path.length - 1]).toEqual(tokenB.address)
  })

  test('should compute best path for token A to exact token B', async () => {
    const path = await findBestPathTokenAToExactTokenB(tokenA, tokenB, '1000000000000000000', provider)

    expect(path[0]).toEqual(tokenA.address)
    expect(path[path.length - 1]).toEqual(tokenB.address)
  })

  test('should add another token to the base tokens', async () => {
    const additionalBases = [{
      address: '0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D',
      symbol: 'renBTC',
      name: 'renBTC',
      decimals: 8
    }]

    const opts: BestPathOptions = {
      additionalBases
    }

    const path = await findBestPathExactTokenAToTokenB(tokenA, tokenB, '1000000000000000000', provider, opts)

    expect(path[0]).toEqual(tokenA.address)
    expect(path[path.length - 1]).toEqual(tokenB.address)
  })

  test('should explicitly specify base tokens', async () => {
    const bases = [{
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      symbol: 'WETH',
      name: 'WETH',
      decimals: 18
    }]

    const opts: BestPathOptions = {
      bases
    }

    const path = await findBestPathExactTokenAToTokenB(tokenA, tokenB, '1000000000000000000', provider, opts)

    expect(path).toEqual([
      tokenA.address,
      bases[0].address,
      tokenB.address
    ])
  })
})
