/**
 * Utility functions for the Ethereum Calculator app
 */

/**
 * Truncates an Ethereum address for display
 * @param {string} address - Full Ethereum address
 * @param {number} startChars - Number of characters to show at start (default: 6)
 * @param {number} endChars - Number of characters to show at end (default: 4)
 * @returns {string} Truncated address
 */
export const truncateAddress = (address, startChars = 6, endChars = 4) => {
  if (!address) return "";
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

/**
 * Formats a balance value for display
 * @param {string} balance - Balance in ETH
 * @param {number} decimals - Number of decimal places (default: 4)
 * @returns {string} Formatted balance
 */
export const formatBalance = (balance, decimals = 4) => {
  if (!balance) return "0.0000";
  return parseFloat(balance).toFixed(decimals);
};

/**
 * Gets operation symbol from operation name
 * @param {string} operation - Operation name (add, sub, mul, div)
 * @returns {string} Operation symbol
 */
export const getOperationSymbol = (operation) => {
  const symbols = {
    add: "+",
    sub: "-",
    mul: "×",
    div: "÷"
  };
  return symbols[operation] || operation;
};

/**
 * Checks if user is on the correct network
 * @param {string} network - Current network name or chain ID
 * @returns {boolean} True if on Sepolia
 */
export const isSepoliaNetwork = (network) => {
  return network === "sepolia" || network.includes("11155111");
};

/**
 * Formats error messages for user-friendly display
 * @param {Error} error - Error object
 * @returns {string} Formatted error message
 */
export const formatError = (error) => {
  // User rejected transaction
  if (error.code === 4001 || error.code === "ACTION_REJECTED") {
    return "🚫 Transaction cancelled by user";
  }
  
  // Insufficient funds
  if (error.code === "INSUFFICIENT_FUNDS") {
    return "❌ Insufficient funds for transaction";
  }
  
  // Network error
  if (error.code === "NETWORK_ERROR") {
    return "❌ Network error. Please check your connection";
  }
  
  // Divide by zero
  if (error.message?.includes("Divide by zero")) {
    return "❌ Cannot divide by zero";
  }
  
  // Generic error
  const errorMsg = error.reason || error.message || "Unknown error";
  const shortMsg = errorMsg.length > 80 ? errorMsg.slice(0, 80) + "..." : errorMsg;
  return `❌ ${shortMsg}`;
};
