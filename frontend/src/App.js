import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  SEPOLIA_CHAIN_ID,
  SEPOLIA_CHAIN_NAME,
  SEPOLIA_RPC_URL,
  SEPOLIA_EXPLORER_URL,
  OPERATIONS,
  MAX_TX_HISTORY,
  BLOCKS_TO_QUERY
} from "./constants";

function App() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [network, setNetwork] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [txHistory, setTxHistory] = useState([]);
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    checkConnection();
    loadLastResult();
    loadTransactionHistory();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", () => window.location.reload());
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      setWalletAddress("");
      setBalance("");
    } else {
      setWalletAddress(accounts[0]);
      await updateBalance(accounts[0]);
    }
  }

  async function checkConnection() {
    if (!window.ethereum) return;
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
        await updateBalance(address);
        await updateNetwork();
      }
    } catch (err) {
      console.error("Connection check failed:", err);
    }
  }

  async function updateBalance(address) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(address);
      setBalance(ethers.formatEther(balance));
    } catch (err) {
      console.error("Balance update failed:", err);
    }
  }

  async function updateNetwork() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      setNetwork(network.name === "unknown" ? `Chain ID: ${network.chainId}` : network.name);
    } catch (err) {
      console.error("Network update failed:", err);
    }
  }

  async function loadLastResult() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const result = await contract.lastResult();
      setLastResult(result.toString());
    } catch (err) {
      console.error("Failed to load last result:", err);
    }
  }

  async function loadTransactionHistory() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      const filter = contract.filters.Calculated();
      const events = await contract.queryFilter(filter, BLOCKS_TO_QUERY);
      
      const history = events.map(event => ({
        operation: event.args.operation,
        a: event.args.a.toString(),
        b: event.args.b.toString(),
        result: event.args.result.toString(),
        txHash: event.transactionHash,
        blockNumber: event.blockNumber
      }));
      
      setTxHistory(history.reverse().slice(0, MAX_TX_HISTORY));
    } catch (err) {
      console.error("Failed to load transaction history:", err);
    }
  }

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    
    try {
      setIsLoading(true);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWalletAddress(accounts[0]);
      await updateBalance(accounts[0]);
      await updateNetwork();
      setStatus("✅ Wallet connected!");
      setIsLoading(false);
    } catch (err) {
      setStatus("❌ Connection failed: " + err.message);
      setIsLoading(false);
    }
  }

  async function switchToSepolia() {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
      setStatus("✅ Switched to Sepolia!");
      await updateNetwork();
    } catch (err) {
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: SEPOLIA_CHAIN_ID,
              chainName: SEPOLIA_CHAIN_NAME,
              rpcUrls: [SEPOLIA_RPC_URL],
              nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
              blockExplorerUrls: [SEPOLIA_EXPLORER_URL]
            }],
          });
          setStatus("✅ Sepolia network added and switched!");
          await updateNetwork();
        } catch (addError) {
          setStatus("❌ Failed to add Sepolia network");
        }
      } else if (err.code === 4001) {
        setStatus("🚫 Network switch cancelled by user");
      } else {
        setStatus("❌ Failed to switch network");
      }
    }
  }

  async function operate(funcName) {
    if (!walletAddress) {
      setStatus("⚠️ Please connect wallet first!");
      return;
    }

    if (!a || !b) {
      setStatus("⚠️ Please enter both values!");
      return;
    }

    try {
      setIsLoading(true);
      setStatus("📤 Sending transaction...");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract[funcName](a, b);
      setStatus(`⏳ Transaction sent! Hash: ${tx.hash.slice(0, 10)}...`);
      
      await tx.wait();
      setStatus("✅ Transaction confirmed!");

      const latest = await contract.lastResult();
      setResult(latest.toString());
      setLastResult(latest.toString());
      
      await updateBalance(walletAddress);
      await loadTransactionHistory();
      
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      
      // Handle user rejection
      if (err.code === 4001 || err.code === "ACTION_REJECTED") {
        setStatus("🚫 Transaction cancelled by user");
        return;
      }
      
      // Handle insufficient funds
      if (err.code === "INSUFFICIENT_FUNDS") {
        setStatus("❌ Insufficient funds for transaction");
        return;
      }
      
      // Handle network errors
      if (err.code === "NETWORK_ERROR") {
        setStatus("❌ Network error. Please check your connection");
        return;
      }
      
      // Handle divide by zero
      if (err.message?.includes("Divide by zero")) {
        setStatus("❌ Cannot divide by zero");
        return;
      }
      
      // Generic error with shortened message
      const errorMsg = err.reason || err.message || "Unknown error";
      const shortMsg = errorMsg.length > 80 ? errorMsg.slice(0, 80) + "..." : errorMsg;
      setStatus(`❌ ${shortMsg}`);
      console.error("Transaction error:", err);
    }
  }

  const isWrongNetwork = network && network !== "sepolia" && !network.includes("11155111");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-4 md:p-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{animationDelay: "1s"}}></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{animationDelay: "2s"}}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <header className="text-center mb-12 animate-float">
          <div className="backdrop-blur-xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 border-2 border-cyan-400/50 rounded-3xl p-8 shadow-2xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              ⚡ Ethereum Calculator
            </h1>
            <p className="text-gray-300 text-lg">Perform calculations on the blockchain ✨</p>
          </div>
        </header>

        {/* Wallet Info Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {walletAddress ? (
              <>
                <div className="flex-1 text-center md:text-left">
                  <p className="text-sm text-gray-400">Connected Wallet</p>
                  <p className="text-lg font-mono text-cyan-400">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-sm text-gray-400">Balance</p>
                  <p className="text-lg font-bold text-green-400">{parseFloat(balance).toFixed(4)} ETH</p>
                </div>
                <div className="flex-1 text-center md:text-right">
                  <p className="text-sm text-gray-400">Network</p>
                  <p className={`text-lg font-bold ${isWrongNetwork ? 'text-red-400' : 'text-green-400'}`}>
                    {network || "Unknown"}
                  </p>
                </div>
              </>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isLoading}
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-bold text-lg hover:from-cyan-600 hover:to-purple-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isLoading ? "Connecting..." : "🔗 Connect Wallet"}
              </button>
            )}
          </div>
          
          {isWrongNetwork && (
            <button
              onClick={switchToSepolia}
              className="w-full mt-4 px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl font-bold transition-all transform hover:scale-105"
            >
              ⚠️ Switch to Sepolia Network
            </button>
          )}
        </div>

        {/* Calculator Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 mb-8 shadow-2xl">
          {lastResult !== null && (
            <div className="mb-6 text-center p-4 bg-purple-500/20 border border-purple-400/30 rounded-xl">
              <p className="text-sm text-gray-400">Last Result on Chain</p>
              <p className="text-3xl font-bold text-purple-300">{lastResult}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <input
              type="number"
              placeholder="Enter first number (a)"
              value={a}
              onChange={(e) => setA(e.target.value)}
              disabled={isLoading}
              className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all disabled:opacity-50 text-lg"
            />
            <input
              type="number"
              placeholder="Enter second number (b)"
              value={b}
              onChange={(e) => setB(e.target.value)}
              disabled={isLoading}
              className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all disabled:opacity-50 text-lg"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {Object.values(OPERATIONS).map(op => (
              <button
                key={op.name}
                onClick={() => operate(op.name)}
                disabled={isLoading}
                className={`px-6 py-4 bg-gradient-to-r ${op.color} rounded-xl font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {op.label}
              </button>
            ))}
          </div>

          {status && (
            <div className="text-center p-4 bg-white/5 border border-white/20 rounded-xl mb-4">
              <p className="text-lg">{status}</p>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center items-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></div>
              <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
            </div>
          )}

          {result !== null && (
            <div className="text-center p-6 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 rounded-xl animate-glow">
              <p className="text-sm text-gray-400 mb-2">Current Result</p>
              <p className="text-5xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">{result}</p>
            </div>
          )}
        </div>

        {/* Transaction History */}
        {txHistory.length > 0 && (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-center">📜 Transaction History</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {txHistory.map((tx, idx) => (
                <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <span className="text-cyan-400 font-bold">{tx.operation}</span>
                    <span className="text-gray-400">{tx.a} {tx.operation === 'add' ? '+' : tx.operation === 'sub' ? '-' : tx.operation === 'mul' ? '×' : '÷'} {tx.b} = {tx.result}</span>
                    <a 
                      href={`${SEPOLIA_EXPLORER_URL}/tx/${tx.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 text-sm font-mono"
                    >
                      {tx.txHash.slice(0, 10)}...
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center mt-12 text-gray-500">
        <p>Contract: <span className="text-cyan-400 font-mono">{CONTRACT_ADDRESS}</span></p>
        <p className="mt-2">Built with ❤️ on Ethereum Sepolia</p>
      </footer>
    </div>
  );
}

export default App;
