// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "hardhat/console.sol";

contract SCC is 
    ERC1155URIStorageUpgradeable, 
    OwnableUpgradeable, 
    ReentrancyGuardUpgradeable, 
    PausableUpgradeable
{
    using Counters for Counters.Counter;
    Counters.Counter private sccCounter;

    address private admin;

    mapping(uint256 => bool) public onSale;
    mapping(uint256 => uint256) public tokenPrice;
    mapping(uint256 => address) public sellers;
    mapping(address => mapping(uint256 => uint256)) public _pendingBalance;
    mapping(uint256 => bool) public _totalSupply;
    mapping(address => uint256[]) public tokensOwned;
    mapping(address => uint256) public tokensOwnedCount;

    uint256[] public onSaleTokenIds;

    event PutOnSale(uint256 _tokenId, uint256 _price);

    function initialize(string memory _baseTokenURI, address _admin) public initializer {
        __ERC1155URIStorage_init();
        __Ownable_init();
        __ReentrancyGuard_init();
        _setBaseURI(_baseTokenURI);
        admin = _admin;
    }

    function getOnSaleTokenIds() external view returns (uint256[] memory) {
        return onSaleTokenIds;
    }

    function getTokenPrice(uint256 tokenId) public view returns (uint256) {
        return tokenPrice[tokenId];
    }

    function exists(uint256 tokenId) public view returns (bool) {
        if(_totalSupply[tokenId]) {
            return true;
        }
        return false;
    }

    function mint(address owner, uint256 quantity, string[] memory cidArr) external {
        uint256[] memory sccIdArr = new uint[](quantity);
        uint256[] memory amountArr = new uint[](quantity);
        uint256 currentTokenId = sccCounter.current();
        for (uint i = currentTokenId; i < quantity; i++) {
            sccIdArr[i] = sccCounter.current();
            amountArr[i] = 1;
            _totalSupply[i] = true;
            _pendingBalance[owner][i] = 1;
            _setURI(sccCounter.current(), cidArr[i]);
            sccCounter.increment();
        }

        _mintBatch(admin, sccIdArr, amountArr, '');
    }

    // Allow smart-contract's admin to put a SCC on sale
    function putOnSale(address owner, uint256 tokenId, uint256 price) external {
        require(exists(tokenId), "SCC does not exists.");
        require(balanceOf(admin, tokenId) == 1, "Admin must owns your SCC to sell it.");
        require(_pendingBalance[owner][tokenId] == 1, "You must owns the SCC to sell it.");
        require(price > 0, "Price must be greater than 0.");

        onSale[tokenId] = true;
        tokenPrice[tokenId] = price;
        sellers[tokenId] = owner;
        onSaleTokenIds.push(tokenId);

        emit PutOnSale(tokenId, price);
    }

    function removeFromSale(address owner, uint256 tokenId) external {
        require(exists(tokenId), "SCC does not exists.");
        require(balanceOf(admin, tokenId) == 1, "Admin must owns the SCC to sell it.");
        require(_pendingBalance[owner][tokenId] == 1, "You must owns the SCC to sell it.");

        onSale[tokenId] = false;
        tokenPrice[tokenId] = 0;
        _remove(tokenId);
    }

    // Allow everyone to buy a SCC
    function buy(address owner, uint256 tokenId) external {
        require(balanceOf(admin, tokenId) == 1, "Admin must owns the SCC to sell it.");

        safeTransferFrom(admin, owner, tokenId, 1, '');

        tokensOwned[owner].push(tokenId);
        tokensOwnedCount[owner]++;
        // Reset price
        onSale[tokenId] = false;
        tokenPrice[tokenId] = 0;
        _remove(tokenId);
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    function _remove(uint256 index) internal {
        onSaleTokenIds[index] = onSaleTokenIds[onSaleTokenIds.length - 1];
        onSaleTokenIds.pop();
    } 
    
}