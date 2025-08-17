import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys the SimpleLotteryOracle contract and connects it to the Zutchi contract
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deploySimpleLotteryOracle: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("� Deploying SimpleLotteryOracle...");

  // Deploy the SimpleLotteryOracle contract
  await deploy("SimpleLotteryOracle", {
    from: deployer,
    args: [], // No constructor arguments needed
    log: true,
    autoMine: true,
  });

  // Get the deployed contracts
  const oracleContract = await hre.ethers.getContract<Contract>(
    "SimpleLotteryOracle",
    deployer
  );
  const zutchiContract = await hre.ethers.getContract<Contract>(
    "Zutchi",
    deployer
  );

  console.log("🔗 Connecting Oracle to Zutchi...");

  // Set the oracle address in the Zutchi contract
  const setOracleTx = await zutchiContract.setLotteryOracle(
    oracleContract.target
  );
  await setOracleTx.wait();

  console.log("✅ SimpleLotteryOracle deployed and connected!");
  console.log("Oracle Address:", await oracleContract.getAddress());

  // Display usage info
  console.log("\n📋 Oracle Usage:");
  console.log("Call getSimpleRandom(max) for random numbers 0 to max-1");
  console.log("Call getRandomNumber(min, max) for random numbers min to max");
  console.log("Oracle provides randomness for lottery winner selection");
};

export default deploySimpleLotteryOracle;

// This should run after Zutchi deployment
deploySimpleLotteryOracle.tags = ["SimpleLotteryOracle"];
deploySimpleLotteryOracle.dependencies = ["Zutchi"];
