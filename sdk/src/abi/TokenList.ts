export const ABI_TOKEN_LIST = [
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
                indexed: true,
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address'
            }
        ],
        name: 'CreateToken',
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
        name: 'addTokenInfo',
        outputs: [],
        stateMutability: 'payable',
        type: 'function'
    },
    {
        inputs: [],
        name: 'createFee',
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
                name: 'tokenInfo',
                type: 'tuple'
            }
        ],
        name: 'createTokenAndAdd',
        outputs: [
            {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address'
            }
        ],
        stateMutability: 'payable',
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
        name: 'fetchTokenListPaginate',
        outputs: [
            {
                components: [
                    {
                        internalType: 'uint256',
                        name: 'index',
                        type: 'uint256'
                    },
                    {
                        internalType: 'address',
                        name: 'tokenAddress',
                        type: 'address'
                    },
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
                internalType: 'struct ITokenList.TokenInfo[]',
                name: 'pageTokens',
                type: 'tuple[]'
            },
            {
                internalType: 'uint256',
                name: 'tokenCount',
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
        inputs: [
            {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address'
            }
        ],
        name: 'isIn',
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
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        name: 'tokens',
        outputs: [
            {
                internalType: 'uint256',
                name: 'index',
                type: 'uint256'
            },
            {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address'
            },
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
                internalType: 'uint256',
                name: 'createFee_',
                type: 'uint256'
            }
        ],
        name: 'updateCreateFee',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'index',
                type: 'uint256'
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
            }
        ],
        name: 'updateTokenInfo',
        outputs: [],
        stateMutability: 'payable',
        type: 'function'
    },
    {
        inputs: [],
        name: 'withdrawCreateFee',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    }
];
