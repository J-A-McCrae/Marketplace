/// @title EmergencyStop: A circuit breaker for temporarily disabling contract functions
/// @author John McCrae

/// @dev This contract requires solidity compiler version 0.5 or higher
pragma solidity ^0.5.0;

/// @dev EmergencyStop: A contract that implements the circuit breaker design pattern
contract EmergencyStop {
    
    /// @param ownerESC A public payable address data type
    address payable public ownerESC;
    
    /// @param emergencyStopSwitch A public boolean data type to keep track of emergencyStopSwitch (circuit breaker flag)
    bool public emergencyStopSwitch;
   
    /// @param _emergencySwitchValue A boolean data type to keep track of changes to emergencyStopSwitch
    event LogEmergencyStopSwitch(bool _emergencySwitchValue);
   
    /// @dev verifyOwnerESC A modifier requiring the message sender address is equal to the owner address
    modifier verifyOwnerESC () {
        require(ownerESC == msg.sender, "Access denied. Access restricted to contract owner.");
        _;
    }
   
    /// @dev verifyEmergencyStopValue A modifier requiring emergencyStopSwitch (circuit breaker flag) to be false
    modifier verifyEmergencyStopValue () {
        require(emergencyStopSwitch == false, "Access denied. This contract has been temporarily disabled.");
        _;
    }

    /// @dev Declare constructor. Set ownerESC to be the contract creator.
    constructor () public {
        ownerESC = msg.sender;
    }

    /// @dev emergencyStopFunction() A function that allows setting emergencyStopSwitch (circuit breaker flag) to true or false
    /// @param emergencySwitchValue A boolean data type for changing the state of emergencyStopSwitch (circuit breaker flag)
    /// @return A boolean data type returning the new value of emergencyStopSwitch (circuit breaker flag)
    function emergencyStopFunction (bool emergencySwitchValue)
    public
    verifyOwnerESC
    returns(bool _emergencyStopSwitch)
    {
        emit LogEmergencyStopSwitch(emergencySwitchValue);
        emergencyStopSwitch = emergencySwitchValue;
        return emergencyStopSwitch;
    }
    
}