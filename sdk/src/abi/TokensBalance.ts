export const ABI_TOKENS_BALANCE = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        internalType: 'address[]',
        name: 'tokens',
        type: 'address[]'
      }
    ],
    name: 'balances',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
];
