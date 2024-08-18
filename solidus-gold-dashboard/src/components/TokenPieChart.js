import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import abi from '../abi'
import tokenabi from '../tokenabi'
import { ethers } from 'ethers';
import { Card, Typography, Box } from '@mui/material';
//const provider = new ethers.providers.JsonRpcProvider(localhostURL);
import { contractAddress } from '../App';
import { provider } from '../App';

function TokenPieChart() {
    const [tokenData, setTokenData] = useState([]);
    const [tokenAddresses, setTokenAddress] = useState([]);
    const [circulatingSupply, setCirculatingSupply] = useState([]);
    const [tokenMetadata, setTokenMetadata] = useState([]);
    const [chartDataCollection, setChartDataCollection] = useState({});


    useEffect(() => {
        async function fetchTokenAddresses() {
            const contract = new ethers.Contract(contractAddress, abi, provider);
            const addresses = await contract.getAddedTokens();
            setTokenAddress(addresses);
        }
        fetchTokenAddresses();
    }, []);

    useEffect(() => {
        if (tokenAddresses.length === 0) return;
        

        async function fetchTokenDetails() {
            const newChartDataCollection = {};
            try {
                const contract = new ethers.Contract(contractAddress, abi, provider);
                let totalSupply = await contract.totalSupply();
                totalSupply = Number(totalSupply);
                let sgdecimal = await contract.decimals();
                sgdecimal = Number(sgdecimal);
                totalSupply = totalSupply / 10**sgdecimal
                setCirculatingSupply(totalSupply);

                

                const detailsPromises = tokenAddresses.map(async address => {

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
                    const dataPoints = [];
                    for (let x = 0; x <= supplyCap; x += supplyCap / 100) {
                        const y = a * (x - supplyCap) ** 2 + maxRiskParameter;
                        dataPoints.push([x/decimals, y, null]); // Add null for the third column
                    }
                    const balanceY = a * (balance - supplyCap) ** 2 + maxRiskParameter;
                    dataPoints.push([balance/decimals, null, balanceY]);
                    newChartDataCollection[address] = {
                        data: [
                            ['Balance', 'Collateral Requirement (%)', 'Current Collateral Requirement'],
                            ...dataPoints,
                            [balance/decimals, null, balanceY]
                        ],
                        name: name,
                        address: address
                    };
                    
                    const adjustedBalance = Number(balance) / (decimals);
                    return {
                        label: `${name} (${symbol})\n${address}`,
                        balance: adjustedBalance,
                        name: name,
                        address: address
                    };
                });
                const details = await Promise.all(detailsPromises);
                setChartDataCollection(newChartDataCollection);
                setTokenData(details.map(d => [d.label, d.balance]));
                setTokenMetadata(details);
            } catch (error) {
                console.error("Error fetching token details:", error);
            }
        }

        fetchTokenDetails();
        const onNewBlock = () => {
            fetchTokenDetails();
        };
        provider.on("block", onNewBlock);
    }, [tokenAddresses]);

   
    
    const goldColors = ['#FFA500', '#a16e00',  '#ffbd2e'];

    const googdata = [
        ["Token Address", "Balance"],
        ...tokenData
    ];
    
    const googoptions = {
        title: "Pool Balance (Oz's)",
        pieSliceText: 'value',
        colors: goldColors,
        slices: {
            0: {offset: 0.05},
            1: {offset: 0.05},
            2: {offset: 0.05}
        }
    };

    return (
        <div>
        <Card style={{ padding: 0, marginBottom: 20, display: 'flex', flexDirection: 'row' }}>
        <Box flex={1}>
            <Chart
                chartType='PieChart'
                width="100%"
                height="450px"
                data={googdata}
                options={googoptions}
            />
        </Box>
        <Box flex={1} style={{ padding: '20px' }}>
            {tokenMetadata.map(token => (
                <div key={token.label}>
                    <Typography>{token.label}</Typography> <br />
                    <Typography>Balance: {token.balance} </Typography> <br />
                    <hr />
                </div>
            ))}
            <Typography variant="h6">Circulating supply (SG): {circulatingSupply} oz's</Typography>
        </Box>
    </Card>
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
    {Object.keys(chartDataCollection).map(address => (
        <div style={{ flex: '1 0 31%', padding: '10px' }}>
        <Chart
            key={address}
            chartType="LineChart"
            data={chartDataCollection[address].data}
            options={{
                
                title: `Balance vs. Collateral Requirement for ${chartDataCollection[address].name} ${chartDataCollection[address].address}`,
                hAxis: { title: 'Balance' },
                vAxis: { title: 'Collateral Requirement', minValue: 100 , maxValue: 125},
                curveType: 'function',
                legend: 'none',
                series: {
                    0: { color: 'blue' }, // The curve
                    1: { pointSize: 15, pointsVisible: true, color: 'red' } // The balance point
                }
            }}
            width="100%"
            height="400px"
        />
        </div>
    ))}
    </div>
    </div>
);


}

export default TokenPieChart;
