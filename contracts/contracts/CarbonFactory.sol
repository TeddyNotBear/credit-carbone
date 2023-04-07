import "./SCC.sol";
import "./UCO.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC1155/utils/ERC1155HolderUpgradeable.sol";
// import './interface/IMyERC1155.sol';
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract CarbonFactory is
    Initializable,
    ERC1155HolderUpgradeable,
    OwnableUpgradeable
{
    constructor() initializer {}

    mapping(address => address) public SCCstorage;
    mapping(address => address) public UCOstorage;
    event SCCDeployed(address _sccAddress);
    event UCODeployed(address _ucoAddress);
    address admin;

    function initialize(address _admin) public initializer {
        admin = _admin;
    }


    function deployUCO(address _adminAddr,string memory _name ,string memory _symbol) public {
        UCO uco = new UCO();
        uco.initialize(_name,_symbol);
        UCOstorage[_adminAddr] = address(uco);
        emit UCODeployed(address(uco));
    }


    function deploySCC(
        address _to,
        string memory baseUri,
        address ucoAddr
    ) public {
        SCC scc = new SCC();
        scc.initialize(baseUri,ucoAddr);
       // scc.mint(_to, uri, data,quantity);
        SCCstorage[_to] = address(scc);
        emit SCCDeployed(address(scc));
    }
}
