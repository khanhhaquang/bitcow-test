export const ABI_SS_TRADING_PAIR_V1_CREATOR = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'pairAddress',
        type: 'address'
      }
    ],
    name: 'CreatePair',
    type: 'event'
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'symbol',
            type: 'string'
          },
          {
            internalType: 'uint8',
            name: 'decimals',
            type: 'uint8'
          },
          {
            internalType: 'string',
            name: 'description',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'projectUrl',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'logoUrl',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'coingeckoId',
            type: 'string'
          }
        ],
        internalType: 'struct ITokenList.CreateTokenInfo',
        name: 'xTokenInfo',
        type: 'tuple'
      },
      {
        internalType: 'uint256',
        name: 'mintAmount',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'addLiquidityAmount',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'bitusdAddLiquidityAmount',
        type: 'uint256'
      },
      {
        internalType: 'uint64',
        name: 'protocolFeeShareThousandth_',
        type: 'uint64'
      },
      {
        internalType: 'uint64',
        name: 'feeMillionth_',
        type: 'uint64'
      },
      {
        internalType: 'address',
        name: 'protocolFeeAddress_',
        type: 'address'
      }
    ],
    name: 'createPair',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'tokenList_',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'LpTokenCreator_',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'pairList_',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'swapRouter_',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'bitusd_',
        type: 'address'
      }
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'LpTokenCreator_',
        type: 'address'
      }
    ],
    name: 'setCreateLpToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'pairList_',
        type: 'address'
      }
    ],
    name: 'setPairList',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'tokenList_',
        type: 'address'
      }
    ],
    name: 'setTokenList',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];
