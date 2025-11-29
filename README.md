# 🧮 Ethereum Calculator

A decentralized calculator application built on Ethereum Sepolia testnet. Perform basic arithmetic operations (add, subtract, multiply, divide) directly on the blockchain with a beautiful, modern UI.

🌐 **Live Demo**: [https://ethereum-calculator-ten.vercel.app/](https://ethereum-calculator-ten.vercel.app/)

![Ethereum Calculator](https://img.shields.io/badge/Ethereum-Sepolia-blue)
![Solidity](https://img.shields.io/badge/Solidity-^0.8.28-orange)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![Hardhat](https://img.shields.io/badge/Hardhat-3.0.16-yellow)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)

## ✨ Features

### Smart Contract
- ✅ Basic arithmetic operations (add, subtract, multiply, divide)
- ✅ Event emission for all calculations
- ✅ Last result storage
- ✅ Division by zero protection

### Frontend
- 🎨 Modern glassmorphism UI with neon glow effects
- 🌙 Dark mode with animated background
- 📱 Fully responsive design
- 🔗 MetaMask wallet integration
- 🌐 Network detection and switching
- 💰 Real-time balance display
- 📜 Transaction history with Etherscan links
- ⏳ Loading states and animations
- 🚫 Graceful error handling (including user cancellations)
- ⚡ Auto-refresh after transactions

## 🛠️ Tech Stack

### Backend
- **Solidity** ^0.8.28
- **Hardhat** 3.0.16
- **Ethers.js** 6.15.0
- **TypeScript** 5.8.0

### Frontend
- **React** 19.2.0
- **Ethers.js** 6.15.0
- **Tailwind CSS** 3.x
- **PostCSS** & **Autoprefixer**

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MetaMask browser extension
- Sepolia testnet ETH ([Get from faucet](https://sepoliafaucet.com/))

### Clone & Install

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your credentials:
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=YOUR_PRIVATE_KEY_WITHOUT_0x_PREFIX
```

⚠️ **NEVER commit your `.env` file to version control!**

## 🚀 Deployment

### Compile Contracts
```bash
npx hardhat compile
```

### Deploy to Sepolia
```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

After deployment, update the contract address in `frontend/src/constants.js`:
```javascript
export const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

## 💻 Running the Application

### Start Frontend
```bash
cd frontend
npm start
```

The app will open at `http://localhost:3000`

### Interact with Contract (Optional)
```bash
# Update contract address in scripts/interact.ts
npx hardhat run scripts/interact.ts --network sepolia
```

## 📁 Project Structure

```
eth-calculator/
├── contracts/              # Solidity smart contracts
│   └── Calculator.sol
├── scripts/               # Deployment and interaction scripts
│   ├── deploy.ts
│   └── interact.ts
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── App.js        # Main application component
│   │   ├── constants.js  # Configuration constants
│   │   └── index.css     # Tailwind CSS
│   ├── public/
│   └── package.json
├── hardhat.config.ts     # Hardhat configuration
├── .env.example          # Environment variables template
└── README.md
```

## 🎯 Usage

1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask connection
2. **Switch Network**: If not on Sepolia, click "Switch to Sepolia Network"
3. **Perform Calculations**: 
   - Enter two numbers (a and b)
   - Click operation button (Add, Subtract, Multiply, Divide)
   - Approve transaction in MetaMask
   - Wait for confirmation
4. **View History**: Scroll down to see past calculations with Etherscan links

## 🔒 Security

- ✅ `.env` files excluded from git
- ✅ Private keys never exposed in frontend
- ✅ Input validation on smart contract
- ✅ User-friendly error messages
- ✅ Transaction cancellation handling

## 🧪 Testing

```bash
# Run Hardhat tests (if you create test files)
npx hardhat test
```

## 📝 Smart Contract

**Deployed Address**: `0x9bea18fC3F1EB455682cFc07D6a9e30FB1653370`  
**Network**: Sepolia Testnet  
**Explorer**: [View on Etherscan](https://sepolia.etherscan.io/address/0x9bea18fC3F1EB455682cFc07D6a9e30FB1653370)

### Contract Functions

| Function | Description | Parameters |
|----------|-------------|------------|
| `add(int256 a, int256 b)` | Addition | Two integers |
| `sub(int256 a, int256 b)` | Subtraction | Two integers |
| `mul(int256 a, int256 b)` | Multiplication | Two integers |
| `div(int256 a, int256 b)` | Division | Two integers (b ≠ 0) |
| `lastResult()` | Get last result | None |

### Events
- `Calculated(address indexed caller, string operation, int256 a, int256 b, int256 result)`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🚀 Live Application

**Production URL**: [https://ethereum-calculator-ten.vercel.app/](https://ethereum-calculator-ten.vercel.app/)

Try it now! Just connect your MetaMask wallet and start calculating on the blockchain.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Hardhat](https://hardhat.org/)
- [Ethers.js](https://docs.ethers.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MetaMask](https://metamask.io/)
- [Sepolia Testnet](https://sepolia.etherscan.io/)
- [Vercel](https://vercel.com/) for hosting

## 📞 Support

If you encounter any issues or have questions, create a new issue with detailed information including screenshots for UI-related problems.

## 👨‍💻 Author

**Jeet Patil** - [GitHub](https://github.com/Jeet-Patil)

---

Built with ❤️ on Ethereum | Deployed on Vercel
