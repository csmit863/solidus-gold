# Solidus Gold

## A gold token backed by a diversified pool of other gold tokens to reduce institutional risk. 

### In 1933, the United States enacted the Gold Reserve Act and it became illegal to own gold.
### As we develop stablecoins, it is simply unacceptable to allow this sort of risk to threaten
### decentralised finance protocols. 

#### If gold tokens were more widely used, and were based in the US, all DeFi protocols using gold
#### tokens for e.g. reserves, would have to account for this risk and would not receive the underlying
#### benefit of gold as a timeless store of value. 

#### Gold stablecoins are also subject to other sorts of risk. For example, a war or natural disaster
#### could affect the operations of a stablecoin provider as their reserves would become at risk.
#### If a depegging event occurred, any protocol or individual using the gold token as a store of value
#### would suffer if they could not switch their tokens swiftly.

#### This project aims to reduce this risk by pooling together as many gold tokens as possible, 
#### actively manage any real-world risk through DAO governance and algorithmic processes, and finally
#### produce a derivative gold token which can simply be held indefinitely by users, with a drastically
#### reduced risk of devaluation. 

#### The benefits of this system is that it diffuses the reliance upon centralized institutions for token
#### value, maintains the original benefits of physical gold, and removes the drawbacks of gold-backed tokens.


### The project is a single smart contract which records an array of 'approved tokens' which can be deposited
### and redeemed. The protocol is overcollateralised to prevent depegging events from occurring.

### A minimum and maximum collateral requirement for each token can be set which determines the amount of 
### collateral required to mint new Solidus Gold tokens.
### The amount of collateral required to mint new Solidus Gold tokens is calculated by the following function:
### 

# A quadratic equation is defined which describes how the collateral requirement scales based on the balance of
# the pool. 
## balance = balance of the token in the pool
## supplyCap = the maximum amount of tokens which can be deposited into this pool
## maxRiskParameter = the maximum collateral requirement
## minRiskParameter = the minimum collateral requirement
        f(x) = a(balance - supplyCap)^2 + maxRiskParameter
        where a = (minRiskParameter - maxRiskParameter) / supplyCap^2
        

# In order to calculate how much collateral is required, the area underneath the quadratic equation from the 
# initial balance and the finishing balance must be calculated. 
## a = balance after deposit
## b = balance before deposit
        riskParameter = a * (balance - supplyCap)**2 + maxRiskParameter;
        F(x) = 1/3a(x-supplyCap)^3 + maxRP * x
              int[a,b] = a/3*(x-supplyCap)^3 + maxRP*x*PRECISION
# Once F(x) is calculated, this number is then divided by the deposit amount to get the collateral % required 
# for a deposit.