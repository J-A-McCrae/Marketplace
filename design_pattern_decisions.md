# Design Pattern Decisions

The following design patterns have been implemented in this DApp.

1. Circuit Breaker
2. Privilaged Access
3. Integer Caps
4. Simple & Modular Design

* The circuit breaker design pattern was deemed an simple and effective way to mitigate the risk of security flaws subsequent to deployment. This method also allowed demonstration of inheritance.
* The privilaged access design pattern was deemed the best way to restrict access to specific contract functions to Store Owner, Store Manager and Store Customer as required by the DApp.
* The integer caps design pattern was deemed an effective method to mitgiate the risk of integer overflows and underflows and to minimize the amount fo funds at risk.
* The simple and modular design pattern was deemed an effective method to mitigate the risk of introducing security flaws into the code by minimizing complexity.

The following design patterns have not been implemented in this DApp.

1. Contract Self Destruction
2. Factory Contract
3. Speed Bumps (Delayed Processing)

* The contract self destruction design pattern was discarded in favour of the circuit breaker design pattern as it was deemed undesirably irriversible.
* The factory contract design pattern was not implemented as it was deemed too complex and unnecessary for this DApp. Previous projects such as The DAO have highlighted the risks assocaited with this.
* The speed bumps design pattern was not implemented as it was deemed unnecessary for this DApp. It was also observed that it would be undesirably time-consuming to evaluate.

## Design Pattern No. 1 - Circuit Breaker

This DApp implements a circuit breaker design pattern, via the EmergencyStop contract. 
This allows the contract owner to temporarily disable the functions of the Marketplace contract.

i)	The EmergencyStop contract declares a modifier requiring emergencyStopSwitch to be false.

    modifier verifyEmergencyStopValue () {
        require(emergencyStopSwitch == false, "Access denied. This contract has been temporarily disabled.");
        _;
    }

ii)	The EmergencyStop contract declares a function, allowing the contract owner to set emergencyStopSwitch to true or false.

    function emergencyStopFunction (bool emergencySwitchValue)
    public
    verifyOwnerESC
    returns(bool _emergencyStopSwitch)
    {
        emit LogEmergencyStopSwitch(emergencySwitchValue);
        emergencyStopSwitch = emergencySwitchValue;
        return emergencyStopSwitch;
    }

iii)	The Marketplace contract inherits the EmergencyStop contract.

contract Marketplace is EmergencyStopContract {

iv)	The Marketplace contract calls the modifier verifyEmergencyStopValue in all core functions.

    function addStoreProduct(string memory newProductName, uint newTotalUnits, uint newUnitPrice)
        public
        verifyEmergencyStopValue

## Design Pattern No. 2 - Privilaged Access

This DApp implements privilaged access to certain functions, via modfifers verifyOwnerMarketplace and verifyManagerMarketplace.
This restricts certain functions to be accessible by only the store owner (contract owner) or store managers (authorised by the store owner).

i)	The Marketplace contract declares a modifier requiring the message sender to be equal to ownerMarketplace (contract owner).

    modifier verifyOwnerMarketplace () {
        require (msg.sender == ownerMarketplace, "Access denied. Access restricted to contract owner.");
        _;
    }

ii)	The Marketplace contract declares a modifier requiring the message sender managerAuth to be equal to true (authorised as store manager).

    modifier verifyManagerMarketplace () {
        require (storeMan[msg.sender].managerAuth == true, "Access denied. Access restricted to store managers.");
        _;
    }

iii)	The Marketplace contract calls the modifiers verifyOwnerMarketplace or verifyManagerMarketplace as relevant to restrict access to functions.

    function addStoreProduct(string memory newProductName, uint newTotalUnits, uint newUnitPrice)
        public
        verifyEmergencyStopValue
        verifyManagerMarketplace

## Design Pattern No. 3 - Integer Caps

This DApp implements integer caps to certain function inputs definable by the user, via modfifers verifyWithinPriceCap and verifyWithinUnitsCap.
This both minimizes the amount of money at risk and mitigates potenital integer overflow/unflow attacks via checking user inputs are within bounds.

i)	The Marketplace contract declares a modifier requiring _newUnitPrice to be no more than 1,000 Wei.

    modifier verifyWithinPriceCap (uint _newUnitPrice) {
        require (_newUnitPrice <= 1000, "Request declined. Price cap of 1,000 Wei enforced.");
        _;
    }

ii)	The Marketplace contract declares a modifier requiring _newTotalUnits to be no more than 1,000,000.

    modifier verifyWithinUnitsCap (uint _newTotalUnits) {
        require (_newTotalUnits <= 1000000, "Request declined. Total units cap of 1,000,000 enforced.");
        _;
    }

iii)	The Marketplace contract calls the modifiers verifyWithinPriceCap or verifywithinUnitsCap as relevant to impose user input caps to certain functions.

    function addStoreProduct(string memory newProductName, uint newTotalUnits, uint newUnitPrice)
        public
        verifyEmergencyStopValue
        verifyManagerMarketplace
        verifyWithinPriceCap (newUnitPrice)
        verifyWithinUnitsCap (newTotalUnits)

## Design Pattern No. 4 - Simple & Modular

This DApp implements a simple modular design, including clear commenting and avoiding external contract calls.
This aids development, testing and deployment whilst minimizing risk of security vulnerabilities.
 
i)	Modularity is implemented via the use of an independant circuit breaker contract, independant proxy test contract and seperate html pages.

ii)	Clear comments are provided in the solidity contracts, test scripts, javascript and html files.

iii)	External contract calls are avoided to enhance simplicity.

