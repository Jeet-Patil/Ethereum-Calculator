import { ethers } from "ethers";
import * as dotenv from "dotenv";
import CalculatorArtifact from "../artifacts/contracts/Calculator.sol/Calculator.json" with { type: "json" };

dotenv.config();

async function main() {
  const contractAddress = "0x9bea18fC3F1EB455682cFc07D6a9e30FB1653370";

  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  const Calculator = new ethers.Contract(
    contractAddress,
    CalculatorArtifact.abi,
    wallet
  );

  console.log("Connected to Calculator at:", contractAddress);

  // call add(10, 20)
  const tx = await Calculator.add(10, 20);
  console.log("Transaction sent:", tx.hash);

  await tx.wait();
  console.log("Transaction mined!");

  const result = await Calculator.lastResult();
  console.log("Last result:", result.toString());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
