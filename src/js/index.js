/// @title index.js: Web3 javascript code, imported into index.html, for interfacing with Marketplace.sol smart contract.  
/// @author John McCrae

/// @dev Start of application code
App = {
    web3Provider: null,
    contracts: {},  

    /// @dev Initialize web3 provider by getting the injected web3 object, where available
    initWeb3: async function() {
      /// @dev  Modern DApp browsers...
      if (window.ethereum) {
        App.web3Provider = window.ethereum;
          try {
            /// @dev  Request account access
            await window.ethereum.enable();
          } catch (error) {
            /// @dev  User denied account access...
            console.error("User denied account access")
          }
      }
      /// @dev  Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = window.web3.currentProvider;
      }
      /// @dev If no injected web3 instance is detected, fall back to Ganache
      else {
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      }
      web3 = new Web3(App.web3Provider);
      return App.initContract();
    },

    /// @dev Initialize truffle smart contract by getting the artifact generated by the compiler 
    initContract: function() {
      $.getJSON('Marketplace.json', function(data) {
        /// @dev Get the necessary contract artifact file and instantiate it with truffle-contract
        var MarketplaceArtifact = data;
        App.contracts.Marketplace = TruffleContract(MarketplaceArtifact); 

        /// @dev Set the provider for our contract
        App.contracts.Marketplace.setProvider(App.web3Provider);
        
        return App.getAddresses();
      });
    },

    /// @dev Get the addresses of both the deployed contract and current the user account
    getAddresses: function () {
      /// @dev Update UI
      $('#lastUserAction').text("User changed account."); 
      $('#report1').text("");   
      $('#report2').text("");
      $('#report3').text("");
      $('#report4').text("");
      $('#report5').text("");

      /// @dev Get the address of the deployed contract instance
      App.contracts.Marketplace.deployed().then(function(instance) {
        return instance.address;
        }).then(function(result) {
          $('#deployedAt').text(result);
        });

      /// @dev Get the address of the current user account
      web3.eth.getAccounts(function(error, accounts) {
        $('#userAddress').text(accounts);  
      });
    return App.verifyOwner();
    },

    /// @dev Check if the current user account address is the store owner address
    verifyOwner: function () {      

      App.contracts.Marketplace.deployed().then(function(instance) {
        return instance.ownerMarketplace.call();
        }).then(function(result) {
          var contractOwner = result

          web3.eth.getAccounts(function(error, accounts) {
            var userAddress = accounts

            if (userAddress == contractOwner) {
              return App.ownerInterface();
            } else {
              return App.verifyManager();
            }
          });
        });
    }, 

    /// @dev Check if the current user account address is an authorised store manager address
    verifyManager: function () {

      web3.eth.getAccounts(function(error, accounts) {
      var userAddress = accounts

      var struct_data = [];
      App.contracts.Marketplace.deployed().then(function(instance) {
        return instance.storeMan.call(userAddress);
        }).then(function(mapping_value) {

            if (mapping_value[2] == true) {
              return App.managerInterface();
            } else {
              return App.customerInterface();
            }
        });
      });
    },

    /// @dev Load Store Owner UI 
    ownerInterface: function () {
      if (localStorage.getItem("pageTagKey") != "ownerPage") {
        window.location.href = "../index.html";
        localStorage.setItem("pageTagKey", "ownerPage");
      }   
      $('#userInterface').text("Store Owner"); 
    }, 

    /// @dev Load Store Manager UI
    managerInterface: function () {
      if (localStorage.getItem("pageTagKey") != "managerPage") {
        window.location.href = "../index-manager.html";
        localStorage.setItem("pageTagKey", "managerPage");
      }   
      $('#userInterface').text("Store Manager"); 
    }, 

    /// @dev Load Store Customer UI  
    customerInterface: function () {
      if (localStorage.getItem("pageTagKey") != "customerPage") {
        window.location.href = "../index-customer.html";
        localStorage.setItem("pageTagKey", "customerPage");
      }   
      $('#userInterface').text("Store Customer"); 
    }, 

    /// @dev Call the readStoreProducts function of the deployed instance (App.contracts.Marketplace) 
    inputReadStore: function () { 
      let prodIDReadOwner = $('#prod_id_read_owner').val();

      App.contracts.Marketplace.deployed().then(function(instance) {
        return instance.readStoreProducts.call(prodIDReadOwner);
      }).then(function(res) {       
        $('#lastUserAction').text("Requested store product data. Success!");       
        $('#report1').text("Product ID: " + res[0]);
        $('#report2').text("Product Name: " + res[1]);
        $('#report3').text("Total Units: " + res[2]);
        $('#report4').text("Unit Price: " + res[3]);
        $('#report5').text("For Sale: " + res[4]);        
        $('#report6').text("User Account: " + res[5] + " " + res[1] + "(s)");
      }).catch(function(err) {
        $('#lastUserAction').text("Requested store product data. Unsuccessful..."); 
        
        if (err.message.includes("Access denied. This contract has been temporarily disabled.")) {
          $('#report1').text("Access denied. This contract has been temporarily disabled."); 
        } else if 
          (err.message.includes("Internal JSON-RPC error")) {
          $('#report1').text("Access denied. This contract has been temporarily disabled.");           
        } else {
          $('#report1').text(err.message); 
        } 
        $('#report2').text("");
        $('#report3').text("");
        $('#report4').text("");
        $('#report5').text("");
        $('#report6').text("");
      });             
      document.getElementById('prod_id_read_owner').value = ""
      return App.verifyOwner();
    },

    /// @dev Execute the buyStoreProducts function of the deployed instance (App.contracts.Marketplace)     
    inputBuyStoreProd: function () { 
      let prodETHBuy = $('#prod_eth_buy').val();
      let prodIDBuy = $('#prod_id_buy').val();

      App.contracts.Marketplace.deployed().then(function(instance) {
        return instance.buyStoreProduct.sendTransaction(prodIDBuy, {value:prodETHBuy});
      }).then(function(res) {
        $('#lastUserAction').text("Requested store product purchase. Success!"); 
        $('#report1').text("Tx Receipt: " + res);   
        $('#report2').text("");
        $('#report3').text("");
        $('#report4').text("");
        $('#report5').text("");
        $('#report6').text("");
      }).catch(function(err) {
        $('#lastUserAction').text("Requested store product purchase. Unsuccessful..."); 

        if (err.message.includes("Access denied. This contract has been temporarily disabled.")) {
          $('#report1').text("Access denied. This contract has been temporarily disabled."); 
        } else if 
          (err.message.includes("Request declined. Store product is not for sale.")) {
          $('#report1').text("Request declined. Store product is not for sale.");             
        } else if 
          (err.message.includes("Payment declined. Unit out of stock.")) {
          $('#report1').text("Payment declined. Unit out of stock.");  
        } else if 
          (err.message.includes("Payment declined. Insufficient funds received.")) {
          $('#report1').text("Payment declined. Insufficient funds received.");         
        } else {
          $('#report1').text(err.message); 
        }  
        $('#report2').text("");
        $('#report3').text("");
        $('#report4').text("");
        $('#report5').text("");
        $('#report6').text("");
      });
      document.getElementById('prod_eth_buy').value = ""
      document.getElementById('prod_id_buy').value = ""
      return App.verifyOwner();
    },

    /// @dev Execute the addStoreProducts function of the deployed instance (App.contracts.Marketplace)      
    inputAddStoreProd: function () { 
      let prodNameAdd = $('#prod_name_add').val();
      let prodUnitsAdd = $('#prod_units_add').val();
      let prodPriceAdd = $('#prod_price_add').val();
      
      App.contracts.Marketplace.deployed().then(function(instance) {
        return instance.addStoreProduct(prodNameAdd, prodUnitsAdd, prodPriceAdd);
      }).then(function(res) {
        $('#lastUserAction').text("Requested adding new product to store. Success!"); 
        $('#report1').text("Product ID: " + res.logs[0].args._newProductID);
        $('#report2').text("Product Name: " + res.logs[0].args._newProductName);
        $('#report3').text("Total Units: " + res.logs[0].args._newTotalUnits);
        $('#report4').text("Unit Price: " + res.logs[0].args._newUnitPrice);
        $('#report5').text("For Sale: " + res.logs[0].args._forSale);        
        $('#report6').text("User Account: " + res.logs[0].args._buyersAcc);
      }).catch(function(err) {
        $('#lastUserAction').text("Requested adding new product to store. Unsuccessful..."); 
        
        if (err.message.includes("Access denied. This contract has been temporarily disabled.")) {
          $('#report1').text("Access denied. This contract has been temporarily disabled."); 
        } else if 
          (err.message.includes("Access denied. Access restricted to store managers.")) {
          $('#report1').text("Access denied. Access restricted to store managers.");             
        } else if 
          (err.message.includes("Request declined. Price cap of 1,000 Wei enforced.")) {
          $('#report1').text("Request declined. Price cap of 1,000 Wei enforced.");  
        } else if 
          (err.message.includes("Request declined. Total units cap of 1,000,000 enforced.")) {
          $('#report1').text("Request declined. Total units cap of 1,000,000 enforced.");         
        } else {
          $('#report1').text(err.message); 
        }
        $('#report2').text("");
        $('#report3').text("");
        $('#report4').text("");
        $('#report5').text("");
        $('#report6').text("");
      });
    document.getElementById('prod_name_add').value = ""
    document.getElementById('prod_units_add').value = ""
    document.getElementById('prod_price_add').value = ""
    return App.verifyOwner();
    },

    /// @dev Execute the removeStoreProducts function of the deployed instance (App.contracts.Marketplace)       
    inputRemoveStoreProd: function () { 
        let prodIDRemove = $('#prod_id_remove').val();
        
        App.contracts.Marketplace.deployed().then(function(instance) {
          return instance.removeStoreProduct(prodIDRemove);
        }).then(function(res) {     
          $('#lastUserAction').text("Requested removing existing product from store. Success!"); 
          $('#report1').text("Product ID: " + res.logs[0].args._oldProductID);
          $('#report2').text("Product Name: " + res.logs[0].args._oldProductName);
          $('#report3').text("Total Units: " + res.logs[0].args._oldTotalUnits);
          $('#report4').text("Unit Price: " + res.logs[0].args._oldUnitPrice);
          $('#report5').text("For Sale: " + res.logs[0].args._forSale);  
          $('#report6').text("User Account: " + res.logs[0].args._buyersAcc);
        }).catch(function(err) {
        $('#lastUserAction').text("Requested removing existing product from store. Unsuccessful..."); 
        
        if (err.message.includes("Access denied. This contract has been temporarily disabled.")) {
          $('#report1').text("Access denied. This contract has been temporarily disabled."); 
        } else if 
          (err.message.includes("Access denied. Access restricted to store managers.")) {
          $('#report1').text("Access denied. Access restricted to store managers.");             
        } else if 
          (err.message.includes("Request declined. Store product is not for sale.")) {
          $('#report1').text("Request declined. Store product is not for sale.");        
        } else {
          $('#report1').text(err.message); 
        } 
          $('#report2').text("");
          $('#report3').text("");
          $('#report4').text("");
          $('#report5').text("");
          $('#report6').text("");
        });
    document.getElementById('prod_id_remove').value = ""
    return App.verifyOwner();
    },


    /// @dev Execute the changeStoreProductPrice function of the deployed instance (App.contracts.Marketplace)     
    inputChangeStoreProdPrice: function () { 
      let prodIDChange = $('#prod_id_change').val();
      let prodPriceChange = $('#prod_price_change').val();
      
      App.contracts.Marketplace.deployed().then(function(instance) {
        return instance.changeStoreProductPrice(prodIDChange, prodPriceChange);
      }).then(function(res) {             
        $('#lastUserAction').text("Requested changing exising store product price. Success!"); 
        $('#report1').text("Product ID: " + res.logs[0].args._changeProductID);
        $('#report2').text("Product Name: " + res.logs[0].args._changeProductName);
        $('#report3').text("Total Units: " + res.logs[0].args._changeTotalUnits);
        $('#report4').text("Unit Price: " + res.logs[0].args._changeUnitPrice);
        $('#report5').text("For Sale: " + res.logs[0].args._forSale);
        $('#report6').text("");  
      }).catch(function(err) {
      $('#lastUserAction').text("Requested changing exising store product price. Unsuccessful..."); 
      
      if (err.message.includes("Access denied. This contract has been temporarily disabled.")) {
        $('#report1').text("Access denied. This contract has been temporarily disabled."); 
      } else if 
        (err.message.includes("Access denied. Access restricted to store managers.")) {
        $('#report1').text("Access denied. Access restricted to store managers.");             
      } else if 
        (err.message.includes("Request declined. Store product is not for sale.")) {
        $('#report1').text("Request declined. Store product is not for sale.");  
      } else if 
        (err.message.includes("Request declined. Price cap of 1,000 Wei enforced.")) {
        $('#report1').text("Request declined. Price cap of 1,000 Wei enforced.");         
      } else {
        $('#report1').text(err.message); 
      }  
        $('#report2').text("");
        $('#report3').text("");
        $('#report4').text("");
        $('#report5').text("");
        $('#report6').text("");    
      });
    document.getElementById('prod_id_change').value = ""
    document.getElementById('prod_price_change').value = ""
    return App.verifyOwner();  
    },

    /// @dev Execute the addStoreManager function of the deployed instance (App.contracts.Marketplace)       
    inputAddStoreMan: function () { 
        let manNameAdd = $('#man_name_add').val();
        let manAddressAdd = $('#man_address_add').val();
        
        App.contracts.Marketplace.deployed().then(function(instance) {
          return instance.addStoreManager(manNameAdd, manAddressAdd);
        }).then(function(res) {
          $('#lastUserAction').text("Requested adding new store manager. Success!"); 
          $('#report1').text("Manager ID: " + res.logs[0].args._newManagerID);
          $('#report2').text("Manager Name: " + res.logs[0].args._newManagerName);
          $('#report3').text("Authorised: " + res.logs[0].args._newManagerAuth);
          $('#report4').text("Manager Address: " + res.logs[0].args._newManagerAddress);
          $('#report5').text("");
          $('#report6').text("");  
        }).catch(function(err) {
        $('#lastUserAction').text("Requested adding new store manager. Unsuccessful..."); 
        
        if (err.message.includes("Access denied. This contract has been temporarily disabled.")) {
          $('#report1').text("Access denied. This contract has been temporarily disabled."); 
        } else if 
          (err.message.includes("Access denied. Access restricted to contract owner.")) {
          $('#report1').text("Access denied. Access restricted to contract owner.");                    
        } else {
          $('#report1').text(err.message); 
        }  
          $('#report2').text("");
          $('#report3').text("");
          $('#report4').text("");
          $('#report5').text("");
          $('#report6').text(""); 
        });
    document.getElementById('man_name_add').value = ""
    document.getElementById('man_address_add').value = ""
    return App.verifyOwner();
    },

    /// @dev Execute the removeStoreManager function of the deployed instance (App.contracts.Marketplace)       
    inputRemoveStoreMan: function () { 
        let manAddressRemove = $('#man_address_remove').val();
        
        App.contracts.Marketplace.deployed().then(function(instance) {
          return instance.removeStoreManager(manAddressRemove);
        }).then(function(res) {
          $('#lastUserAction').text("Requested removing existing store manager. Success!"); 
          $('#report1').text("Manager ID: " + res.logs[0].args._oldManagerID);
          $('#report2').text("Manager Name: " + res.logs[0].args._oldManagerName);
          $('#report3').text("Authorised: " + res.logs[0].args._oldManagerAuth);
          $('#report4').text("Manager Address: " + res.logs[0].args._oldManagerAddress);
          $('#report5').text("");
          $('#report6').text(""); 
        }).catch(function(err) {
        $('#lastUserAction').text("Requested removing existing store manager. Unsuccessful..."); 
        
        if (err.message.includes("Access denied. This contract has been temporarily disabled.")) {
          $('#report1').text("Access denied. This contract has been temporarily disabled."); 
        } else if 
          (err.message.includes("Access denied. Access restricted to contract owner.")) {
          $('#report1').text("Access denied. Access restricted to contract owner.");   
        } else if 
        (err.message.includes("Request declined. Store manager is not authorised.")) {
          $('#report1').text("Request declined. Store manager is not authorised.");                    
        } else {
          $('#report1').text(err.message); 
        }   
          $('#report2').text("");
          $('#report3').text("");
          $('#report4').text("");
          $('#report5').text("");
          $('#report6').text("");  
        });
    document.getElementById('man_address_remove').value = ""
    return App.verifyOwner();
    },

    /// @dev Call the readStoreFunds function of the deployed instance (App.contracts.Marketplace)     
    inputReadFunds: function () { 
        
      App.contracts.Marketplace.deployed().then(function(instance) {
        return instance.readStoreFunds.call();
      }).then(function(res) {
        $('#lastUserAction').text("Requested reading store funds. Success!"); 
        $('#report1').text("Total Store Funds: " + res + " Wei");
        $('#report2').text("");
        $('#report3').text("");
        $('#report4').text("");
        $('#report5').text("");
        $('#report6').text("");  
      }).catch(function(err) {
      $('#lastUserAction').text("Requested reading store funds. Unsuccessful..."); 
      
      if (err.message.includes("Access denied. Access restricted to contract owner.")) {
        $('#report1').text("Access denied. Access restricted to contract owner.");              
      } else {
        $('#report1').text(err.message); 
      }   
        $('#report2').text("");
        $('#report3').text("");
        $('#report4').text("");
        $('#report5').text("");
        $('#report6').text(""); 
        return App.verifyOwner();
      });
    },

    /// @dev Execute the withdrawStoreFunds function of the deployed instance (App.contracts.Marketplace)       
    inputWithdrawFunds: function () { 
        
      App.contracts.Marketplace.deployed().then(function(instance) {
        return instance.withdrawStoreFunds();
      }).then(function(res) {
        $('#lastUserAction').text("Requested withdrawing store funds. Success!"); 
        $('#report1').text("Total Store Funds Withdrawn: " + res.logs[0].args._amountWithdrawn);
        $('#report2').text("");
        $('#report3').text("");
        $('#report4').text("");
        $('#report5').text("");
        $('#report6').text("");  
      }).catch(function(err) {
      $('#lastUserAction').text("Requested withdrawing store funds. Unsuccessful..."); 
      
      if (err.message.includes("Access denied. Access restricted to contract owner.")) {
        $('#report1').text("Access denied. Access restricted to contract owner.");              
      } else {
        $('#report1').text(err.message); 
      }    
        $('#report2').text("");
        $('#report3').text("");
        $('#report4').text("");
        $('#report5').text("");
        $('#report6').text(""); 
        return App.verifyOwner();
      });
    },

    /// @dev Execute the emergencyStopFunction function of the deployed instance (App.contracts.Marketplace)       
    inputCircuitBreaker: function () { 
      let circuitBreak 
      
      if (localStorage.getItem("cbToggle") != "on") {
        circuitBreak = true
        localStorage.setItem("cbToggle", "on");
      } else {
        circuitBreak = false
        localStorage.setItem("cbToggle", "off");        
      }  

      App.contracts.Marketplace.deployed().then(function(instance) {
        return instance.emergencyStopFunction(circuitBreak);
      }).then(function(res) {
        $('#lastUserAction').text("Requested toggling circuit breaker. Success!"); 
        $('#report1').text("Circuit breaker enabled = " + circuitBreak);
        $('#report2').text("");
        $('#report3').text("");
        $('#report4').text("");
        $('#report5').text("");
        $('#report6').text("");  
      }).catch(function(err) {
      $('#lastUserAction').text("Requested toggling circuit breaker. Unsuccessful..."); 
      
      if (err.message.includes("Access denied. Access restricted to contract owner.")) {
        $('#report1').text("Access denied. Access restricted to contract owner.");              
      } else {
        $('#report1').text(err.message); 
      }    
        $('#report2').text("");
        $('#report3').text("");
        $('#report4').text("");
        $('#report5').text("");
        $('#report6').text(""); 
      });
    document.getElementById('circuit_breaker').value = ""
    return App.verifyOwner();
    },

};

/// @dev Detect if Metamask has switched accounts and refresh UI
ethereum.on('accountsChanged', function (accounts) {
  App.getAddresses();
});

/// @dev Detect if the page has finished loading and re-initialize.
$(function() {
    $(window).load(function() {
      App.initWeb3();    
    });
});


