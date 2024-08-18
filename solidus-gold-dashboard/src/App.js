import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { DashboardPage } from './pages/DashboardPage';
import { SearchTokensPage } from './pages/SearchTokens';
import Layout from './components/Layout';
import { ethers } from 'ethers';
import { TokenDetailsPage } from './pages/TokenDetailsPage';
export const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
export const provider = new ethers.JsonRpcProvider();

/*
SOLIDUS GOLD WEB INTERFACE

routes:
  /search
  /home
  /tokens/{tokenAddress}/
  /tokens/{tokenAddress}/proposals
  /tokens/{tokenAddress}/proposals/{proposal}
  /community
  etc


*/
export const dashboardURL = '/dashboard';
export const searchTokensURL = '/search';
export const tokenDetailsURL = '/tokens/:tokenAddress';

function App() {

  return (
    <Router>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <div className='App' >
        <Layout>
          <Routes> 
            <Route path="/" exact />
            {<Route path={dashboardURL} element={<DashboardPage/>} exact />}
            {<Route path={searchTokensURL} element={<SearchTokensPage/>} exact />}
            {<Route path={tokenDetailsURL} element={<TokenDetailsPage/>} exact />}
            
          </Routes>
        </Layout>
      </div>
    </Router>
   
  );
}

export default App;
