import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer, BigNumber, Contract } from "ethers";
import { setTimeout } from 'timers';

describe("SCC contract", function () {
  let factoryContract: Contract;
  let owner: Signer, addr1: Signer, addr2: Signer, addrs: Signer[];

  let capturedValue: any;
  const captureValue = (value: any) => {
    capturedValue = value;
    return true;
  };

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
    const cidArr: string[] = ["1.json", "2.json", "3.json"];

    const estimatedGas = await await factoryContract.estimateGas.deployUCO(admin, "name", "sym");
    const deployUCO = await factoryContract.deployUCO(admin, "name", "sym",{
      gasLimit:estimatedGas
    });
   // deployUCO.wait();
    const transactionReceipt = await deployUCO.wait(); // Attendre la confirmation de la transaction

    //const addrUco =  factoryContract.wait();
    console.log("Transaction hash:", deployUCO.hash);

      // Attendre 5 secondes avant de récupérer l'adresse du contrat
      //await new Promise(resolve => setTimeout(resolve, 5000));

    const deployedContractAddress = await transactionReceipt.creates;
     console.log("deployedContractAddress :", deployedContractAddress);

    const filter = factoryContract.filters.UCODeployed(null);
    const events:any = await factoryContract.queryFilter(filter, transactionReceipt.blockHash);
    if (events.length == 0) {
      throw new Error("No UCODeployed events found");
    }
    const ucoAddress = events[0].args[0];
    console.log("UCO contract deployed at address:", ucoAddress);
  
    const uco = await ethers.getContractFactory("UCO");
    let ucoInstance = await uco.attach(ucoAddress);
    //ucoInstance.mint(admin,2,)

  });

  it("Create Uco and catch address events", async () => {
    const admin: string = await owner.getAddress();

    await expect(factoryContract.deployUCO(admin, "name", "sym"))
      .to.emit(factoryContract, "UCODeployed")
      .withArgs(captureValue);
    console.log("CapturedValue:", capturedValue);
  });


  it("Create Uco and call getUCOstorage", async () => {
    const admin: string = await owner.getAddress();

    const estimatedGas = await await factoryContract.estimateGas.deployUCO(admin, "name", "sym");
    const deployUCO = await factoryContract.deployUCO(admin, "name", "sym",{
      gasLimit:estimatedGas
    });
    const transactionReceipt = await deployUCO.wait(); // Attendre la confirmation de la transaction


    let getUCOstorage = await factoryContract.getUCOstorage(admin);

    console.log("getUCOstorage value",getUCOstorage);


  });
});
