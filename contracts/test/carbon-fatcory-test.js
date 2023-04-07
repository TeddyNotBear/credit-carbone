const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CarbonFactory contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
   // const [owner] = await ethers.getSigners();

   [deployer,account0, account1, account2, account3, account4,account5,account6, addr1, addr2, ...addrs] = await ethers.getSigners();

 
    

      const CarbonFactory = await ethers.getContractFactory("CarbonFactory");
    
      const CRB = await CarbonFactory.deploy();

    const deployContract = await CRB.deployUCO(deployer.address,'name','sym');

    deployContract.wait();
    console.log("events",await deployContract.events);

   // console.log("passed",deployContract);

   // console/log(deployContract.addr)
  });
});











