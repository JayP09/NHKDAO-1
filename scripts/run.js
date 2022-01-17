// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // We get the contract to deploy
  const [owner,user1,user2] = await ethers.getSigners();
  const NhkToken = await hre.ethers.getContractFactory("NhkToken");
  const NhkTokenContract = await NhkToken.deploy();
  await NhkTokenContract.deployed();

  let totalSupply = parseInt(await ethers.utils.formatEther(await NhkTokenContract.balanceOf(owner.address)));
  console.log("Nhk total Supply",totalSupply);
  const claimSupply = parseInt((totalSupply * 30)/100);
  const burnSupply = parseInt((totalSupply * 25)/100);

  const NhkTokenBurn = await hre.ethers.getContractFactory("Burn");
  const NhkTokenBurnContract = await NhkTokenBurn.deploy(NhkTokenContract.address);
  await NhkTokenBurnContract.deployed();

  NhkTokenContract.transfer(NhkTokenBurnContract.address,ethers.utils.parseEther(burnSupply.toString()));
  console.log("token for burn",parseInt(await ethers.utils.formatEther(await NhkTokenContract.balanceOf(NhkTokenBurnContract.address))));

  console.log("Owner Balance",parseInt(await ethers.utils.formatEther(await NhkTokenContract.balanceOf(owner.address))));

  const NhkTokenClaim = await hre.ethers.getContractFactory("Claim");
  const NhkTokenClaimContract = await NhkTokenClaim.deploy(NhkTokenContract.address);
  await NhkTokenClaimContract.deployed();

  NhkTokenContract.transfer(NhkTokenClaimContract.address,ethers.utils.parseEther(claimSupply.toString()));
  console.log("token for Claim",parseInt(await ethers.utils.formatEther(await NhkTokenContract.balanceOf(NhkTokenClaimContract.address))));

  console.log("NhkToken Address", NhkTokenContract.address);
  console.log("ClaimContract Address",NhkTokenClaimContract.address);
  console.log("BurnContract", NhkTokenBurnContract.address);
  console.log("owner Address",owner.address)
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });