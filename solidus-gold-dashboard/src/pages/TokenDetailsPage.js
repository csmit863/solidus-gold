import React, { useEffect, useState } from 'react';
import { fetchTokenDetails } from '../utils/FetchTokenDetails';
import { contractAddress, provider } from '../App';
import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { TokenGraph } from '../components/TokenGraphs';
/*
tokens page:
------------------------------------
[DAO STATS]
[LOGO] [NAVIGATION BAR OPTIONS]
------------------------------------
things i want:

latest/most popular proposals relevant to the token
quadratic graph of collateral requirement
exchange rate of relevant token compared to Solidus Gold, USD/DAI


better fetchData function

fetchDetails('0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0')
returns:
    proposals
    token name



*/

export function TokenDetailsPage(){
    const [tokenDetails, setTokenDetails] = useState(null);
    const { tokenAddress } = useParams(); 

    useEffect(() => {
        // Token address you want to fetch details for

        async function fetchData() {
            const details = await fetchTokenDetails([tokenAddress], contractAddress, provider);
            setTokenDetails(details[0]); // Assuming only one token detail is returned
        }

        fetchData();
    }, [tokenAddress]);


    return (
        <div>
            {tokenDetails ? (
                <div>
                    <div>
                        <h1>{tokenDetails.name}</h1>
                        <Typography>Address: {tokenDetails.address}</Typography>
                        <Typography>Symbol: {tokenDetails.symbol}</Typography>
                        <Typography>Supply Cap: {tokenDetails.supplyCap}</Typography>
                        <Typography>Min Risk Parameter: {tokenDetails.minRiskParameter}</Typography>
                        <Typography>Max Risk Parameter: {tokenDetails.maxRiskParameter}</Typography>
                        <Typography>Decimals: {tokenDetails.decimals}</Typography>
                        <Typography>Balance: {tokenDetails.balance} {tokenDetails.symbol}, aka {tokenDetails.balance/tokenDetails.decimals}oz</Typography>
                        <Typography>Current Collateral: {tokenDetails.currentCollateral}</Typography>
                    </div>
                    {tokenDetails && <TokenGraph data={tokenDetails} />}
                    <div>
                        <Typography>Options</Typography>
                        <Typography>Deposit {tokenDetails.name}</Typography>
                        <Typography>Redeem Solidus for {tokenDetails.name}</Typography>

                    </div>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}