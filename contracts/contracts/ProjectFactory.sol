import "./SCC.sol";
import "./UCO.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract ProjectFactory is Initializable,  OwnableUpgradeable {
    address private admin;

    mapping(address => address[]) public sccStorage;
    mapping(address => address[]) public ucoStorage;

    event SCCDeployed(address _sccAddress);
    event UCODeployed(address _ucoAddress);


    function initialize(address _admin) public initializer {
        admin = _admin;
    }
    
    function deployUCO(
        address _adminAddr, 
        string memory _name,
        string memory _symbol
    ) public returns (address) {
        UCO uco = new UCO();
        uco.initialize(_name, _symbol, msg.sender);
        ucoStorage[_adminAddr].push(address(uco));
        emit UCODeployed(address(uco));
        return address(uco);
    }

    function deploySCC(
        string memory _baseURI,
        address _adminAddr
    ) public {
        SCC scc = new SCC();
        scc.initialize(_baseURI, msg.sender);
        sccStorage[_adminAddr].push(address(scc));
        emit SCCDeployed(address(scc));
    }

    function getSCCstorage(address _admin) public view returns(address[] memory){
        return sccStorage[_admin];
    }

        function getUCOstorage(address _admin) public view returns(address[] memory){
        return ucoStorage[_admin];
    }
}