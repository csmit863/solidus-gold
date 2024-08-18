// tokenUtils.js
import { ethers } from 'ethers';
import abi from '../abi';
import tokenabi from '../tokenabi';

export async function fetchTokenDetails(tokenAddresses, contractAddress, provider) {
    const tokenDetails = [];
    try {
        const contract = new ethers.Contract(contractAddress, abi, provider);
        for (const address of tokenAddresses) {
            const tokenContract = new ethers.Contract(address, tokenabi, provider);
            const name = await tokenContract.name();
            const symbol = await tokenContract.symbol();
            const detail = await contract.getTokenDetails(address);
            const supplyCap = Number(detail[0]); // assuming this is the supply cap
            const minRiskParameter = Number(detail[1])/10**18;
            const maxRiskParameter = Number(detail[2])/10**18;
            const decimals = Number(detail[4]); 
            const balance = Number(detail[3]);

            const a = ((minRiskParameter - maxRiskParameter)) / (supplyCap ** 2);
            const balanceY = a * (balance - supplyCap) ** 2 + maxRiskParameter;
            tokenDetails.push({
                address: address,
                name: name,
                symbol: symbol,
                supplyCap: supplyCap,
                minRiskParameter: minRiskParameter,
                maxRiskParameter: maxRiskParameter,
                decimals: decimals,
                balance: balance,
                currentCollateral: balanceY,
            });
        }
    } catch (error) {
        console.error("Error fetching token details:", error);
    }
    return tokenDetails;
}
