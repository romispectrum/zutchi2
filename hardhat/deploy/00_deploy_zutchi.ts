import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys the Zutchi ERC-721 contract using the deployer account and
 * constructor arguments set to the deployer address and max supply
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployZutchi: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` or `yarn account:import` to import your
    existing PK which will fill DEPLOYER_PRIVATE_KEY_ENCRYPTED in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Set the maximum supply for the NFT collection
  const maxSupply = 10000; // 10,000 NFTs maximum

  await deploy("Zutchi", {
    from: deployer,
    // Contract constructor arguments: maxSupply
    args: [maxSupply],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const zutchiContract = await hre.ethers.getContract<Contract>("Zutchi", deployer);
  console.log("🎨 Zutchi NFT contract deployed!");
  console.log("📊 Max supply:", await zutchiContract.maxSupply());
  console.log("🔢 Current token ID:", await zutchiContract.getCurrentTokenId());
  console.log("👤 Owner:", await zutchiContract.owner());
};

export default deployZutchi;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags Zutchi
deployZutchi.tags = ["Zutchi"];
