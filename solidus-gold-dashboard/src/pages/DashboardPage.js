import React, { useState } from 'react';
import TokenPieChart from "../components/TokenPieChart";
import { Tabs, Tab, Box, TextField } from "@mui/material";
import { ethers } from 'ethers';
import EventConsole from '../components/EventConsole';
const provider = new ethers.JsonRpcProvider(); // or any other provider you're using




export function DashboardPage() {
    const [selectedTab, setSelectedTab] = useState(0);
    provider.on("block", (blockNumber) => {
        console.log(`New block number: ${blockNumber}`);
        // Fetch any additional data you need for this block
    });

    const handleChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ flex: 2 }}>
            <TokenPieChart />

            <Box sx={{ width: '100%', bgcolor: 'lightblue', padding: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={selectedTab} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Deposit" />
                        <Tab label="Redeem" />
                        <Tab label="Get Token Details" />
                    </Tabs>
                </Box>
                <TabPanel value={selectedTab} index={0}>
                    <TextField label='Deposit to Address'></TextField><br/>
                    <TextField label='Amount to Deposit'></TextField>
                </TabPanel>
                <TabPanel value={selectedTab} index={1}>
                    <TextField label='Address of Token to Redeem'></TextField><br/>
                    <TextField label='Amount to Redeem'></TextField>
                </TabPanel>
                <TabPanel value={selectedTab} index={2}>
                    <TextField label='Address of Token'></TextField><br/>
                </TabPanel>
            </Box>
        </div>
        {/*
        <div style={{ flex: 1, margin:10, outline:'5px solid gold', overflowY: 'auto' }}>
        <EventConsole />
        </div>*/}
        </div>
    );
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}
