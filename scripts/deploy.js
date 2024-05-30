const hre = require("hardhat");

async function main() {
  const Myapp = await hre.ethers.getContractFactory("myapp"); //fetching bytecode and ABI
  const myapp = await Myapp.deploy(); //creating an instance of our smart contract

  //await myapp.deployed();
  await myapp.waitForDeployment();//deploying your smart contract

  console.log("Deployed contract address:", await myapp.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//0xa513E6E4b8f2a923D98304ec87F64353C4D5C853