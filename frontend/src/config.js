export const CONTRACT_ADDRESS = "0x9bea18fC3F1EB455682cFc07D6a9e30FB1653370";
export const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111 in hex

export const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "lastResult",
    "outputs": [
      {
        "internalType": "int256",
        "name": "",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "int256", "name": "a", "type": "int256" },
      { "internalType": "int256", "name": "b", "type": "int256" }
    ],
    "name": "add",
    "outputs": [
      { "internalType": "int256", "name": "", "type": "int256" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "int256", "name": "a", "type": "int256" },
      { "internalType": "int256", "name": "b", "type": "int256" }
    ],
    "name": "sub",
    "outputs": [
      { "internalType": "int256", "name": "", "type": "int256" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "int256", "name": "a", "type": "int256" },
      { "internalType": "int256", "name": "b", "type": "int256" }
    ],
    "name": "mul",
    "outputs": [
      { "internalType": "int256", "name": "", "type": "int256" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "int256", "name": "a", "type": "int256" },
      { "internalType": "int256", "name": "b", "type": "int256" }
    ],
    "name": "div",
    "outputs": [
      { "internalType": "int256", "name": "", "type": "int256" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "caller",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "operation",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "a",
        "type": "int256"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "b",
        "type": "int256"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "result",
        "type": "int256"
      }
    ],
    "name": "Calculated",
    "type": "event"
  }
];
