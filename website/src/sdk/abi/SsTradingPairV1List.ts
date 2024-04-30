export const ABI_SS_TRADING_PAIR_V1_LIST = [
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
        internalType: 'address',
        name: 'pair',
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
        internalType: 'address',
        name: 'pair',
        type: 'address'
      }
    ],
    name: 'addPairOwner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
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
    name: 'fetchPairsAddressListPaginate',
    outputs: [
      {
        internalType: 'address[]',
        name: 'pagePairs',
        type: 'address[]'
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
    name: 'fetchPairsStatsListPaginate',
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'address',
                name: 'pairAddress',
                type: 'address'
              },
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
                name: 'lpToken',
                type: 'address'
              }
            ],
            internalType: 'struct ITradingPairV1List.Pair',
            name: 'pair',
            type: 'tuple'
          },
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
            internalType: 'struct ISsTradingPairV1.StatsV1',
            name: 'statsV1',
            type: 'tuple'
          }
        ],
        internalType: 'struct ITradingPairV1List.PairStats[]',
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
    name: 'fetchPairsStatsListPaginateV2',
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'address',
                name: 'pairAddress',
                type: 'address'
              },
              {
                internalType: 'address',
                name: 'xToken',
                type: 'address'
              },
              {
                internalType: 'uint8',
                name: 'xDecimals',
                type: 'uint8'
              },
              {
                internalType: 'string',
                name: 'xSymbol',
                type: 'string'
              },
              {
                internalType: 'address',
                name: 'yToken',
                type: 'address'
              },
              {
                internalType: 'uint8',
                name: 'yDecimals',
                type: 'uint8'
              },
              {
                internalType: 'string',
                name: 'ySymbol',
                type: 'string'
              },
              {
                internalType: 'address',
                name: 'lpToken',
                type: 'address'
              }
            ],
            internalType: 'struct ITradingPairV1List.PairV2',
            name: 'pair',
            type: 'tuple'
          },
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
            internalType: 'struct ISsTradingPairV1.StatsV1',
            name: 'statsV1',
            type: 'tuple'
          }
        ],
        internalType: 'struct ITradingPairV1List.PairStatsV2[]',
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
    inputs: [],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
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
      }
    ],
    name: 'pairMap',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
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
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'tradingPairCreator_',
        type: 'address'
      }
    ],
    name: 'setTradingPairCreator',
    outputs: [],
    stateMutability: 'nonpayable',
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
  }
];
