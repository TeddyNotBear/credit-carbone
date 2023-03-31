// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SCC is ERC1155Upgradeable, OwnableUpgradeable, ReentrancyGuardUpgradeable, PausableUpgradeable {
    using Counters for Counters.Counter;
    Counters.Counter private sccCounter;

    string private _baseTokenURI;

    mapping(uint256 => bool) public onSale;
    mapping(uint256 => uint256) public tokenPrice;
    mapping(uint256 => string) public cidOfTokenId;

    uint256[] public onSaleTokenIds;

    function initialize() public initializer {
        __ERC1155_init('ipfs/');
        __Ownable_init();
        __ReentrancyGuard_init();
    }

    function getOnSaleTokenIds() external view returns (uint256[] memory) {
        return onSaleTokenIds;
    }

    function getTokenPrice(uint256 tokenId) external view returns (uint256) {
        return tokenPrice[tokenId];
    }

    function mint(uint256 quantity, string[] memory cidArr) external {
        uint256[] memory sccIdArr = new uint[](quantity);
        uint256[] memory amountArr = new uint[](quantity);
        for (uint i = sccCounter.current(); i < quantity; i++) {
            cidOfTokenId[sccCounter.current()] = cidArr[i];
            sccIdArr[i] = sccCounter.current();
            amountArr[i] = 1;
            sccCounter.increment();
        }
        
        // Replace to mint on Admin's address
        _mintBatch(msg.sender, sccIdArr, amountArr, '');
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        string memory cid = cidOfTokenId[tokenId];
        string memory uri = uri(tokenId);
        return bytes(uri).length > 0
            ? string(abi.encodePacked(uri, cid))
            : "";
    }

    // Allow smart-contract's admin to put a SCC on sale
    /*function putOnSale(uint256 tokenId, uint256 price) external {
        require(_exists(tokenId), "SCC does not exists.");
        require(ownerOf(tokenId) == msg.sender, "You must owns the SCC to sell it.");
        require(price > 0, "Price must be greater than 0.");

        onSale[tokenId] = true;
        tokenPrice[tokenId] = price;
        onSaleTokenIds.push(tokenId);
    }*/

    // Allow everyone to buy a SCC
    // function buy(uint256 tokenId) external payable {
        // Make msg.sender payable in order to let it send ether
    // }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

}