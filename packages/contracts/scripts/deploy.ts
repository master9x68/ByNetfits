import { ethers, artifacts as hardhatArtifacts } from "hardhat";
import fs from 'fs';
import path from 'path';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const ByNetfitsNftFactory = await ethers.getContractFactory("ByNetfitsNft");
  const bynetfitsNft = await ByNetfitsNftFactory.deploy(deployer.address);

  await bynetfitsNft.deployed();

  // Chờ transaction được xác nhận để lấy receipt đáng tin cậy hơn
  const txReceipt = await bynetfitsNft.deployTransaction.wait(); // Thay đổi ở đây
  const contractAddress = txReceipt.contractAddress;

  console.log(
    `ByNetfitsNft contract deployed to address: ${contractAddress} on network: ${ethers.provider.network.name}`
  );

  const deploymentInfo = {
     network: ethers.provider.network.name,
     nftContractAddress: contractAddress,
     deployerAddress: deployer.address,
     deploymentTime: new Date().toISOString()
  };

  const artifact = await hardhatArtifacts.readArtifact("ByNetfitsNft");

  const outputData = {
     address: contractAddress,
     abi: artifact.abi
  };

  const deploymentDir = path.join(__dirname, '..', 'deployments');
   if (!fs.existsSync(deploymentDir)){
       fs.mkdirSync(deploymentDir);
   }

   // Xử lý tên mạng localhost
   const network = await ethers.provider.getNetwork();
   const networkName = network.chainId === 31337 ? 'localhost' : network.name;

   const outputPath = path.join(deploymentDir, `${networkName}.json`);
   let existingDeployments = {};
    if (fs.existsSync(outputPath)) {
        try {
            existingDeployments = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
        } catch (e) {
            console.error(`Error reading or parsing existing deployment file ${outputPath}:`, e);
        }
    }
   const updatedDeployments = {
        ...existingDeployments,
        ByNetfitsNft: outputData
   };

   fs.writeFileSync(outputPath, JSON.stringify(updatedDeployments, null, 2));

   console.log(`Deployment artifacts saved/updated to ${outputPath}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});