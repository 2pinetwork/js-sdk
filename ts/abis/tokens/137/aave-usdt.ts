const address = '0x69fd934abc843ec3eee70bdd88f79dbf1ed8094e'
const abi     = [
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': '_token',
        'type': 'address'
      }
    ],
    'stateMutability': 'nonpayable',
    'type': 'constructor'
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'owner',
        'type': 'address'
      },
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'spender',
        'type': 'address'
      },
      {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'value',
        'type': 'uint256'
      }
    ],
    'name': 'Approval',
    'type': 'event'
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'previousOwner',
        'type': 'address'
      },
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'newOwner',
        'type': 'address'
      }
    ],
    'name': 'OwnershipTransferred',
    'type': 'event'
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': false,
        'internalType': 'address',
        'name': 'account',
        'type': 'address'
      }
    ],
    'name': 'Paused',
    'type': 'event'
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'from',
        'type': 'address'
      },
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'to',
        'type': 'address'
      },
      {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'value',
        'type': 'uint256'
      }
    ],
    'name': 'Transfer',
    'type': 'event'
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': false,
        'internalType': 'address',
        'name': 'account',
        'type': 'address'
      }
    ],
    'name': 'Unpaused',
    'type': 'event'
  },
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': 'owner',
        'type': 'address'
      },
      {
        'internalType': 'address',
        'name': 'spender',
        'type': 'address'
      }
    ],
    'name': 'allowance',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': 'spender',
        'type': 'address'
      },
      {
        'internalType': 'uint256',
        'name': 'amount',
        'type': 'uint256'
      }
    ],
    'name': 'approve',
    'outputs': [
      {
        'internalType': 'bool',
        'name': '',
        'type': 'bool'
      }
    ],
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'inputs': [],
    'name': 'available',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [],
    'name': 'balance',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': 'account',
        'type': 'address'
      }
    ],
    'name': 'balanceOf',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [],
    'name': 'controller',
    'outputs': [
      {
        'internalType': 'address',
        'name': '',
        'type': 'address'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [],
    'name': 'decimals',
    'outputs': [
      {
        'internalType': 'uint8',
        'name': '',
        'type': 'uint8'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': 'spender',
        'type': 'address'
      },
      {
        'internalType': 'uint256',
        'name': 'subtractedValue',
        'type': 'uint256'
      }
    ],
    'name': 'decreaseAllowance',
    'outputs': [
      {
        'internalType': 'bool',
        'name': '',
        'type': 'bool'
      }
    ],
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '_amount',
        'type': 'uint256'
      }
    ],
    'name': 'deposit',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'inputs': [],
    'name': 'depositAll',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'inputs': [],
    'name': 'earn',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'inputs': [],
    'name': 'getPricePerFullShare',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': 'spender',
        'type': 'address'
      },
      {
        'internalType': 'uint256',
        'name': 'addedValue',
        'type': 'uint256'
      }
    ],
    'name': 'increaseAllowance',
    'outputs': [
      {
        'internalType': 'bool',
        'name': '',
        'type': 'bool'
      }
    ],
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'inputs': [],
    'name': 'name',
    'outputs': [
      {
        'internalType': 'string',
        'name': '',
        'type': 'string'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [],
    'name': 'owner',
    'outputs': [
      {
        'internalType': 'address',
        'name': '',
        'type': 'address'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [],
    'name': 'paused',
    'outputs': [
      {
        'internalType': 'bool',
        'name': '',
        'type': 'bool'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [],
    'name': 'renounceOwnership',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': '_controller',
        'type': 'address'
      }
    ],
    'name': 'setController',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'inputs': [],
    'name': 'symbol',
    'outputs': [
      {
        'internalType': 'string',
        'name': '',
        'type': 'string'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [],
    'name': 'token',
    'outputs': [
      {
        'internalType': 'contract IERC20',
        'name': '',
        'type': 'address'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [],
    'name': 'totalSupply',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': 'recipient',
        'type': 'address'
      },
      {
        'internalType': 'uint256',
        'name': 'amount',
        'type': 'uint256'
      }
    ],
    'name': 'transfer',
    'outputs': [
      {
        'internalType': 'bool',
        'name': '',
        'type': 'bool'
      }
    ],
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': 'sender',
        'type': 'address'
      },
      {
        'internalType': 'address',
        'name': 'recipient',
        'type': 'address'
      },
      {
        'internalType': 'uint256',
        'name': 'amount',
        'type': 'uint256'
      }
    ],
    'name': 'transferFrom',
    'outputs': [
      {
        'internalType': 'bool',
        'name': '',
        'type': 'bool'
      }
    ],
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': 'newOwner',
        'type': 'address'
      }
    ],
    'name': 'transferOwnership',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '_shares',
        'type': 'uint256'
      }
    ],
    'name': 'withdraw',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'inputs': [],
    'name': 'withdrawAll',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
  }
]

const aToken = {
  address: '0x60D55F02A771d515e077c9C2403a1ef324885CeC'
}

const debtToken = {
  address: '0x8038857FD47108A07d1f6Bf652ef1cBeC279A2f3'
}

const vault = { abi, address, aToken, debtToken }

export default vault
