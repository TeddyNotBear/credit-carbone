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
    mapping(uint256 => bool) private exists;
    mapping(address => uint256[]) public tokensOwned;
    mapping(address => uint256) public tokensOwnedCount;

    uint256[] public onSaleTokenIds;
    uint256[] public sccIdArr;

    event PutOnSale(uint256 _tokenId, uint256 _price);

    function initialize(string memory _baseTokenURI, address _admin) public initializer {
        __ERC1155URIStorage_init();
        __Ownable_init();
        __ReentrancyGuard_init();
        _setBaseURI(_baseTokenURI);
        admin = _admin;
    }

    function getTotalSupply() public view returns (uint256) {
        return sccCounter.current();
    }

    function getOnSaleTokenIds() external view returns (uint256[] memory) {
        return onSaleTokenIds;
    }

    function getTokenPrice(uint256 tokenId) public view returns (uint256) {
        return tokenPrice[tokenId];
    }

    function getTokensOwnedCount(address owner) public view returns (uint256) {
        return tokensOwnedCount[owner];
    }

    function mint(address owner, uint256 quantity, string[] memory cidArr) external {
        for (uint256 i = 0; i < quantity; i++) {
            _mint(admin, sccCounter.current(), 1, '');
            exists[sccCounter.current()] = true;
            _pendingBalance[owner][sccCounter.current()] = 1;
            _setURI(sccCounter.current(), cidArr[i]);
            sccCounter.increment();
            tokensOwnedCount[owner]++;
        }
    }

    // Allow smart-contract's admin to put a SCC on sale
    function putOnSale(address owner, uint256 tokenId, uint256 price) external {
        require(_exists(tokenId), "SCC does not exists.");
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
        require(_exists(tokenId), "SCC does not exists.");
        require(balanceOf(admin, tokenId) == 1, "Admin must owns the SCC to sell it.");
        require(_pendingBalance[owner][tokenId] == 1, "You must owns the SCC to sell it.");

        onSale[tokenId] = false;
        tokenPrice[tokenId] = 0;
        
        uint256 index = _retrieveIndex(tokenId);
        _orderedArray(index);
    }

    // Allow everyone to buy a SCC
    function buy(address owner, uint256 tokenId) external {
        require(balanceOf(admin, tokenId) == 1, "Admin must owns the SCC to sell it.");

        _safeTransferFrom(admin, owner, tokenId, 1, '');

        tokensOwned[owner].push(tokenId);
        tokensOwnedCount[owner]++;
        // Reset price
        onSale[tokenId] = false;
        tokenPrice[tokenId] = 0;

        uint256 index = _retrieveIndex(tokenId);
        _orderedArray(index);
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    function _exists(uint256 tokenId) internal view returns (bool) {
        if(exists[tokenId]) {
            return true;
        }
        return false;
    }

    function _orderedArray(uint index) internal {
        for(uint i = index; i < onSaleTokenIds.length - 1; i++){
            onSaleTokenIds[i] = onSaleTokenIds[i + 1];   
        }
        onSaleTokenIds.pop();
    }

    function _retrieveIndex(uint tokenId) internal view returns (uint256) {
        uint256 index;
        for(uint i = 0; i < onSaleTokenIds.length - 1; i++) {
            if(onSaleTokenIds[i] == tokenId) {
                index = i;
            }
        }
        return index;
    }
    
}