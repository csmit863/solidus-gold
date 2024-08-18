import React from 'react';
import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { contractAddress, dashboardURL, searchTokensURL } from '../App';
import planet from '../assets/planet.png';

function Navbar() {
    const navigate = useNavigate();

    const navbaritems = {
        [dashboardURL]: 'Dashboard Page',
        [searchTokensURL]: 'Search Page',
        // other items here
    };

    return (
        <div style={{
            position: "sticky",
            top: 0,
            zIndex: 30,
            backgroundImage: `url(${planet})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '10px', // Add padding for spacing
            display: 'flex',
            justifyContent: 'space-between', // Align items on opposite ends
        }}>
            {/* Container for mapped buttons */}
            <div>
                {Object.entries(navbaritems).map(([url, displayText]) => (
                    <Button key={url} variant='contained' onClick={() => navigate(url)}>{displayText}</Button>
                ))}
            </div>
            <Typography color={'white'}>Contract Address: {contractAddress}</Typography>
            {/* "Connect Wallet" button */}
            <Button variant='outlined'>Connect Wallet</Button>
        </div>
    );
}

export default Navbar;
