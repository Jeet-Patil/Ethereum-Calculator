// Network Configuration
export const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111 in hex
export const SEPOLIA_CHAIN_NAME = "Sepolia Testnet";
export const SEPOLIA_RPC_URL = "https://sepolia.infura.io/v3/";
export const SEPOLIA_EXPLORER_URL = "https://sepolia.etherscan.io";

// Contract Configuration
export const CONTRACT_ADDRESS = "0x9bea18fC3F1EB455682cFc07D6a9e30FB1653370";

// Calculator operations
export const OPERATIONS = {
  ADD: { name: "add", label: "➕ Add", color: "from-blue-500 to-cyan-500" },
  SUB: { name: "sub", label: "➖ Subtract", color: "from-green-500 to-teal-500" },
  MUL: { name: "mul", label: "✖️ Multiply", color: "from-purple-500 to-pink-500" },
  DIV: { name: "div", label: "➗ Divide", color: "from-orange-500 to-red-500" }
};

// UI Configuration
export const MAX_TX_HISTORY = 10;
export const BLOCKS_TO_QUERY = -10000;

// Contract ABI
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
