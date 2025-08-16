import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys the ZIRCUIT token and Zutchi ERC-721 contract using the deployer account
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployZutchi: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // First deploy the ZIRCUIT token
  await deploy("MockZIRCUIT", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  const zircuitToken = await hre.ethers.getContract<Contract>("MockZIRCUIT", deployer);
  console.log("🪙 ZIRCUIT token deployed at:", zircuitToken.target);

  // Then deploy Zutchi with the ZIRCUIT token address
  await deploy("Zutchi", {
    from: deployer,
    args: [zircuitToken.target],
    log: true,
    autoMine: true,
  });

  const zutchiContract = await hre.ethers.getContract<Contract>("Zutchi", deployer);
  console.log("🎨 Zutchi NFT contract deployed!");
  console.log("🔗 ZIRCUIT token address:", await zutchiContract.zircuitToken());
  console.log("🔢 Current token ID:", await zutchiContract.getCurrentTokenId());
  console.log("👤 Owner:", await zutchiContract.owner());
  console.log("📊 Total supply:", await zutchiContract.totalSupply());
};

export default deployZutchi;

deployZutchi.tags = ["Zutchi"]; 