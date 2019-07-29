/// @title MarketplaceProxy: A proxy contract for testing functions in Marketplace.sol
/// @author John McCrae
/// @notice Unused test functions have been commented out to prevent 'Out of Gas' error 

/// @dev This contract requires solidity compiler version 0.5 or higher.
pragma solidity ^0.5.0;

/// @dev This contract imports truffle/Assert.sol, truffle/DeployedAddresses.sol and ../contracts/Marketplace.sol
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Marketplace.sol";

/// @dev MarketplaceProxy: A proxy contract for testing functions in Marketplace
contract MarketplaceProxy {

    /// @param marketplace A data type, of type Marketplace contract
    Marketplace public marketplace;

    /// @dev Declare constructor. Set marketplace to be new instance of _contractToTest
    /// @dev _contractToTest A data type, of type Marketplace contract
    constructor(Marketplace _contractToTest) public {
         marketplace = _contractToTest;
    }

    /// @dev Allow contract to receive ether
    function() external payable {}

    /// @dev getTarget() A function to get the target address defined in the constructor
    /// @return marketplace
    function getTarget()
        public view
        returns (Marketplace)
    {
        return marketplace;
    }

    /// @dev proxyReadStoreProducts() A function to call the function readStoreProducts in marketplace
    /// @param _readProductID A uint data type to read data associated with store product ID
    /// @return boolean data type to indicate call success/failure
    //function proxyReadStoreProducts(uint _readProductID)
    //    public
    //    returns (bool)
    //{
    //    (bool noErrors, ) = address(marketplace).call(abi.encodeWithSignature("readStoreProducts(uint256)", _readProductID));
    //    return noErrors;
    //}

    /// @dev proxyBuyStoreProduct() A function to call the function buyStoreProducts in marketplace
    /// @param _buyProductID A uint data type to buy store product associated with store product ID
    /// @param _buyPayment A uint data type to buy store product associated with store product ID
    /// @return boolean data type to indicate call success/failure
    function proxyBuyStoreProduct(uint _buyProductID, uint256 _buyPayment)
        public
        returns (bool)
    {
        (bool noErrors, ) = address(marketplace).call.value(_buyPayment)(abi.encodeWithSignature("buyStoreProduct(uint256,uint256)", _buyProductID));
        return noErrors;
    }

    /// @dev proxyAddStoreProduct() A function to call the function addStoreProduct in marketplace
    /// @param _newProductName A string data type to add new store product name
    /// @param _newTotalUnits A uint data type to add new total store product units
    /// @param _newUnitPrice A uint data type to add new store product unit price
    /// @return boolean data type to indicate call success/failure
    function proxyAddStoreProduct(string memory _newProductName, uint _newTotalUnits, uint _newUnitPrice)
        public
        returns (bool)
    {
        (bool noErrors, ) = address(marketplace).call(abi.encodeWithSignature("addStoreProduct(string,uint256,uint256)", _newProductName, _newTotalUnits, _newUnitPrice));
        return noErrors;
    }

    /// @dev proxyRemoveStoreProduct() A function to call the function removeStoreProduct in marketplace
    /// @param _oldProductID A uint data type to remove store product associated with store product ID
    /// @return boolean data type to indicate call success/failure
    //function proxyRemoveStoreProduct(uint _oldProductID)
    //    public
    //    returns (bool)
    //{
    //    (bool noErrors, ) = address(marketplace).call(abi.encodeWithSignature("removeStoreProduct(uint256)", _oldProductID));
    //    return noErrors;
    //}

    /// @dev proxyChangeStoreProductPrice() A function to call the function changeStoreProductPrice in marketplace
    /// @param _changeProductID A uint data type to identify the store product to change
    /// @param _changeUnitPrice A uint data type to state the new price of the store product
    /// @return boolean data type to indicate call success/failure
    function proxyChangeStoreProductPrice(uint _changeProductID, uint _changeUnitPrice)
        public
        returns (bool)
    {
        (bool noErrors, ) = address(marketplace).call(abi.encodeWithSignature("changeStoreProductPrice(uint256,uint256)", _changeProductID, _changeUnitPrice));
        return noErrors;
    }

    /// @dev proxyAddStoreManager() A function to call the function addStoreManager in marketplace
    /// @param _newManagerName A string data type to add a new store manager name
    /// @param _newManagerAddress An address data type to add new store manager address
    /// @return boolean data type to indicate call success/failure
    function proxyAddStoreManager(string memory _newManagerName, address _newManagerAddress)
        public
        returns (bool)
    {
        (bool noErrors, ) = address(marketplace).call(abi.encodeWithSignature("addStoreManager(string,address)", _newManagerName, _newManagerAddress));
        return noErrors;
    }

    /// @dev proxyRemoveStoreManager() A function to call the function removeStoreManager in marketplace
    /// @param _oldManagerAddress An address data type to identify the store manager to remove
    /// @return boolean data type to indicate call success/failure
    //function proxyRemoveStoreManager(address _oldManagerAddress)
    //    public
    //    returns (bool)
    //{
    //    (bool noErrors, ) = address(marketplace).call(abi.encodeWithSignature("removeStoreManager(address)", _oldManagerAddress));
    //    return noErrors;
    //}

    /// @dev proxyReadStoreFunds() A function to call the function readStoreFunds in marketplace
    /// @return boolean data type to indicate call success/failure
    //function proxyReadStoreFunds()
    //    public
    //    returns (bool)
    //{
    //    (bool noErrors, ) = address(marketplace).call(abi.encodeWithSignature("readStoreFunds"));
    //    return noErrors;
    //}

    /// @dev proxyWithdrawStoreFunds() A function to call the function withdrawStoreFunds in marketplace
    /// @return boolean data type to indicate call success/failure
    function proxyWithdrawStoreFunds()
        public
        returns (bool)
    {
        (bool noErrors, ) = address(marketplace).call(abi.encodeWithSignature("withdrawStoreFunds"));
        return noErrors;
    }

    /// @dev proxyEmergencyStopFunction() A function to call the function emergencyStopFunction in marketplace
    /// @return boolean data type to indicate call success/failure
    function proxyEmergencyStopFunction()
        public
        returns (bool)
    {
        (bool noErrors, ) = address(marketplace).call(abi.encodeWithSignature("emergencyStopFunction"));
        return noErrors;
    }
}