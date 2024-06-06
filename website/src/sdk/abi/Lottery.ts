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
      },
      {
        internalType: 'uint256',
        name: 'orderId',
        type: 'uint256'
      }
    ],
    name: 'AlreadyIncompleteOrder',
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
  }
];
