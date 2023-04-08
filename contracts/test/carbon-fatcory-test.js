const { expect } = require("chai");
const { ethers } = require("hardhat");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
describe("CarbonFactory contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
   // const [owner] = await ethers.getSigners();

   [deployer,account0, account1, account2, account3, account4,account5,account6, addr1, addr2, ...addrs] = await ethers.getSigners();

 
   let capturedValue
   const captureValue = (value) => {
       capturedValue = value
       return true
   }

      const CarbonFactory = await ethers.getContractFactory("CarbonFactory");
    
      const CRB = await CarbonFactory.deploy(deployer.address);

      //const iniCRB = await CRB.initialize(deployer.address);
      //iniCRB.wait();
   
    const deployContract = await CRB.deployUCO(deployer.address,'name','sym')

    const contractReceipt =  deployContract.wait();

    console.log("events",await deployContract);
    console.log("value",await deployContract.value);

    await expect(CRB.deployUCO(account1.address,'name','sym'))
            .to.emit(CRB, 'UCODeployed')
            .withArgs(captureValue)
          console.log("CapturedValue:", capturedValue)


   // console.log("passed",deployContract);

   // console/log(deployContract.addr)
  });
});











