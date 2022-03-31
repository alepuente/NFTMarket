import { useEffect, useState } from "react"
import NFTMarket from "./contracts/NFTMarket.json";
import NFT from "./contracts/NFT.json";
import getWeb3 from "./getWeb3";
import { ENDPOINT } from "./constants";

const NetworkInfoState = () => {//Global variables
  const [state, setState] = useState({
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    items: [],
    isLoading: true
  })
  const actions = (action) => {
    const { type, payload } = action;
    switch (type) {
      case 'setState':
        return setState(payload);
      case 'updateItems':
        return fetchItems();
      default:
        return ''
    }
  }
  const fetchItems = () => {
    fetch(ENDPOINT.getItems)
      .then(res => res.json())
      .then(
        (result) => {
          if (state.items.length != result.length) {
            actions({
              type: 'setState',
              payload: {
                ...state,
                items: result
              }
            })
          }
        }
      )
  }
  const connectToNetwork = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts()
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = NFTMarket.networks[networkId];
      const instance = new web3.eth.Contract(
        NFTMarket.abi,
        deployedNetwork && deployedNetwork.address,
      );
      const nftInstance = new web3.eth.Contract(
        NFT.abi,
        deployedNetwork && deployedNetwork.address,
      );
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      actions({
        type: 'setState',
        payload: {
          ...state,
          web3: web3,
          accounts: accounts,
          contract: instance,
          nftContract: nftInstance
        }
      })
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (state.web3) {
        fetchItems()
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [state.items]);

  useEffect(() => {
    if (state.web3) {
      fetchItems()
    } else {
      connectToNetwork()
    }
  }, [state.web3])
  return { state, actions }
}
export default NetworkInfoState;