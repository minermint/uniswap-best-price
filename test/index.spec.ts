import * as dotenv from 'dotenv'
import { ethers } from 'ethers'
import { Token, ChainId } from '@uniswap/sdk'
import { findBestPathExactTokenAToTokenB, findBestPathTokenAToExactTokenB } from '../src/index'

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
})
