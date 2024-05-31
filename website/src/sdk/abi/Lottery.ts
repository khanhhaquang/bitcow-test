export const LOTTERY_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'orderId',
        type: 'uint256'
      }
    ],
    name: 'AlreadyClaimed',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        internalType: 'uint16',
        name: 'cardId',
        type: 'uint16'
      }
    ],
    name: 'CardNotExist',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        internalType: 'uint16',
        name: 'cardId',
        type: 'uint16'
      },
      {
        internalType: 'uint32',
        name: 'totalSold',
        type: 'uint32'
      },
      {
        internalType: 'uint32',
        name: 'totalSupply',
        type: 'uint32'
      }
    ],
    name: 'CardSoldOut',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        internalType: 'uint16',
        name: 'cardId',
        type: 'uint16'
      }
    ],
    name: 'ExceedsCardPurchaseCap',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'InsufficientBalance',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        internalType: 'uint16',
        name: 'cardId',
        type: 'uint16'
      },
      {
        internalType: 'uint8',
        name: 'quantity',
        type: 'uint8'
      },
      {
        internalType: 'uint256',
        name: 'totalDeduct',
        type: 'uint256'
      }
    ],
    name: 'InsufficientPayment',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'InvalidAmount',
    type: 'error'
  },
  {
    inputs: [],
    name: 'MsgValueIncorrect',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        internalType: 'uint16',
        name: 'cardId',
        type: 'uint16'
      },
      {
        internalType: 'uint8',
        name: 'quantity',
        type: 'uint8'
      },
      {
        internalType: 'address',
        name: 'paymentToken',
        type: 'address'
      }
    ],
    name: 'NotSupportPaymentToken',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'orderId',
        type: 'uint256'
      }
    ],
    name: 'OrderNotExist',
    type: 'error'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'previousAdmin',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newAdmin',
        type: 'address'
      }
    ],
    name: 'AdminChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'beacon',
        type: 'address'
      }
    ],
    name: 'BeaconUpgraded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'who',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'what',
        type: 'string'
      },
      {
        indexed: false,
        internalType: 'uint16',
        name: 'cardId',
        type: 'uint16'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'previous',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'current',
        type: 'uint256'
      }
    ],
    name: 'CardParameterUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'operator',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'enum GiftType',
        name: 'giftType',
        type: 'uint8'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'rewardId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'rewardToken',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'rewardAmount',
        type: 'uint256'
      }
    ],
    name: 'GiftClaimed',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8'
      }
    ],
    name: 'Initialized',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'operator',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'feeRecipient',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'lotteryAdmin',
        type: 'address[]'
      }
    ],
    name: 'LotteryInitialized',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'operator',
        type: 'address'
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256'
          },
          {
            internalType: 'uint32',
            name: 'totalSupply',
            type: 'uint32'
          },
          {
            internalType: 'uint8',
            name: 'purchaseCap',
            type: 'uint8'
          },
          {
            internalType: 'bool',
            name: 'enableActive',
            type: 'bool'
          }
        ],
        indexed: false,
        internalType: 'struct CardConfig[]',
        name: 'cardConfig',
        type: 'tuple[]'
      }
    ],
    name: 'LotteryLaunched',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'operator',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'orderId',
        type: 'uint256'
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'token',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256'
          }
        ],
        indexed: false,
        internalType: 'struct Reward[]',
        name: 'rewards',
        type: 'tuple[]'
      }
    ],
    name: 'OrderClaimed',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'Paused',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint16',
        name: 'cardId',
        type: 'uint16'
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'quantity',
        type: 'uint8'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'paymentToken',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'totalAmount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'orderId',
        type: 'uint256'
      }
    ],
    name: 'Purchased',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'previousAdminRole',
        type: 'bytes32'
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'newAdminRole',
        type: 'bytes32'
      }
    ],
    name: 'RoleAdminChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address'
      }
    ],
    name: 'RoleGranted',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address'
      }
    ],
    name: 'RoleRevoked',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'operator',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'enum RewardType',
        name: 'rewardType',
        type: 'uint8'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'rewardToken',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'rewardAmount',
        type: 'uint256'
      }
    ],
    name: 'TopUpReward',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'Unpaused',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address'
      }
    ],
    name: 'Upgraded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'operator',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'enum RewardType',
        name: 'rewardType',
        type: 'uint8'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'token',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'WithdrawRewardPool',
    type: 'event'
  },
  {
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'LOTTERY_CALLER',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'orderId',
            type: 'uint256'
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'token',
                type: 'address'
              },
              {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
              }
            ],
            internalType: 'struct Reward[]',
            name: 'rewards',
            type: 'tuple[]'
          }
        ],
        internalType: 'struct Order[]',
        name: '_orders',
        type: 'tuple[]'
      }
    ],
    name: 'airdrop',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'enum RewardType',
        name: '_rewardType',
        type: 'uint8'
      },
      {
        internalType: 'address',
        name: '_token',
        type: 'address'
      }
    ],
    name: 'balanceOfRewardPool',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: '_cardId',
        type: 'uint16'
      },
      {
        internalType: 'bool',
        name: '_enable',
        type: 'bool'
      }
    ],
    name: 'enableCard',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: '_cardId',
        type: 'uint16'
      }
    ],
    name: 'getCardInfo',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256'
          },
          {
            internalType: 'uint16',
            name: 'cardId',
            type: 'uint16'
          },
          {
            internalType: 'uint8',
            name: 'purchaseCap',
            type: 'uint8'
          },
          {
            internalType: 'uint32',
            name: 'totalSupply',
            type: 'uint32'
          },
          {
            internalType: 'uint32',
            name: 'totalSold',
            type: 'uint32'
          },
          {
            internalType: 'bool',
            name: 'enableActive',
            type: 'bool'
          }
        ],
        internalType: 'struct CardInfo',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getNextCardId',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getNextOrderId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
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
        name: '_orderId',
        type: 'uint256'
      }
    ],
    name: 'getOrderInfo',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'createdBy',
            type: 'address'
          },
          {
            internalType: 'bool',
            name: 'isClaim',
            type: 'bool'
          }
        ],
        internalType: 'struct OrderInfo',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      }
    ],
    name: 'getRoleAdmin',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'enum GiftType',
        name: '_giftType',
        type: 'uint8'
      },
      {
        internalType: 'address',
        name: '_user',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_rewardId',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: '_rewardToken',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_rewardAmount',
        type: 'uint256'
      }
    ],
    name: 'gift',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'hasRole',
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
    inputs: [
      {
        internalType: 'address',
        name: '_feeRecipient',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_paymentToken',
        type: 'address'
      },
      {
        internalType: 'address[]',
        name: '_lotteryAdmin',
        type: 'address[]'
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
        components: [
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256'
          },
          {
            internalType: 'uint32',
            name: 'totalSupply',
            type: 'uint32'
          },
          {
            internalType: 'uint8',
            name: 'purchaseCap',
            type: 'uint8'
          },
          {
            internalType: 'bool',
            name: 'enableActive',
            type: 'bool'
          }
        ],
        internalType: 'struct CardConfig[]',
        name: '_configs',
        type: 'tuple[]'
      }
    ],
    name: 'launch',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'paused',
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
    name: 'proxiableUUID',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: '_cardId',
        type: 'uint16'
      },
      {
        internalType: 'uint8',
        name: '_quantity',
        type: 'uint8'
      },
      {
        internalType: 'address',
        name: '_paymentToken',
        type: 'address'
      }
    ],
    name: 'purchase',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4'
      }
    ],
    name: 'supportsInterface',
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
    inputs: [
      {
        internalType: 'enum RewardType',
        name: '_rewardType',
        type: 'uint8'
      },
      {
        internalType: 'address',
        name: '_rewardToken',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_rewardAmount',
        type: 'uint256'
      }
    ],
    name: 'topUpReward',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: '_cardId',
        type: 'uint16'
      },
      {
        internalType: 'uint32',
        name: '_totalSupply',
        type: 'uint32'
      }
    ],
    name: 'updateCardTotalSupply',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address'
      }
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address'
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes'
      }
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'enum RewardType',
        name: '_rewardType',
        type: 'uint8'
      },
      {
        internalType: 'address',
        name: '_token',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256'
      }
    ],
    name: 'withdrawRewardPool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];
