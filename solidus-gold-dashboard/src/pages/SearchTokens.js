import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractAddress, tokenDetailsURL } from '../App';
import { provider } from '../App';
import abi from '../abi'
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

/*
search page:
------------------------------------
[DAO STATS]
[LOGO] [NAVIGATION BAR OPTIONS]
------------------------------------
[search by address or token name]
[options]
GRID:
|TokenName|TokenAddress|CollateralRequirement%|Balance|Capacity|
|PAXOSG   |0x9efabcd...|    105.223%          |25.000 |  2.5%  |
^^
row is link to /tokens/{0x9efabcd...}/




*/


export function SearchTokensPage(){
    const [tokenData, setTokenData] = useState([]);
    const [tokenAddresses, setTokenAddress] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    let filteredData = tokenData.filter(row => 
        row.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.tokenTracker.toLowerCase().includes(searchTerm.toLowerCase())
    );

    function handleSubmit(event) {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
    };

    useEffect(() => {
        async function fetchTokenAddresses() {
            const contract = new ethers.Contract(contractAddress, abi, provider);
            const addresses = await contract.getAddedTokens();
            setTokenAddress(addresses);
        }
        fetchTokenAddresses();
    }, []);

    useEffect(() => {
        async function fetchTokenDetails() {
            try {
                const contract = new ethers.Contract(contractAddress, abi, provider);
                const detailsPromises = tokenAddresses.map(async address => {
                    const tokenContract = new ethers.Contract(address, abi, provider);
                    const [name, symbol, detail] = await Promise.all([
                        tokenContract.name(),
                        tokenContract.symbol(),
                        contract.getTokenDetails(address)
                    ]);
                    const decimals = Number(detail[4]);
                    const supplyCap = Number(detail[0]);
                    const minRiskParameter = Number(detail[1])/10**18;
                    const maxRiskParameter = Number(detail[2])/10**18;
                    const balance = Number(detail[3]);
                    const readableBalanace = balance/decimals;
                    const a = ((minRiskParameter - maxRiskParameter)) / (supplyCap ** 2);
                    const balanceY = a * (balance - supplyCap) ** 2 + maxRiskParameter;
                    console.log(decimals, supplyCap, minRiskParameter, maxRiskParameter, balance, balanceY)
                    return {
                        tokenTracker: `${name} (${symbol})`,
                        address: address,
                        collateralRequirement: balanceY.toFixed(3),
                        balance: readableBalanace.toFixed(3),
                        percentFromSupplyCap: ((balance / supplyCap) * 100).toFixed(3)
                    };
                });
                const details = await Promise.all(detailsPromises);
                setTokenData(details);
                console.log(details)
            } catch (error) {
                console.error("Error fetching token details:", error);
                setTokenData([]); // Set empty array in case of error
            }
        }

        if (tokenAddresses.length > 0) {
            fetchTokenDetails();
            const onNewBlock = () => {
                fetchTokenDetails();
            };
            provider.on("block", onNewBlock);
        }
    }, [tokenAddresses]); // Include tokenAddresses in the dependency array

    const columnDefs = [
        { headerName: "Token Tracker", field: "tokenTracker" },
        { headerName: "Address", field: "address" },
        { headerName: "Collateral Requirement %", field: "collateralRequirement" },
        { headerName: "Balance", field: "balance" },
        { headerName: "Capacity %", field: "percentFromSupplyCap" },
    ];
    
    return (
        <div>
            <Typography>Search for tokens</Typography>
            <form>
                <input type="text" id="search-input" placeholder='Search' onChange={handleSubmit} />
            </form>
            <div className='ag-theme-alpine' style={{ height: '300px', width: '100%' }}>
                <AgGridReact
                    columnDefs={columnDefs}
                    rowData={filteredData}
                    onRowClicked={(event) => {
                        const tokenAddress = event.data.address;
                        navigate(tokenDetailsURL.replace(":tokenAddress", tokenAddress));
                    }}
                /> 
            </div>
        </div>
    );
}
