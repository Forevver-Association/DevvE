// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./DevvE.sol";

contract DevvE_V2 is DevvE {

    constructor() {
        _disableInitializers();
    }

    function burn(uint256 amount) public {
        _burn(_msgSender(), amount);
    }
}
