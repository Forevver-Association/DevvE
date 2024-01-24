// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract DevvE is ERC20Upgradeable, AccessControlUpgradeable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    mapping(address => uint256) public _minterLimit;
    mapping(address => uint256) public _mintedAmount;
    uint256 public constant GLOBAL_LIMIT = 300000000;
    address public constant FOREVVER_MINTER = 0xcC812569809Db07CF922171B1e7861a84e24839a;
    uint256 public constant FOREVVER_LIMIT = 150000000;
    address public constant DEVVIO_MINTER = 0xe84C2A38AeA6b700189A97E383783DF9Ae637f65;
    uint256 public constant DEVVIO_LIMIT = 150000000;

    function initialize() public initializer {
        __ERC20_init("DevvE", "DEVV");
        __AccessControl_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, FOREVVER_MINTER);
        _grantRole(MINTER_ROLE, DEVVIO_MINTER);
    }

    function decimals() public pure override returns (uint8) {
        return 0;
    }

    function mint(address to, uint256 amount) public {
        require(to != address(0), "Mint to the zero address");
        require(hasRole(MINTER_ROLE, msg.sender), "Caller does not have the minter role");
        require(totalSupply() + amount <= GLOBAL_LIMIT, "Minting this amount would exceed the global limit");

        if(!hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) {
            require(_mintedAmount[msg.sender] + amount <= _minterLimit[msg.sender], "Mint amount exceeds the caller's minting limit");
        }

        _mint(to, amount);
        _mintedAmount[msg.sender] += amount;
    }

    function setMinterLimit(address minter, uint256 limit) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Caller is not allowed to set minter limit");
        require(hasRole(MINTER_ROLE, minter), "Address is not a minter");
        _minterLimit[minter] = limit;
    }

    function getMinterLimit(address minter) external view returns (uint256) {
        return _minterLimit[minter];
    }

    function getMintedAmountBy(address minter) external view returns (uint256) {
        require(hasRole(MINTER_ROLE, minter), "Address is not a minter");
        return _mintedAmount[minter];
    }
}
