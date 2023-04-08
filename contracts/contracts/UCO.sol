// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import 'erc721a-upgradeable/contracts/ERC721AUpgradeable.sol';
//import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

// use IERC721AUpgradeable to remove transfer function
contract UCO is ERC721AUpgradeable, ReentrancyGuardUpgradeable {
    using Counters for Counters.Counter;
    Counters.Counter private cidTokenCounter;

    string private _baseTokenURI;
    mapping(uint256 => string) public cidOfTokenId;
    address private factoryAddr;
    address private admin;

    function initialize(string memory _name, string memory _symbol,address _admin) initializerERC721A initializer public {
        __ERC721A_init(_name, _symbol);
        factoryAddr = msg.sender;
        admin = _admin;
        //__Ownable_init();
        __ReentrancyGuard_init();
    }


    function _onlyOwner() private view {
        require(
            msg.sender == factoryAddr || msg.sender == admin,
            "Not the Owner of the Gallery"
        );
    }
    modifier onlyOwner() {
        _onlyOwner();
        _;
    }
    // add address in params
    function mint(address owner, uint256 quantity, string[] memory cidArr) external payable nonReentrant {
        _safeMint(owner, quantity, '');

        for (uint i = 0; i < cidArr.length; i++) {
            cidOfTokenId[cidTokenCounter.current()] = cidArr[i];
            cidTokenCounter.increment();
        }
    }
    
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "URI query for nonexistent token");

        string memory cid = cidOfTokenId[tokenId];
        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0
            ? string(abi.encodePacked(baseURI, cid))
            : "";
    }

    function transferFrom(address from, address to, uint256 tokenId) public payable virtual override {
        revert("You can't transfer this asset");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public payable virtual override {
        revert("You can't transfer this asset");
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

}