import { useState, useEffect } from 'react';
import abi from "./contractJson/myapp.json";
import { ethers } from "ethers";
import Tips from "./components/Tips";
import Pay from "./components/Pay";
import './App.css';
import landscape from "./photo.png";

function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null
  });

  const [account, setAccount] = useState('Not connected');
  const [receiver, setReceiver] = useState('');

  useEffect(() => {
    const template = async () => {
      const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; //myapp.sol
      const contractABI = abi.abi;

      try {
        const { ethereum } = window;
        if (ethereum) {
          const accounts = await ethereum.request({
            method: "eth_requestAccounts"
          })

          window.ethereum.on("accountsChanged", () => {
            window.location.reload();
          })
          setAccount(accounts[0]);
          const provider = new ethers.BrowserProvider(window.ethereum);
          //const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          )
          console.log(contract)
          setState({ provider, signer, contract });

          // Get owner's address
          const owner = await contract.owner();
          console.log("Owner Address:", owner); // Debug line to check owner address
          setReceiver(owner);
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log(error)
      }
    }
    template();
  }, [])

  return (
    <div >
      <img src={landscape} className="img-fluid" alt=".." width="100%" height="200px" />
      <p style={{ marginTop: "10px", marginLeft: "5px" }}>
        <small>Connected Account - {account}</small>
      </p>
      
      <Pay state={state} />
      <Tips state={state} />

    </div>
  )
}
export default App;
