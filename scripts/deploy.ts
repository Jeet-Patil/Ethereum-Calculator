import { ethers } from "ethers";
import * as dotenv from "dotenv";
import CalculatorArtifact from "../artifacts/contracts/Calculator.sol/Calculator.json" with { type: "json" };

dotenv.config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  console.log("Deploying Calculator with account:", wallet.address);

  const factory = new ethers.ContractFactory(
    CalculatorArtifact.abi,
    CalculatorArtifact.bytecode,
    wallet
  );

  const calculator = await factory.deploy();
  await calculator.waitForDeployment();

  const address = await calculator.getAddress();
  console.log("Calculator deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
