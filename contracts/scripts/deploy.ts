import { ethers, network, upgrades } from "hardhat";
import { verify } from './utils/verify';

async function main() {
    const uco_addresses = await deploy_uco();
    const scc_addresses = await deploy_scc();
    try {
        await verify(uco_addresses.implementation, []);
        await verify(scc_addresses.implementation, []);
    } catch (e) {}
}

async function deploy_uco() {
    const UCO = await ethers.getContractFactory("UCO");
    console.log('Deploying UCO contract...');
    const uco = await upgrades.deployProxy(
        UCO,
        ['UCO', 'UCO'],
        { initializer: 'initialize'}
    );
    await uco.deployed();
    const addresses = {
        proxy: uco.address,
        admin: await upgrades.erc1967.getAdminAddress(uco.address),
        implementation: await upgrades.erc1967.getImplementationAddress(
            uco.address
        )
    };
    console.log(`UCO Implementation Address: ${addresses.implementation}`);
    console.log(`UCO Proxy Address: ${addresses.proxy}`);

    return addresses;
}

async function deploy_scc() {
    const SCC = await ethers.getContractFactory("SCC");
    console.log('Deploying SCC contract...');
    const scc = await upgrades.deployProxy(
        SCC,
        ['ipfs/'],
        { initializer: 'initialize'}
    );
    await scc.deployed();
    const addresses = {
        proxy: scc.address,
        admin: await upgrades.erc1967.getAdminAddress(scc.address),
        implementation: await upgrades.erc1967.getImplementationAddress(
            scc.address
        )
    };
    console.log(`SCC Implementation Address: ${addresses.implementation}`);
    console.log(`SCC Proxy Address: ${addresses.proxy}`);

    return addresses;
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});