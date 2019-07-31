
/// @title LibraryDemo: A demo contract showcasing the use of libraries in solidity
/// @author John McCrae
/// @notice This contract may be evaluated at https://remix.ethereum.org

/// @dev This contract requires solidity compiler version 0.5 or higher.
pragma solidity ^0.5.0;

/// @dev **Please delete the four lines indicated prior to evlaution. // **DELETE THIS LINE**
contract DeleteMe {constructor() public {}} // **DELETE THIS LINE**

/* // **DELETE THIS LINE**
/// @dev This contract utilizes ABIEncoderV2 (Supported in Remix)
pragma experimental ABIEncoderV2;

/// @dev Demo: A library for calculating the total stock value of a product in the store
library Demo {
    
    /// @param productName A string data type to keep track of store product names
    /// @param totalUnits A uint data type to keep track of total store product units
    /// @param unitPrice A uint data type to keep track of store product unit prices
    /// @param forSale A uint data type to keep track of whether store product is for sale
    /// @param buyersAcc A uint data type to keep track of total product units held within the buyers account
    struct Products
    {
        string productName;
        uint totalUnits;
        uint unitPrice;
        bool forSale;
        uint buyersAcc;
    }

    /// @dev calcStockValueUsingLib() A function to calculate and return the stock value of a product
    /// @param _storeProd A Products data type from the calling contract containing the struct product data
    /// @return _stockProduct, stockValue
    function _calcStockValueUsingLib (Products memory _storeProd)
        public
        pure
        returns (string memory _stockProduct, uint _stockValue)
    {
        string memory stockProduct = _storeProd.productName;
        uint stockValue = _storeProd.totalUnits * _storeProd.unitPrice;
        return (stockProduct, stockValue);
    }

}

/// @dev LibraryDemo: A contract for interacting with the Demo library
contract LibraryDemo {

    /// @param storeProd A Demo.Products data type to keep track of store product data
    Demo.Products storeProd;

    /// @dev Declaration to use the Demo library for the Demo.Products data type
    using Demo for Demo.Products;

    /// @dev clearProducts() A function to allowing clearing of data in the storeProd struct
    /// @return true
    function clearProducts ()
        public
        returns (bool)
    {
        storeProd.productName = "";
        storeProd.totalUnits = 0;
        storeProd.unitPrice = 0;
        storeProd.forSale = false;
        storeProd.buyersAcc = 0;
        return true;
    }

    /// @dev writeProducts() A function to allow inputting new data into the storeProd struct
    /// @return true
    function writeToProducts (string memory _productName, uint _totalUnits, uint _unitPrice, bool _forSale, uint _buyersAcc)
        public
        returns (bool)
    {
        storeProd.productName = _productName;
        storeProd.totalUnits = _totalUnits;
        storeProd.unitPrice = _unitPrice;
        storeProd.forSale = _forSale;
        storeProd.buyersAcc = _buyersAcc;
        return true;
    }

    /// @dev readProducts() A function to allow reading of data in the storeProd struct
    /// @return storeProd.productName, storeProd.totalUnits, storeProd.unitPrice, storeProd.forSale, storeProd.buyersAcc
    function readProducts ()
        public
        view
        returns (string memory _productName, uint _totalUnits, uint _unitPrice, bool _forSale, uint _buyersAcc)
    {
        return(storeProd.productName, storeProd.totalUnits, storeProd.unitPrice, storeProd.forSale, storeProd.buyersAcc);
    }

    /// @dev calcStockValueUsingLibrary() A function that calls the assocaited library function to get the stock value
    /// @return storeProd._calcStockValueUsingLib()
    function calcStockValueUsingLibrary ()
        public
        view
        returns (string memory _stockProduct, uint _stockValue)
    {
        return storeProd._calcStockValueUsingLib();
    }

}
*/ // **DELETE THIS LINE**
