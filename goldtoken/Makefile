-include .env


clean :; forge clean

update :; forge update

build :; forge clean && forge build --optimize --optimizer-runs 1000000

deployTokens :; 
	@forge create SolidusGold --private-key ${PRIVATE_KEY} --rpc-url ${RPC_URL}
	@forge create DummyToken --constructor-args "TokenA" "A" "1000000000" "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" "6" --private-key ${PRIVATE_KEY} --rpc-url ${RPC_URL} 
	@forge create DummyToken --constructor-args "TokenB" "B" "1000000000000" "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" "9" --private-key ${PRIVATE_KEY} --rpc-url ${RPC_URL}
	@forge create DummyToken --constructor-args "Paxos Gold" "PAXG" "248689387" "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" "3" --private-key ${PRIVATE_KEY} --rpc-url ${RPC_URL}
	@forge create DummyToken --constructor-args "Golden Ratio" "GRAT" "161803398875000" "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" "3" --private-key ${PRIVATE_KEY} --rpc-url ${RPC_URL}
	@forge create DummyToken --constructor-args "Gram Gold" "GRMG" "1417474500" "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" "5" --private-key ${PRIVATE_KEY} --rpc-url ${RPC_URL}


abi :; solc --abi /src/SolidusGold -o build

approveTokens :;
	@cast send 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 "approve(address,uint256)" 0x5FbDB2315678afecb367f032d93F642f64180aa3 1000000000 --private-key ${PRIVATE_KEY} --rpc-url ${RPC_URL}
	@cast send 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 "approve(address,uint256)" 0x5FbDB2315678afecb367f032d93F642f64180aa3 1000000000000 --private-key ${PRIVATE_KEY} --rpc-url ${RPC_URL}
	@cast send 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9 "approve(address,uint256)" 0x5FbDB2315678afecb367f032d93F642f64180aa3 1000000000000 --private-key ${PRIVATE_KEY} --rpc-url ${RPC_URL}
	@cast send 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9 "approve(address,uint256)" 0x5FbDB2315678afecb367f032d93F642f64180aa3 161803398875000 --private-key ${PRIVATE_KEY} --rpc-url ${RPC_URL} 
	@cast send 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707 "approve(address,uint256)" 0x5FbDB2315678afecb367f032d93F642f64180aa3 141747450 --private-key ${PRIVATE_KEY} --rpc-url ${RPC_URL} 


addTokenAddresses :;
	@cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "addTokenAddress(address, uint256, uint256, uint256, uint256)" 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 10000000000 105000000000000000000 120000000000000000000 10000000 --private-key ${PRIVATE_KEY} --rpc-url ${RPC_URL}
	@cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "addTokenAddress(address, uint256, uint256, uint256, uint256)" 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 10000000000000 102000000000000000000 123000000000000000000 10000000000 --private-key ${PRIVATE_KEY} --rpc-url ${RPC_URL}
	@cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "addTokenAddress(address, uint256, uint256, uint256, uint256)" 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9 10000000 101200000000000000000 109300000000000000000 10000 --private-key ${PRIVATE_KEY} --rpc-url ${RPC_URL}
	@cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "addTokenAddress(address, uint256, uint256, uint256, uint256)" 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9 1618033988750000 102000000000000000000 123000000000000000000 161803398875 --private-key ${PRIVATE_KEY} --rpc-url ${RPC_URL}
	@cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "addTokenAddress(address, uint256, uint256, uint256, uint256)" 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707 141747450 100050000000000000000 125000000000000000000 2834949 --private-key ${PRIVATE_KEY} --rpc-url ${RPC_URL} 
#should be 50 tokens


depositTokens :;
#tokenA
	@cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "deposit(address,uint256)" 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 250000000 --private-key ${PRIVATE_KEY} --rpc-url ${RPC_URL}
#tokenB
	@cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "deposit(address,uint256)" 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 300000000000 --private-key ${PRIVATE_KEY} --rpc-url ${RPC_URL}
#paxosG
	@cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "deposit(address,uint256)" 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9 80000 --private-key ${PRIVATE_KEY} --rpc-url ${RPC_URL}
#GoldenRatio
	@cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "deposit(address,uint256)" 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9 161803398875 --private-key ${PRIVATE_KEY} --rpc-url ${RPC_URL} # should deposit 1 token
#GramGold
	@cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "deposit(address,uint256)" 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707 2834949 --private-key ${PRIVATE_KEY} --rpc-url ${RPC_URL} # should deposit 1 token

#individual depositing
depositTokenA :; cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "deposit(address,uint256)" 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 250000000 --private-key ${PRIVATE_KEY} --rpc-url ${RPC_URL}
depositTokenB :; cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "deposit(address,uint256)" 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 300000000000 --private-key ${PRIVATE_KEY} --rpc-url ${RPC_URL}
depositPaxos :; cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "deposit(address,uint256)" 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9 80000 --private-key ${PRIVATE_KEY} --rpc-url ${RPC_URL}
depositGR :; cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "deposit(address,uint256)" 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9 161803398875 --private-key ${PRIVATE_KEY} --rpc-url ${RPC_URL} # should deposit 1 token
depositGram :; cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "deposit(address,uint256)" 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707 2834949 --private-key ${PRIVATE_KEY} --rpc-url ${RPC_URL} # should deposit 1 token

redeemPaxos :; cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "redeem(address, uint256)" 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9 70000000000000000000 --private-key ${PRIVATE_KEY} --rpc-url ${RPC_URL}

sgAddPaxos :; cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "addTokenAddress(address, uint256, uint256, uint256, uint256)" 0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82 100000000 101200000000000000000 107900000000000000000 1000 --private-key ${PRIVATE_KEY} --rpc-url ${RPC_URL}


# Summary of the GR stuff:
# GR is a token which has a supply of 1000oz, or 161803398875000 to be precise. It has 3 decimal places.
# 1 oz of GR is equal to 161803398875. The Solidus Gold DAPP has registered GR token and has issued it a 
# supply cap of 10,000, meaning that when all available tokens have been deposited, the balance should be
# 10% of the supply cap. 

# Lets do another example: a gold token Y where 1 token = 1 gram, with 5 decimal places. So 100000Y = 1g.
# 1g = 0.035274oz. 100000Y = 0.035274oz. Lets put the supply of Y at 1kg, 100,000,000.
# 1oz of Y = 28.349492544g, or 2834949.2544Y which would be rounded to 2834949 in solidity.
# Example: a user wants to deposit 100Y (100g) and mint SG tokens. 
# 10000000 / 2834949 --> 3.527400317 SG - fees


#NOTE: TROY OUNCE IS DIFFERENT TO OUNCES