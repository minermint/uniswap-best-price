import * as dotenv from 'dotenv'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import ArtifactERC20 from '@uniswap/v2-core/build/IERC20.json'
import { findBestPathExactTokenAToTokenB, findBestPathTokenAToExactTokenB } from '../src/wrappers/web3'

dotenv.config()

jest.setTimeout(60000)

describe('Best Path - Web3', () => {
  let tokenA: Contract, tokenB: Contract
  let provider: any

  beforeAll(() => {
    const web3 = new Web3(process.env.MAINNET_URL ?? '')
    provider = web3.currentProvider

    tokenA = new web3.eth.Contract(ArtifactERC20.abi as AbiItem[], '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984')

    tokenB = new web3.eth.Contract(ArtifactERC20.abi as AbiItem[], '0xB4d930279552397bbA2ee473229f89Ec245bc365')
  })

  test('should compute best path for exact token A to token B', async () => {
    const path = await findBestPathExactTokenAToTokenB(tokenA, tokenB, '1000000000000000000', provider)

    expect(path[0]).toEqual(tokenA.options.address)
    expect(path[path.length - 1]).toEqual(tokenB.options.address)
  })

  test('should compute best path for token A to exact token B', async () => {
    const path = await findBestPathTokenAToExactTokenB(tokenA, tokenB, '1000000000000000000', provider)

    expect(path[0]).toEqual(tokenA.options.address)
    expect(path[path.length - 1]).toEqual(tokenB.options.address)
  })
})
