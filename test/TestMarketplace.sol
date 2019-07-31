/// @title TestMarketplace: A test contract for running tests on Marketplace.sol via MarketplaceProxy.sol
/// @author John McCrae

/// @dev This contract requires solidity compiler version 0.5 or higher.
pragma solidity ^0.5.0;

/// @dev This contract imports truffle/Assert.sol, truffle/DeployedAddresses.sol, ../contracts/Marketplace.sol and ./MarketplaceProxy.sol
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Marketplace.sol";
import "./MarketplaceProxy.sol";

/// @dev TestMarketplace: A test contract for running tests on Marketplace via MarketplaceProxy
contract TestMarketplace {

    /// @param initialBalance A public uint data type
    uint public initialBalance = 1 ether;

    /// @dev contractToTest A data type, of type Marketplace contract
    Marketplace public contractToTest;

    /// @dev proxyClientOne A data type, of type Marketplace contract
    MarketplaceProxy public proxyClientOne;

    /// @dev Allow contract to receive ether
    function() external payable {}

    /// @dev beforeEach() A function to set up new contract instances and conditions before each test
    /// @dev contractToTest A new instance of Marketplace
    /// @dev proxyClientOne A new instance of MarketplaceProxy, with target contractTotest
    function beforeEach() public
    {
        contractToTest = new Marketplace();
        proxyClientOne = new MarketplaceProxy(contractToTest);
        address(proxyClientOne).transfer(0.1 ether);
    }
    
    /// @dev testForExceedingIntegerCaps() A function to execute Test #1
    function testForExceedingIntegerCaps() public {

        /// @dev Declare input values, _newManName and _newManAddress
        string memory _newManName = "Alice";
        address _newManAddress = address(proxyClientOne);
        /// @dev Owner tries to add new store manager
        uint _manID; string memory _manName; bool _manAuth; address _manAddress;
        ( _manID, _manName, _manAuth, _manAddress) = contractToTest.addStoreManager(_newManName, _newManAddress);
        Assert.equal(_manAuth, true, "Store owner could not add a new store manager");

        /// @dev Declare input values, _newProdName, _newProdUnits and _newUnitPrice
        string memory _newProdName = "Diamond";
        uint _newTotalUnits = 1000000;
        uint _newUnitPrice = 1001;
        /// @dev New store manager tries to add new store product exceeding price cap of 1,000 Wei
        bool resultOne = proxyClientOne.proxyAddStoreProduct(_newProdName, _newTotalUnits, _newUnitPrice);
        Assert.equal(resultOne, false, "New store manager was able to bypass price cap");
    }

    /// @dev testForBuyingProductWithInsufficientFunds() A function to execute Test #2
    function testForBuyingProductWithInsufficientFunds() public {

        /// @dev Declare input values, _newManName and _newManAddress
        string memory _newManName = "Alice";
        address _newManAddress = address(proxyClientOne);
        /// @dev Owner tries to add new store manager
        uint _manID; string memory _manName; bool _manAuth; address _manAddress;
        ( _manID, _manName, _manAuth, _manAddress) = contractToTest.addStoreManager(_newManName, _newManAddress);
        Assert.equal(_manAuth, true, "Store owner could not add a new store manager");

        /// @dev Declare input values, _newProdName, _newProdUnits and _newUnitPrice
        string memory _newProdName = "Diamond";
        uint _newTotalUnits = 1000000;
        uint _newUnitPrice = 1000;
        /// @dev New store manager tries to add new store product
        bool resultTwo = proxyClientOne.proxyAddStoreProduct(_newProdName, _newTotalUnits, _newUnitPrice);
        Assert.equal(resultTwo, true, "New store manager could not add a new store product");

        /// @dev Declare input values, buyProductID and buyPayment
        uint _buyProductID = 0;
        uint _buyPayment = 999;
        /// @dev Buyer tries to buy product with insufficient funds
        bool resultThree = proxyClientOne.proxyBuyStoreProduct(_buyProductID, _buyPayment);
        Assert.equal(resultThree, false, "Buyer was able to buy product with insufficient funds");
    }

    /// @dev testForNotStoreManagerChangingProductPrice() A function to execute Test #3
    function testForNotStoreManagerChangingProductPrice() public {

        /// @dev Declare input values, _newManName and _newManAddress
        string memory _newManName = "Alice";
        address _newManAddress = address(this);
        /// @dev Owner tries to add new store manager
        uint _manID; string memory _manName; bool _manAuth; address _manAddress;
        ( _manID, _manName, _manAuth, _manAddress) = contractToTest.addStoreManager(_newManName, _newManAddress);
        Assert.equal(_manAuth, true, "Store Owner could not add a new store manager");

        /// @dev Declare input values, _newProdName, _newProdUnits and _newUnitPrice
        string memory _newProdNameIn = "Diamond";
        uint _newTotalUnitsIn = 1;
        uint _newUnitPriceIn = 1000;
        /// @dev New store manager tries to add new store product
        uint _prodIDGen; string memory _newProdName; uint _NewTotUnits; uint _newUPrice; bool _newfSale; uint _newbuyAcc;
        ( _prodIDGen, _newProdName, _NewTotUnits, _newUPrice, _newfSale, _newbuyAcc) = contractToTest.addStoreProduct(_newProdNameIn, _newTotalUnitsIn, _newUnitPriceIn);
        Assert.equal(_newfSale, true, "New store manager could not add a new store product");

        /// @dev Declare input values, _changeProductID and _changeUnitPrice
        uint _changeProductID = 0;
        uint _changeUnitPrice = 99;
        /// @dev Not store manager tries to change store product price
        bool resultThree = proxyClientOne.proxyChangeStoreProductPrice(_changeProductID, _changeUnitPrice);
        Assert.equal(resultThree, false, "Store manager was able to change store product price");
    }

    /// @dev testForNotStoreOwnerReadingFunds() A function to execute Test #4
    function testForNotStoreOwnerReadingFunds() public {

        /// @dev Not store owner tries to read store funds
        bool resultOne = proxyClientOne.proxyReadStoreFunds();
        Assert.equal(resultOne, false, "Not store owner was able to read store funds");
    }

    /// @dev testForNotStoreOwnerWithdrawingFunds() A function to execute Test #5
    function testForNotStoreOwnerWithdrawingFunds() public {

        /// @dev Not store owner tries to withdraw store funds
        bool resultOne = proxyClientOne.proxyWithdrawStoreFunds();
        Assert.equal(resultOne, false, "Not store owner was able to withdraw store funds");
    }

    /// @dev testForActivatingCircuitBreaker() A function to execute Test #6
    function testForActivatingCircuitBreaker() public {

        /// @dev Owner tries to trigger circuit breaker
        bool resultOne = contractToTest.emergencyStopFunction(true);
        Assert.equal(resultOne, true, "Store owner could not trigger circuit breaker");
    }

}