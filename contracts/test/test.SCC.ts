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

  it("Mint severals SCC (1)", async () => {
    const admin: string = await owner.getAddress();
    const fakeOwner: string = await addr1.getAddress();
    const quantity: number = 3;
    const cidArr: string[] = ['1.json', '2.json', '3.json'];

    await scc.connect(addr1).mint(fakeOwner, quantity, cidArr);

    expect(await scc.connect(addr1).balanceOf(admin, 0)).to.equal(BigNumber.from(1));
    expect(await scc.connect(addr1).balanceOf(admin, 1)).to.equal(BigNumber.from(1));
    expect(await scc.connect(addr1).balanceOf(admin, 2)).to.equal(BigNumber.from(1));

    expect(await scc.connect(addr1)._pendingBalance(fakeOwner, 0)).to.equal(BigNumber.from(1));
    expect(await scc.connect(addr1)._pendingBalance(fakeOwner, 1)).to.equal(BigNumber.from(1));
    expect(await scc.connect(addr1)._pendingBalance(fakeOwner, 2)).to.equal(BigNumber.from(1));
  });

  it("Mint severals SCC (2)", async () => {
    const admin: string = await owner.getAddress();
    const fakeOwner: string = await addr1.getAddress();
    const quantity: number = 3;
    const cidArr: string[] = ['4.json', '5.json', '6.json'];

    await scc.connect(addr1).mint(fakeOwner, quantity, cidArr);

    expect(await scc.connect(addr1).balanceOf(admin, 3)).to.equal(BigNumber.from(1));
    expect(await scc.connect(addr1).balanceOf(admin, 4)).to.equal(BigNumber.from(1));
    expect(await scc.connect(addr1).balanceOf(admin, 5)).to.equal(BigNumber.from(1));

    expect(await scc.connect(addr1)._pendingBalance(fakeOwner, 3)).to.equal(BigNumber.from(1));
    expect(await scc.connect(addr1)._pendingBalance(fakeOwner, 4)).to.equal(BigNumber.from(1));
    expect(await scc.connect(addr1)._pendingBalance(fakeOwner, 5)).to.equal(BigNumber.from(1));
  });

  it("Put on sale tokenId n°0", async () => {
    const tokenId: number = 0;
    const price: number = 3;
    const fakeOwner: string = await addr1.getAddress();

    await expect(scc.connect(addr1).putOnSale(
      fakeOwner,
      tokenId, 
      price
    )).to.emit(scc, "PutOnSale").withArgs(tokenId, price);

    expect(await scc.connect(addr1).onSale(tokenId)).to.equal(true);
    expect(await scc.connect(addr1).tokenPrice(tokenId)).to.equal(price);
    expect(await scc.connect(addr1).sellers(tokenId)).to.equal(await addr1.getAddress());

    const onSaleTokenIds: BigNumber[] = await scc.connect(addr1).getOnSaleTokenIds();
    console.log('onSaleTokenIds (1)', onSaleTokenIds);
    expect(onSaleTokenIds[0]).to.equal(BigNumber.from(0));
  });

  it("Put on sale tokenId n°5", async () => {
    const tokenId: number = 5;
    const price: number = 54;
    const fakeOwner: string = await addr1.getAddress();

    await expect(scc.connect(addr1).putOnSale(
      fakeOwner,
      tokenId, 
      price
    )).to.emit(scc, "PutOnSale").withArgs(tokenId, price);

    expect(await scc.connect(addr1).onSale(tokenId)).to.equal(true);
    expect(await scc.connect(addr1).tokenPrice(tokenId)).to.equal(price);
    expect(await scc.connect(addr1).sellers(tokenId)).to.equal(await addr1.getAddress());

    const onSaleTokenIds: BigNumber[] = await scc.connect(addr1).getOnSaleTokenIds();
    console.log('onSaleTokenIds (2)', onSaleTokenIds);

    expect(onSaleTokenIds[1]).to.equal(BigNumber.from(5));

  });

  it("Put on sale tokenId n°4", async () => {
    const tokenId: number = 4;
    const price: number = 54;
    const fakeOwner: string = await addr1.getAddress();

    await expect(scc.connect(addr1).putOnSale(
      fakeOwner,
      tokenId, 
      price
    )).to.emit(scc, "PutOnSale").withArgs(tokenId, price);

    expect(await scc.connect(addr1).onSale(tokenId)).to.equal(true);
    expect(await scc.connect(addr1).tokenPrice(tokenId)).to.equal(price);
    expect(await scc.connect(addr1).sellers(tokenId)).to.equal(await addr1.getAddress());

    const onSaleTokenIds: BigNumber[] = await scc.connect(addr1).getOnSaleTokenIds();
    console.log('onSaleTokenIds (2)', onSaleTokenIds);

    expect(onSaleTokenIds[2]).to.equal(BigNumber.from(4));

  });

  it("Put on sale tokenId n°3", async () => {
    const tokenId: number = 3;
    const price: number = 25;
    const fakeOwner: string = await addr1.getAddress();

    await expect(scc.connect(addr1).putOnSale(
      fakeOwner,
      tokenId, 
      price
    )).to.emit(scc, "PutOnSale").withArgs(tokenId, price);

    expect(await scc.connect(addr1).onSale(tokenId)).to.equal(true);
    expect(await scc.connect(addr1).tokenPrice(tokenId)).to.equal(price);
    expect(await scc.connect(addr1).sellers(tokenId)).to.equal(await addr1.getAddress());

    const onSaleTokenIds: BigNumber[] = await scc.connect(addr1).getOnSaleTokenIds();
    console.log('onSaleTokenIds (3)', onSaleTokenIds);
    expect(onSaleTokenIds[3]).to.equal(BigNumber.from(3));
  });

  it("Remove from sale tokenId n°5", async () => {
    const tokenId: number = 5;
    const fakeOwner: string = await addr1.getAddress();

    await scc.connect(addr1).removeFromSale(fakeOwner, tokenId);

    const onSaleTokenIds: BigNumber[] = await scc.connect(addr1).getOnSaleTokenIds();
    console.log('onSaleTokenIds after remove', onSaleTokenIds);
    expect(onSaleTokenIds.length).to.equal(3);
    expect(await scc.connect(addr1).tokenPrice(tokenId)).to.equal(0);
  });

  it("Buy tokenId n°4", async () => {
    const admin: string = await owner.getAddress();
    const tokenId: number = 4;
    const fakeOwner: string = await addr1.getAddress();

    await scc.connect(addr2).buy(await addr2.getAddress(), tokenId);
    const tokensOwned: BigNumber[] = await scc.connect(addr2).tokensOwned(await addr2.getAddress(), 0);
    expect(tokensOwned).to.equal(4);
    expect(await scc.connect(addr2).onSale(4)).to.equal(false);
    expect(await scc.connect(addr2).tokenPrice(3)).to.equal(25);
    const tokensOwnedCount: any = await scc.connect(addr2).tokensOwnedCount(await addr2.getAddress());
    expect(tokensOwnedCount).to.equal(1);
    const onSaleTokenIds: BigNumber[] = await scc.connect(addr1).getOnSaleTokenIds();
    console.log('onSaleTokenIds after buy', onSaleTokenIds);
  });

});