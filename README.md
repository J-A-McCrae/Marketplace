# Marketplace DApp 


## Introduction

This DApp has been developed as my final project for the Consensys Blockchain Bootcamp (Summer 2019).

## Project Files

This repository includes the following files;

> build/contracts/EmergencyStop.json  
> build/contracts/Marketplace.json  
> build/contracts/Migrations.json  
> 
> LibraryDemo.sol  
> contracts/EmergencyStop.sol  
> contracts/Marketplace.sol  
> contracts/Migrations.sol  
> 
> migrations/1_initial_migration.js  
> migrations/2_deploy_contracts.js  
> 
> node_modules/..  
> 
> src/favicon.ico  
> src/index.html  
> src/index-customer.html  
> src/index-manager.html  
> src/styles.css  
> src/js/index.js  
> src/js/truffle-contract.js  
> src/js/web3.min.js  
> 
> test/exceptionsHelpers.js  
> test/MarketplaceProxy.sol  
> test/TestMarketplace.sol  
> 
> bs-config.json  
> package.json  
> package-lock.json  
> truffle-congif.js  
> avoiding_common_attacks.md  
> deployed_address.md  
> design_pattern_decisions.md  
> README.md  

## What This DApp Does

This DApp is a simple online marketplace where anyone can view products in the store and purchase them for the listed price.

The contract owner is the store owner and has the ability to authorise specific addresses as store managers.
Only store managers have the ability to add, remove and change the price of store products.

The following functions are available to be called/executed in the smart contract

* **readProductID** - This allows the user to read information about products that have been added to the store
* **buyProductID** - This allows the user to register one unit of the selected product to their address
* **addStoreProduct** - This allows the user to add a product to the store and register it for sale
* **removeStoreProduct** - This allows the user to remove an existing product from the store and de-register it for sale
* **changeStoreProductPrice** - This allows the user to change the price of an exsiting product in the store
* **addStoreManager** - This allows the user to register a new address as an authorised store manager
* **removeStoreManger** - This allows the user register an existing address as an unauthorised store manager
* **readStoreFunds** - This allows the user to read how much fund the store holds from all sales
* **withdrawStoreFunds** - This allows the user to withdraw all of the store funds
* **emergencyStopFunction** - This allows the user to disable the functions of the contract

## Hypothetical User Story 

Alice wishes to create an online global store where her friends are free to list their products. She launches the Marketplace DApp and adds the addresses of her friends as authorised store managers. Alice's new store managers proceed to add products to the store and start generating sales. Customers from all over the world access the store and purchase products via their Metamask accounts. After further development, Alice notices a potential security exploit in the original deployment. She activates the circuit breaker to disable all contract functions and safely withdraws all the store funds.

## How to Setup for Evaluation
Please refer to the file deployed_addresses.md for details of how to interact with this DApp

## Author Contact Details

Please feel free to contact me on Slack or via e-mail below

<john.a.mccrae@gmail.com>
