import { ethers, network, upgrades } from "hardhat";
import { verify } from './utils/verify';

async function main() {
    const project_addresses = await deploy_project();
    try {
        await verify(project_addresses.implementation, []);
    } catch (e) {}
}

async function deploy_project() {
    const ProjectFactory = await ethers.getContractFactory("ProjectFactory");
    console.log('Deploying ProjectFactory contract...');
    const projectFactory = await upgrades.deployProxy(
        ProjectFactory,
        [ '0xC5B4F2A7Ea7F675Fca6EF734d6F06FFB40dFC93F' ],
        { initializer: 'initialize'}
    );
    await projectFactory.deployed();
    const addresses = {
        proxy: projectFactory.address,
        admin: await upgrades.erc1967.getAdminAddress(projectFactory.address),
        implementation: await upgrades.erc1967.getImplementationAddress(
            projectFactory.address
        )
    };
    console.log(`ProjectFactory Implementation Address: ${addresses.implementation}`);
    console.log(`ProjectFactory Proxy Address: ${addresses.proxy}`);

    return addresses;
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});