const address = '0x3C68CE8504087f89c640D02d133646d98e64ddd9'
const abi     = [
  {
    'type': 'constructor',
    'stateMutability': 'nonpayable',
    'inputs':[
      {
        'type': 'string',
        'name': 'name',
        'internalType': 'string'
      },
      {
        'type': 'string',
        'name': 'symbol',
        'internalType': 'string'
      },
      {
        'type': 'uint8',
        'name': 'decimals',
        'internalType': 'uint8'
      }
    ]
  },
  {
    'type': 'event',
    'name': 'Approval',
    'inputs':[
      {
        'type': 'address',
        'name': 'owner',
        'internalType': 'address',
        'indexed':true
      },
      {
        'type': 'address',
        'name': 'spender',
        'internalType': 'address',
        'indexed':true
      },
      {
        'type': 'uint256',
        'name': 'value',
        'internalType': 'uint256',
        'indexed':false
      }
    ],
    'anonymous':false
  },
  {
    'type': 'event',
    'name': 'Transfer',
    'inputs':[
      {
        'type': 'address',
        'name': 'from',
        'internalType': 'address',
        'indexed':true
      },
      {
        'type': 'address',
        'name': 'to',
        'internalType': 'address',
        'indexed':true
      },
      {
        'type': 'uint256',
        'name': 'value',
        'internalType': 'uint256',
        'indexed':false
      }
    ],
    'anonymous':false
  },
  {
    'type': 'function',
    'stateMutability': 'view',
    'outputs':[
      {
        'type': 'uint256',
        'name': '',
        'internalType': 'uint256'
      }
    ],
    'name': 'allowance',
    'inputs':[
      {
        'type': 'address',
        'name': 'owner',
        'internalType': 'address'
      },
      {
        'type': 'address',
        'name': 'spender',
        'internalType': 'address'
      }
    ]
  },
  {
    'type': 'function',
    'stateMutability': 'nonpayable',
    'outputs':[
      {
        'type': 'bool',
        'name': '',
        'internalType': 'bool'
      }
    ],
    'name': 'approve',
    'inputs':[
      {
        'type': 'address',
        'name': 'spender',
        'internalType': 'address'
      },
      {
        'type': 'uint256',
        'name': 'amount',
        'internalType': 'uint256'
      }
    ]
  },
  {
    'type': 'function',
    'stateMutability': 'view',
    'outputs':[
      {
        'type': 'uint256',
        'name': '',
        'internalType': 'uint256'
      }
    ],
    'name': 'balanceOf',
    'inputs':[
      {
        'type': 'address',
        'name': 'account',
        'internalType': 'address'
      }
    ]
  },
  {
    'type': 'function',
    'stateMutability': 'view',
    'outputs':[
      {
        'type': 'uint8',
        'name': '',
        'internalType': 'uint8'
      }
    ],
    'name': 'decimals',
    'inputs':[

    ]
  },
  {
    'type': 'function',
    'stateMutability': 'nonpayable',
    'outputs':[
      {
        'type': 'bool',
        'name': '',
        'internalType': 'bool'
      }
    ],
    'name': 'decreaseAllowance',
    'inputs':[
      {
        'type': 'address',
        'name': 'spender',
        'internalType': 'address'
      },
      {
        'type': 'uint256',
        'name': 'subtractedValue',
        'internalType': 'uint256'
      }
    ]
  },
  {
    'type': 'function',
    'stateMutability': 'nonpayable',
    'outputs':[
      {
        'type': 'bool',
        'name': '',
        'internalType': 'bool'
      }
    ],
    'name': 'increaseAllowance',
    'inputs':[
      {
        'type': 'address',
        'name': 'spender',
        'internalType': 'address'
      },
      {
        'type': 'uint256',
        'name': 'addedValue',
        'internalType': 'uint256'
      }
    ]
  },
  {
    'type': 'function',
    'stateMutability': 'nonpayable',
    'outputs':[
      {
        'type': 'bool',
        'name': '',
        'internalType': 'bool'
      }
    ],
    'name': 'mint',
    'inputs':[
      {
        'type': 'uint256',
        'name': 'value',
        'internalType': 'uint256'
      }
    ]
  },
  {
    'type': 'function',
    'stateMutability': 'view',
    'outputs':[
      {
        'type': 'string',
        'name': '',
        'internalType': 'string'
      }
    ],
    'name': 'name',
    'inputs':[

    ]
  },
  {
    'type': 'function',
    'stateMutability': 'view',
    'outputs':[
      {
        'type': 'string',
        'name': '',
        'internalType': 'string'
      }
    ],
    'name': 'symbol',
    'inputs':[

    ]
  },
  {
    'type': 'function',
    'stateMutability': 'view',
    'outputs':[
      {
        'type': 'uint256',
        'name': '',
        'internalType': 'uint256'
      }
    ],
    'name': 'totalSupply',
    'inputs':[

    ]
  },
  {
    'type': 'function',
    'stateMutability': 'nonpayable',
    'outputs':[
      {
        'type': 'bool',
        'name': '',
        'internalType': 'bool'
      }
    ],
    'name': 'transfer',
    'inputs':[
      {
        'type': 'address',
        'name': 'recipient',
        'internalType': 'address'
      },
      {
        'type': 'uint256',
        'name': 'amount',
        'internalType': 'uint256'
      }
    ]
  },
  {
    'type': 'function',
    'stateMutability': 'nonpayable',
    'outputs':[
      {
        'type': 'bool',
        'name': '',
        'internalType': 'bool'
      }
    ],
    'name': 'transferFrom',
    'inputs':[
      {
        'type': 'address',
        'name': 'sender',
        'internalType': 'address'
      },
      {
        'type': 'address',
        'name': 'recipient',
        'internalType': 'address'
      },
      {
        'type': 'uint256',
        'name': 'amount',
        'internalType': 'uint256'
      }
    ]
  }
]

const token = {abi, address}

export default token
