import React from 'react';
import { Chart } from 'react-google-charts';

export function TokenGraph({ data }) {
    // Destructure relevant data from the tokenDetails object
    const { address, name } = data;
    console.log('tokengraph data:', data)
    const dataPoints = [];
    const newChartDataCollection = {};
    const a = ((data.minRiskParameter - data.maxRiskParameter)) / (data.supplyCap ** 2);
    for (let x = 0; x <= data.supplyCap; x += data.supplyCap / 100) {
        const y = a * (x - data.supplyCap) ** 2 + data.maxRiskParameter;
        dataPoints.push([x/data.decimals, y, null]); // Add null for the third column
    }
    const balanceY = a * (data.balance - data.supplyCap) ** 2 + data.maxRiskParameter;
    dataPoints.push([data.balance/data.decimals, null, balanceY]);
    newChartDataCollection[address] = {
        data: [
            ['Balance', 'Collateral Requirement (%)', 'Current Collateral Requirement'],
            ...dataPoints,
            [data.balance/data.decimals, null, balanceY]
        ],
        name: name,
        address: address
    };

    return (
        <div style={{ flex: '1 0 31%', padding: '10px' }}>
            <Chart
                key={address}
                chartType="LineChart"
                data={newChartDataCollection[address].data} // Assuming the chart data is provided in the 'data' property of tokenDetails
                options={{
                    title: `Balance vs. Collateral Requirement for ${name} ${address}`, // Use the extracted name and address
                    hAxis: { title: 'Balance' },
                    vAxis: { title: 'Collateral Requirement (%)', minValue: 100, maxValue: 125 },
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
    );
}

