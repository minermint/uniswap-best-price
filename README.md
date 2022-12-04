# uniswap-v2-best-path

A module for calculating trading paths via [Uniswap](https://uniswap.org)-based swap contracts with no setup. Works with the [Uniswap version 2 API & SDK](https://docs.uniswap.org/sdk/v2/overview).

## Managing price discrepancies and minimizing loss

Various factors are at play when calculating a swap between two tokens. Additional issues such as price movement, liquidity and gas fees can affect the eventual swap rate between two tokens. 

Therefore, this module does not promise that the best value swap will be found and there could be losses experienced during usage. It is your responsibility to determine whether the best path has been found before passing the returned path to a Uniswap swap contract. 

You (and/or your users) take full responsibility for the execution of the swap based on the path computed by this module.

## Installation

```
npm i @minertoken/uniswap-v2-best-path
```

## Usage

The Uniswap V2 Best Path module provides a simple method for calculating the best swap path between two tokens.

To calculate the best price path, pass two tokens, the token in and the token out, along with the amount of token in or token out you are expecting to swap.

Start by importing the module:

```
import * as BestPath from '@minertoken/uniswap-v2-best-path'
```

There are various ways to specify the tokenA and tokenB details. The native Best Path functions accept instances of the Uniswap.Token class, so you will need the `@uniswap/sdk` module installed:

```
npm i @uniswap/sdk
```

Import the relevant classes from the Uniswap SDK module:

```js
import { Token, ChainId } from '@uniswap/sdk'
```

Finally, initiate tokenA and tokenB:

```js
const tokenA = new Token(
  ChainId.MAINNET,
  '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  18,
  'UNI',
  'Uniswap'
)

const tokenB = new Token(
  ChainId.MAINNET,
  '0xB4d930279552397bbA2ee473229f89Ec245bc365',
  18,
  'MAHA',
  'MahaDAO'
)
```

### Specifying a valid Web3 provider

Before calling a best path method, a provider will need to be obtained. This is because the Uniswap V2 Core library requires a connection to the various Uniswap pool contracts in order to determine prices and liquidity of each swap.

Any [EIP 1193-compatible provider](https://eips.ethereum.org/EIPS/eip-1193) is acceptable. Please note, this module has only been tested with the Ethers.js and Web3 providers.

To obtain a provider, use your preferred method. For example, ethers.js provides various provider classes for connecting to an Ethereum-style node:

```
const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545')
```

### Finding the best path

Now that the module is imported, you can use `findBestPathExactTokenAToTokenB` and `findBestPathTokenAToExactTokenB`

To find the best path for swapping an exact amount of token A for token B:

```js
const path = BestPath.findBestPathExactTokenAToTokenB(tokenA, tokenB, '1000000000000000000', provider)
```

For the best path from token A to an exact amount of token B:

```js
const path = BestPath.findBestPathTokenAToExactTokenB(tokenA, tokenB, '1000000000000000000', provider)
```

### Finding alternative paths

There may be situations where the best price path is not the most optimal choice. For example, the best price path may require more gas than a less optimal path. 

To access a list of the best paths in order of best price to worst price, use `computeExactTokenAToTokenB` and `computeTokenAToExactTokenB`.

By default, the Uniswap Best Price module is configured to return the top three (3) best paths.

To return the first three paths for an exact amount of token A for token B:

```js
const path = BestPath.computeExactTokenAToTokenB(tokenA, tokenB, '1000000000000000000', provider)
```

To return the first three paths of token A for an exact amount of token B:

```js
const path = BestPath.computeTokenAToExactTokenB(tokenA, tokenB, '1000000000000000000', provider)
```

### The exact amount

The exact amount passed to any of the above functions can be of any type of object provided that:

a) The object passed defines a `toString()` method,
b) The value returned by `toString()` contains numbers only,
c) The string representation of the number is an integer (as required by Ethereum-based smart contracts).

This allows for the use of various BigNumber objects such as BigNumber.js and bn.js. Alternatively, a native string object can be provided.

### Overriding default options

Various options are provided for further configuration, allowing for changes to how the best path is determined. These include:

**chainId**
The chain to calculate best path for.
Default: 1

**maxHops**
The number of intermediary currencies to use when finding the best path. Default: 3

**maxNumResults**
The number of paths to return.
Default: 3

**bases**
The base tokens used for intermediary swaps. This should take the form:

```js
[{
  address: 'token address (checksummed)'
  symbol: 'TOKEN TICKER'
  name: 'TOKEN NAME'
  decimals: [0-18] // E.g. WETH would have 18
}]
```

This will fully override the default base tokens.

**additionalBases**
Additional base tokens used for intermediary swaps. These will be appended to the default base tokens (or the above `bases` overrides). This should take the form:

```js
[{
  address: 'token address (checksummed)'
  symbol: 'TOKEN TICKER'
  name: 'TOKEN NAME'
  decimals: [0-18] // E.g. WETH would have 18
}]
```

To override one or more options, pass them within an object:

```js
{
  chainId: Uniswap.ChainId.GOERLI
  maxHops: 5,
  maxNumResults: 3
}
```

### Wrappers

Various wrappers are provided for converting ERC20 tokens defined using other libraries such as web3 and ethers.js to Uniswap-based tokens.

To use a wrapper, include it instead of the native functions.

To use web3:

```js
import * as Web3BestPath from '@minertoken/uniswap-v2-best-path/wrappers/web3'
...
const path = Web3BestPath.computeExactTokenAToTokenB(tokenA, tokenB, '1000000000000000000', provider)
```

To use ethers: 

```js
import * as EthersBestPath from '@minertoken/uniswap-v2-best-path/wrappers/ethers'
...
const path = EthersBestPath.computeExactTokenAToTokenB(tokenA, tokenB, '1000000000000000000', provider)
```

## License

This software is licensed under the Gnu GPLv.3. If you would like to contribute to this project, please feel free to reach out either via a Github Issue or via a Github Pull Request.