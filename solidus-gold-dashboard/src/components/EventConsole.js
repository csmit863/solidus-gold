import { ethers } from "ethers";
import React, { useEffect, useState } from 'react';
import abi from "../abi";

const contractAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
const provider = new ethers.JsonRpcProvider();

function replacer(key, value) {
    if (typeof value === 'bigint') {
        return value.toString() + 'n'; // or simply return value.toString();
    }
    return value;
}

function EventConsole() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const contract = new ethers.Contract(contractAddress, abi, provider);

        const handleEvent = (event) => {
            const currentTime = new Date().toISOString(); // Get current time in ISO format
            const eventWithTimestamp = {
                ...event,
                timestamp: currentTime
            };
            setEvents(prevEvents => [eventWithTimestamp, ...prevEvents]);
        };
        
        contract.on("*", handleEvent);

        return () => {
            contract.off("*", handleEvent);
        };
    }, []);

    return (
        <div style={{ 
            overflowY: 'auto', 
            minHeight:'100%', 
            border: '1px solid black', 
            padding: '10px', 
            color:'lightgreen', 
            backgroundColor:'black', 
            wordWrap: 'break-word', 
            whiteSpace: 'pre-wrap' 
        }}>
            Events Console<br/>
            {'<'}=={'>'} -   -   -   -   -   -   -   -   -   -   -   -   -   - {'<'}=={'>'}
            {events.map((event, index) => (
                <div key={index}>
                    {event.timestamp} - {event.event}{JSON.stringify(event.args, replacer)}
                    <hr />
                </div>
            ))}
        </div>
    );
}

export default EventConsole;
