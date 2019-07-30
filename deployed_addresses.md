# Deployed Addresses

## DApp Deployment Details

This DApp has been deployed to the Rinkeby testnet at address [0x3f76A7f9830609F6EB56add68A3a5E3d0280D853](https://rinkeby.etherscan.io/address/0x3f76a7f9830609f6eb56add68a3a5e3d0280d853#code).

The deployment was carried out, via Infura, with the following truffle-config.js settings;

	const infuraURL = 'https://rinkeby.infura.io/v3/<Infura Project ID>'
 
	const HDWalletProvider = require('truffle-hdwallet-provider');
	const infuraKey = "<Infura Project ID>";

	const fs = require('fs');
	const mnemonic = fs.readFileSync(".secret").toString().trim();

	module.exports = {
 		networks: {
    			development: {
      				host: 'localhost',
      				port: 8545,
      				network_id: "*",
    			},

    			rinkeby: {
    				provider: () => new HDWalletProvider(mnemonic, infuraURL),
    				network_id: 4,
    				gas: 5500000,
    			},
		},
	}

The deployment output the following details in the terminal;

>Starting migrations...
> 
>Network name:    'rinkeby'
>Network id:      4
>Block gas limit: 0x6af68e
> 
>1_initial_migration.js
> 
>   Deploying 'Migrations'
> 
>   transaction hash:    0x89ce861bc8609e191e7df2078a1a43adf5c8b4d39a8d0dca906699f63b151ad4
>   Blocks: 0            Seconds: 9
>   contract address:    0x92755f1100024a02bEd0a23001Aa7Baa3e04ab98
>   block number:        4815277
>   block timestamp:     1564359078
>   account:             0x72870ce786c2354EFEA2e71C3D24A9362DB72454
>   balance:             2.99391114
>   gas used:            261393
>   gas price:           20 gwei
>   value sent:          0 ETH
>   total cost:          0.00522786 ETH
> 
> 
>   Saving migration to chain.
>   Saving artifacts
> 
>   Total cost:          0.00522786 ETH
> 
> 
>2_deploy_contracts.js
> 
>   Deploying 'Marketplace'
> 
>   transaction hash:    0x2cf874be52ee5ef412bd8c0483c7d7dae608246a5194211222525634060ad3e1
>   Blocks: 0            Seconds: 9
>   contract address:    0x3f76A7f9830609F6EB56add68A3a5E3d0280D853
>  block number:        4815279
>   block timestamp:     1564359108
>   account:             0x72870ce786c2354EFEA2e71C3D24A9362DB72454
>   balance:             2.91773728
>   gas used:            3766670
>   gas price:           20 gwei
>   value sent:          0 ETH
>   total cost:          0.0753334 ETH
> 
> 
>   Saving migration to chain.
>   Saving artifacts
> 
>   Total cost:           0.0753334 ETH
> 
> 
>Summary
> 
>Total deployments:   2
>Final cost:          0.08056126 ETH

## Interacting with the DApp

This DApp has been developed with truffle, running on Ubunutu inside Virtualbox, using the following software versions;

* VirtualBox Version: v6.0.8 r130520 (Qt5.6.2)
* Ubunutu Version: v18.04.2 LTS (bionic)
* Truffle Version: v5.0.26 (core: 5.0.26)
* Solidity Version: v0.5.0 (solc-js)
* Node Version: v8.10.0
* Web.js Version: v1.0.0-beta.37
* Ganache Core Version: v2.5.6
* Ganache CLI Version v6.4.4
* Ganache GUI Version v2.0.1
* Chrome Version: v75.0.3770.100 (64 bit)
* Metamask Version: v6.7.3

The following steps describe the process of launching the DApp interface.

1. **Clone project repository** 
- Clone the respository at https://github.com/J-A-McCrae/Marketplace.

2. **Start a development blockchain (or skip this step for the Rinkeby Dapp)**
- Open the first Ubunutu terminal
- Run 'ganache-cli'
- Copy the mnemonic displayed in the ganache-cli temrinal window

3. **Connect to Metamask**
- Open the browser window
- Connect Metamask to http://127.0.0.1:8545 (or Rinkeby testnet)
- Select Metakmask 'Import using account phrase' (or use your own Metamask account for the Rinkeby DApp)
- Paste the ganache-cli mnemonic into Metamask ( "" "" )
- Create new password for Metamask account ( "" "" )

4. **Start a local lite-server** 
- Open the second Unbuntu terminal
- Change directory to project directory
- Run 'truffle compile'
- Run 'truffle migrate'
- Run 'npm run dev'

5. **Interact with the DApp!**
- Interact with the DApp in the browser window at localhost:3000/index.html

NB. It is also possible to interact with the deployed contracts via the Etherscan DApp page at https://rinkeby.etherscan.io/dapp/0x3f76a7f9830609f6eb56add68a3a5e3d0280d853#writeContract.














