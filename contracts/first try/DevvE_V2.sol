// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./DevvE.sol";

contract DevvE_V2 is DevvE {
    function burn(uint256 amount) public {
        _burn(_msgSender(), amount);
    }
}
