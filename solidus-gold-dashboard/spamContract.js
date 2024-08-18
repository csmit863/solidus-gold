const { ethers } = require('ethers');
const spamabi = require('./src/spamabi.js');
const contractAddress = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'; 

const provider = new ethers.JsonRpcProvider(); 
const wallet = new ethers.Wallet('ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider); 
const contract = new ethers.Contract(contractAddress, spamabi, wallet);

/*
addTokenAddress(address, uint256, uint256, uint256, uint256)
removeTokenAddress(address)
increaseTokenSupplyCap(address, uint256)
reduceTokenSupplyCap(address, uint256)
alterMinRiskParameter(address, uint256)
alterMaxRiskParameter(address, uint256)
deposit(address, uint256)
redeem(address, uint256)
*/

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

async function spamContract() {
    const functions = [
        'addTokenAddress',
        'increaseTokenSupplyCap',
        'reduceTokenSupplyCap',
        'alterMinRiskParameter',
        'alterMaxRiskParameter',
        'deposit',
        'redeem'
    ];

    const addressesList = [
        '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
        '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
    ]

    for (let i = 0; i < 10000; i++) { // Adjust the number as needed
        const randomFunction = functions[getRandomInt(functions.length)];
        try {
            switch (randomFunction) {
                case 'addTokenAddress':
                    await contract.addTokenAddress(
                        addressesList[getRandomInt(addressesList.length)],
                        getRandomInt(1000000000000),
                        getRandomInt(1000000000000),
                        getRandomInt(1000000000000),
                        getRandomInt(1000000000000)
                    );
                    break;
                case 'increaseTokenSupplyCap':
                    await contract.increaseTokenSupplyCap(
                        addressesList[getRandomInt(addressesList.length)],
                        getRandomInt(1000000000000)
                    );
                    break;
                case 'reduceTokenSupplyCap':
                    await contract.reduceTokenSupplyCap(
                        addressesList[getRandomInt(addressesList.length)],
                        getRandomInt(1000000000000)
                    );
                    break;
                case 'alterMinRiskParameter':
                    await contract.alterMinRiskParameter(
                        addressesList[getRandomInt(addressesList.length)],
                        getRandomInt(1000000000000)
                    );
                    break;
                case 'alterMaxRiskParameter':
                    await contract.alterMaxRiskParameter(
                        addressesList[getRandomInt(addressesList.length)],
                        getRandomInt(1000000000000)
                    );
                    break;
                case 'deposit':
                    await contract.deposit(
                        addressesList[getRandomInt(addressesList.length)],
                        getRandomInt(1000000000000)
                    );
                    break;
                case 'redeem':
                    await contract.redeem(
                        addressesList[getRandomInt(addressesList.length)],
                        getRandomInt(1000000000000)
                    );
                    break;
                default:
                    console.log(`Unknown function: ${randomFunction}`);
            }            
            console.log(`Transaction ${i} with function ${randomFunction} successful`);
        } catch (error) {
            console.error(`Transaction ${i} with function ${randomFunction} failed:`, error);
        }
    }
}

spamContract();
