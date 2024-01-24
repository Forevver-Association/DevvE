// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract DevvE is ERC20Upgradeable {
    mapping(address => uint256) internal _minterLimit;
    mapping(address => uint256) internal _mintedAmount;
    mapping(address => bool) internal _explicitMinter;
    uint256 public constant GLOBAL_LIMIT = 300000000;
    address public constant FOREVVER_MINTER = 0xcC812569809Db07CF922171B1e7861a84e24839a;
    uint256 public constant FOREVVER_LIMIT = 150000000;
    address public constant DEVVIO_MINTER = 0xe84C2A38AeA6b700189A97E383783DF9Ae637f65;
    uint256 public constant DEVVIO_LIMIT = 150000000;
    address public constant CONTRACT_ADMIN = 0x37d0A81aD6A85945Db59E33C40cEa53275aC5694;

    function initialize() public initializer {
        __ERC20_init("DevvE", "DEVV");
        _explicitMinter[DEVVIO_MINTER] = true;
        _explicitMinter[FOREVVER_MINTER] = true;
        _minterLimit[DEVVIO_MINTER] = DEVVIO_LIMIT;
        _minterLimit[FOREVVER_MINTER] = FOREVVER_LIMIT;
        _mintedAmount[DEVVIO_MINTER] = 0;
        _mintedAmount[FOREVVER_MINTER] = 0;
    }

    function decimals() public pure override returns (uint8) {
        return 0;
    }

    function multiTransfer(address[] memory recipients, uint256[] memory amounts) public {
        require(recipients.length > 0);
        require(recipients.length == amounts.length);
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < recipients.length; i++) {
            require(amounts[i] > 0);
            totalAmount += amounts[i];
        }
        require(totalAmount <= balanceOf(msg.sender), "Sender does not have enough DevvE tokens.");
        for (uint256 i = 0; i < recipients.length; i++) {
            transferFrom(msg.sender, recipients[i], amounts[i]);
        }
    }

    function multiMint(address[] memory recipients, uint256[] memory amounts) public {
        require(_explicitMinter[msg.sender], "Caller does not have the minter role");
        require(recipients.length > 0, "No mint recipients.");
        require(recipients.length == amounts.length, "Recipient/Amount mismatch.");
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < recipients.length; i++) {
            require(amounts[i] > 0, "Invalid amount (zero or less).");
            totalAmount += amounts[i];
        }
        require(totalSupply() + totalAmount <= GLOBAL_LIMIT, "Minting this amount would exceed the global limit");
        require(_mintedAmount[msg.sender] + totalAmount <= _minterLimit[msg.sender], "Mint amount exceeds the caller's minting limit");
        for (uint256 i = 0; i < recipients.length; i++) {
            mint(recipients[i], amounts[i]);
        }
    }

    function mint(address to, uint256 amount) public {
        require(to != address(0), "Mint to the zero address");
        require(_explicitMinter[msg.sender], "Caller does not have the minter role");
        require(totalSupply() + amount <= GLOBAL_LIMIT, "Minting this amount would exceed the global limit");
        require(_mintedAmount[msg.sender] + amount <= _minterLimit[msg.sender], "Mint amount exceeds the caller's minting limit");

        _mintedAmount[msg.sender] += amount;
        _mint(to, amount);
    }

    function getMinterLimit(address minter) external view returns (uint256) {
        return _minterLimit[minter];
    }

    function getMintedAmountBy(address minter) external view returns (uint256) {
        return _mintedAmount[minter];
    }
}
