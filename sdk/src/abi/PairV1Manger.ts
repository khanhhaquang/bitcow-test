export const ABI_PAIR_V1_MANAGER = [
  {
    inputs: [],
    name: 'InvalidInitialization',
    type: 'error'
  },
  {
    inputs: [],
    name: 'NotInitializing',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address'
      }
    ],
    name: 'OwnableInvalidOwner',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'pairAddress',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'xToken',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'yToken',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'creator',
        type: 'address'
      }
    ],
    name: 'CreatePair',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint64',
        name: 'version',
        type: 'uint64'
      }
    ],
    name: 'Initialized',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferStarted',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'tokenAddress',
            type: 'address'
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
        internalType: 'struct IPairV1Manager.AddTokenInfo',
        name: 'xToken',
        type: 'tuple'
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'tokenAddress',
            type: 'address'
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
        internalType: 'struct IPairV1Manager.AddTokenInfo',
        name: 'yToken',
        type: 'tuple'
      },
      {
        internalType: 'address',
        name: 'pairAddress',
        type: 'address'
      }
    ],
    name: 'addPair',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'tokenAddress',
            type: 'address'
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
        internalType: 'struct IPairV1Manager.AddTokenInfo',
        name: 'xToken',
        type: 'tuple'
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'tokenAddress',
            type: 'address'
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
        internalType: 'struct IPairV1Manager.AddTokenInfo',
        name: 'yToken',
        type: 'tuple'
      },
      {
        internalType: 'uint256',
        name: 'xLiquidityAmount',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'yLiquidityAmount',
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
        internalType: 'uint64',
        name: 'xPrice',
        type: 'uint64'
      },
      {
        internalType: 'uint64',
        name: 'yPrice',
        type: 'uint64'
      }
    ],
    name: 'createPair',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'pairs_',
        type: 'address[]'
      }
    ],
    name: 'fetchPairsStats',
    outputs: [
      {
        components: [
          {
            internalType: 'uint64',
            name: 'concentration',
            type: 'uint64'
          },
          {
            internalType: 'uint256',
            name: 'feeMillionth',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'protocolFeeShareThousandth',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'totalProtocolFeeX',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'totalProtocolFeeY',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'cumulativeVolume',
            type: 'uint256'
          },
          {
            components: [
              {
                internalType: 'uint256[7]',
                name: 'xProtocolFees',
                type: 'uint256[7]'
              },
              {
                internalType: 'uint256[7]',
                name: 'yProtocolFees',
                type: 'uint256[7]'
              },
              {
                internalType: 'uint256[7]',
                name: 'volumes',
                type: 'uint256[7]'
              }
            ],
            internalType: 'struct ISsTradingPairV1.FeeRecords',
            name: 'feeRecords',
            type: 'tuple'
          },
          {
            internalType: 'uint256',
            name: 'currentX_',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'currentY_',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'multX_',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'multY_',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'totalLP_',
            type: 'uint256'
          }
        ],
        internalType: 'struct ISsTradingPairV1.StatsV1[]',
        name: 'resultStats',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'protocolFeeAddress_',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'swapRouter_',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'lpTokenCreator_',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'pairV1Creator_',
        type: 'address'
      }
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'lpTokenCreator',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'pairByTokenAddresses',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'pairOwner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'pairV1Creator',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'pairsOfTokenAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'pendingOwner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'protocolFeeAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'tokenAddress',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'start',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'end',
        type: 'uint256'
      }
    ],
    name: 'searchPairsPaginate',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'pairAddress',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'xTokenAddress',
            type: 'address'
          },
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
            internalType: 'struct IPairV1Manager.TokenInfo',
            name: 'xTokenInfo',
            type: 'tuple'
          },
          {
            internalType: 'address',
            name: 'yTokenAddress',
            type: 'address'
          },
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
            internalType: 'struct IPairV1Manager.TokenInfo',
            name: 'yTokenInfo',
            type: 'tuple'
          },
          {
            internalType: 'address',
            name: 'lpToken',
            type: 'address'
          }
        ],
        internalType: 'struct IPairV1Manager.PairMessage[]',
        name: 'pageStats',
        type: 'tuple[]'
      },
      {
        internalType: 'uint256',
        name: 'pairCount',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'lpTokenCreator_',
        type: 'address'
      }
    ],
    name: 'setLpTokenCreator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'pairV1Creator_',
        type: 'address'
      }
    ],
    name: 'setPairV1Creator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'protocolFeeAddress_',
        type: 'address'
      }
    ],
    name: 'setProtocolFeeAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'swapRouter_',
        type: 'address'
      }
    ],
    name: 'setSwapRouter',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'swapRouter',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'tokens',
    outputs: [
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
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'tokenAddress',
            type: 'address'
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
        internalType: 'struct IPairV1Manager.AddTokenInfo',
        name: 'tokenInfo',
        type: 'tuple'
      }
    ],
    name: 'updateTokenInfo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'xToken',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'yToken',
        type: 'address'
      },
      {
        internalType: 'uint64',
        name: 'concentration_',
        type: 'uint64'
      }
    ],
    name: 'updateTradingPairConcentration',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'xToken',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'yToken',
        type: 'address'
      },
      {
        internalType: 'uint64',
        name: 'feeMillionth_',
        type: 'uint64'
      }
    ],
    name: 'updateTradingPairFeeMillionth',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'xToken',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'yToken',
        type: 'address'
      },
      {
        internalType: 'uint64',
        name: 'xPrice_',
        type: 'uint64'
      },
      {
        internalType: 'uint64',
        name: 'yPrice_',
        type: 'uint64'
      }
    ],
    name: 'updateTradingPairPrice',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'xToken',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'yToken',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'protocolFeeAddress_',
        type: 'address'
      }
    ],
    name: 'updateTradingPairProtocolFeeAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];
