## How to deploy ?

1. Run Frontend  & Backend : `npm run dev`.
2. Deploy contracts : `npx hardhat run --network mumbai scripts/deploy.ts`.
3. Go to Etherscan for Mumbai Network verify both (UCO & SCC) contracts as Proxy.
4. Write function `setBaseURI` with `ipfs/` as value in UCO contract.

## How to use ?

Mandataire :

1. Add UCO
- Verify in DB with Mongo Compass.
- Click on transaction hash on the page to show the minted UCOs.
- Go to testnet opensea to see the collection with metadata.

2. Add SCC
- Verify in DB with Mongo Compass.
- Click on transaction hash on the page to show the minted SCCs.
- Go to testnet opensea to see the collection with metadata.
- Verify that UCO are now n status RETIRED

3. Sell SCC
- Define a price for the SCC you want to put on sale.

4. Remove SCC

Corporate :

1. Buy SCC
- Go to marketplace page a click on buy

2. Find your purchased SCC on the profile page

3. Compensate your SCC by clicking on Compensate button. (Don't forget to reload the page to see the updated status)