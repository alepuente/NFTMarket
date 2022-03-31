import React, { useContext, useEffect } from "react";
import GalleryList from "./GalleryList";
import Context from "../scripts/context";

const GalleryHome = React.memo(props => {
  const { state, actions } = useContext(Context);
  const loadContract = async () => {
    console.log(state.items)
    const { contract } = state;
    const auxGalleryItems = []
    const auxAuctionsItems = []
    const auxItems = []
    contract.methods.fetchMarketItems().call().then(function (item) {
      state.items.map((data) => {
        const ownerAddress = item[data.item_id]
        const newItem = {
          ...data,
          ownerAddress: ownerAddress !== '0x0000000000000000000000000000000000000000' ? ownerAddress : "",
        }
        auxItems.push(newItem)
        if (data.auction_flg) {
          auxAuctionsItems.push(newItem)
        } else {
          auxGalleryItems.push(newItem)
        }
      })
    }).then(() => {
      actions({
        type: 'setState',
        payload: {
          ...state,
          galleryItems: auxGalleryItems,
          auctionsItems: auxAuctionsItems,
          isLoading: false
        }
      });
    });
    // // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });

    // // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();

    // // Update state with the result.
    // this.setState({ storageValue: response });
  }

  useEffect(() => {
    if (state.web3 && state.items.length > 0) {
      loadContract();
    }
  }, [state.web3, state.items])

  if (!state.web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }
  if (state.isLoading) {
    return <div>Loading Data...</div>;
  } else {
    return (
      <>
        <GalleryList galleryItems={state.galleryItems} auctionsItems={state.auctionsItems} />
      </>
    );
  }
})

export default GalleryHome;
