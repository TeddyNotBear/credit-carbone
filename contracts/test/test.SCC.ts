import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer, BigNumber, Contract } from "ethers";

describe("SCC contract", function () {
    let scc: Contract;
    let owner: Signer, 
        addr1: Signer, 
        addr2: Signer, 
        addrs: Signer[];

    before(async () => {
      [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
  
      const SCC = await ethers.getContractFactory("SCC");
      scc = await SCC.deploy();
      await scc.deployed();
    });

    it("Should initialized new scc contract.", async () => {
      const baseTokenURI: string = 'ipfs/';
      const admin: string = await owner.getAddress();

      await scc.initialize(baseTokenURI, admin);
  });

  it("Mint severals SCC", async () => {
    const admin: string = await owner.getAddress();
    const quantity: number = 3;
    const cidArr: string[] = ['1.json', '2.json', '3.json'];

    await scc.mint(quantity, cidArr);

    expect(await scc.balanceOf(admin, 0)).to.equal(BigNumber.from(1));
    expect(await scc.balanceOf(admin, 1)).to.equal(BigNumber.from(1));
    expect(await scc.balanceOf(admin, 2)).to.equal(BigNumber.from(1));
  });

});