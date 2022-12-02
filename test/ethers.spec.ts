import * as dotenv from 'dotenv'
import { ethers, Contract } from 'ethers'
import ArtifactERC20 from '@uniswap/v2-core/build/IERC20.json'
import { findBestPathExactTokenAToTokenB, findBestPathTokenAToExactTokenB } from '../src/wrappers/ethers.js'

dotenv.config()

jest.setTimeout(60000)

describe('Best Path - Ethers', () => {
  let tokenA: Contract, tokenB: Contract
  let provider: any

  beforeAll(() => {
    provider = new ethers.providers.JsonRpcProvider(process.env.MAINNET_URL ?? '')

    tokenA = new ethers.Contract('0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', ArtifactERC20.abi, provider)

    tokenB = new ethers.Contract('0xB4d930279552397bbA2ee473229f89Ec245bc365', ArtifactERC20.abi, provider)
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
