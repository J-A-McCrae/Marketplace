# Avoiding Common Attacks

## Tests Implemented

The folling tests have been implemented for the two DApp contracts.

Marketplace.sol
* Test For Not Exceeding Integer Caps
* Test For Buying Product With Insufficient Funds
* Test For Not Store Manager Changing Product Price
* Test For Not Store Owner Reading Store Funds
* Test For Not Store Owner Withdrawing Store Funds

The 5 No. tests for Marketplace.sol were chosen to test key potential security vulnerabilities (integer overflow/underflow protection, privilaged access and funds transfer). 

EmergencyStop.sol
* Test for Activating Circuit Breaker

The 1 No. test for EmergencyStop.sol was was chosen to test the sole function in the contract (i.e the circuit breaker design pattern).

---

The following four common attacks are explained below - each mitigated in this DApp

## Common Attack No. 1 - tx.origin Attack

A tx.origin attack may be executed via a malicious proxy contract forwarding calls from the contract owner. 
The global variable tx.origin should never be used for authorisation (msg.sender is the safer alternative).

* tx.origin references the address of the original transaction sender from the full call chain.
* msg.sender references the address of the sender of the current call.

This DApp implements privilaged access to certain functions using only msg.sender, and never tx.origin.

i)	The EmergencyStop contract declares a modifier requiring emergencyStopSwitch to be false.

    modifier verifyOwnerESC () {
        require(ownerESC == msg.sender, "Access denied. Access restricted to contract owner.");
        _;
    }

## Common Attack No. 2 - Denial of Service Attack

A denial of service attack may be executed by a malicious contract deliberately throwing an unexpected revert when called, thereby stopping execution in the calling contract.
This attack vector may manifest in functions which depend on successfull calls or transfers to external addresses as part of their exection logic.

This DApp avoids making calls to external address to mitigate risk of DoS attacks. Where transfers are made, unexpected reverts do not pose a risk.

i)	The Marketplace contract declares a function withdrawStoreFunds which executes a transfer that exhibits no dependencies upon successful execution.

    function withdrawStoreFunds()
        public
        verifyOwnerMarketplace
        returns(bool)
    {
        emit LogStoreFundsWithdrawn("Funds withdrawn");
        ownerMarketplace.transfer(address(this).balance);
        return true;
    }

## Common Attack No. 3 - Reentrancy Attack

A reentrancy attack may be executed by a malicious contract executing call-back logic via a fall-back function when it is called via the keyword 'call' in the calling contract.
This exploit may be particularly effective when the calling contract logic executes the 'call' keyword before updating it's own internal state variables.

This DApp avoids making calls to external address to mitigate risk of reentrancy attacks. Where calls are made, the keyword 'call' is not used.

i)	The Marketplace contract declares a function withdrawStoreFunds which executes a transfer using the keyword 'transfer'.

    function withdrawStoreFunds()
        public
        verifyOwnerMarketplace
        returns(bool)
    {
        emit LogStoreFundsWithdrawn("Funds withdrawn");
        ownerMarketplace.transfer(address(this).balance);
        return true;
    }

## Common Attack No. 4 - Integer Overflow/Underflow Attack

An integer overflow/underflow attack may be executed by a malicious user via exploiting the inherent chracteristics of uint variables, whereby they wrap around to zero beyond their maximum value.
This vulnerability may be exploited to bypass contract logic that does not account for the overflow characteristics of uint variables. Mitigations may be implemented by imposing checks on user input. 

This DApp implements integer caps to certain function inputs definable by the user, via modfifer verifyWithinUnitsCap.

i)	The Marketplace contract declares a modifier requiring _newTotalUnits to be no more than 1,000,000, limiting the user input range.

    modifier verifyWithinUnitsCap (uint _newTotalUnits) {
        require (_newTotalUnits <= 1000000, "Request declined. Total units cap of 1,000,000 enforced.");
        _;
    }	
