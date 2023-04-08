import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer, BigNumber, Contract } from "ethers";

describe("SCC contract", function () {
    let factoryContract: Contract;
    let owner: Signer, 
        addr1: Signer, 
        addr2: Signer, 
        addrs: Signer[];


        let capturedValue:any;
        const captureValue = (value:any) => {
            capturedValue = value
            return true
        }
     

    before(async () => {
      [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
  
      const CRB = await ethers.getContractFactory("CarbonFactory");
      factoryContract = await CRB.deploy();
      await factoryContract.deployed();
    });

    it("Should initialized new factoryContract contract.", async () => {
      //const baseTokenURI: string = 'ipfs/';
      const admin: string = await owner.getAddress();

      await factoryContract.initialize(admin);
  });

  it("Create Uco Contract (1)", async () => {
    const admin: string = await owner.getAddress();
    const quantity: number = 3;
    const cidArr: string[] = ['1.json', '2.json', '3.json'];

    await factoryContract.deployUCO(admin,'name','sym')

   const addrUco =  factoryContract.wait();

   const uco = await ethers.getContractFactory("UCO");
   let ucoInstance = await uco.attach(addrUco);
   //ucoInstance.mint(admin,2,)

//   await factoryContract.deployed();



  
  });

  it("Create Uco and catch events", async () => {
    const admin: string = await owner.getAddress();

    await expect(factoryContract.deployUCO(admin,'name','sym'))
    .to.emit(factoryContract, 'UCODeployed')
    .withArgs(captureValue)
    console.log("CapturedValue:", capturedValue);
  });


});