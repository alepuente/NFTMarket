const NFTMarket = artifacts.require("NFTMarket");
const NFT = artifacts.require("NFT")

contract("MARKET", (accounts) => {
  let market;
  let nft;

  before(async () => {
    market = await NFTMarket.deployed();
  });

  before(async () => {
    nft = await NFT.deployed();
  });

  describe("NFTMARKET", function () {
    it("Should create and execute market sales", async function () {

      const address = nft.address
      const listingPrice1 = await nft.createToken.call("https://mui.com/components/app-bar/1");
      const listingPrice2 = await nft.createToken.call("https://mui.com/components/app-bar/2");
      const listingPrice3 = await nft.createToken.call("https://mui.com/components/app-bar/3");

      const listingPrice = await market.getListingPrice.call()
      
      let newNft = await market.createMarketItem.call(address, listingPrice3, 1 ,{value: listingPrice});

      console.log('AAAAAAAAAAA');

      let list = await market.fetchMarketItems.call()
      console.log(list);

    });
  });
});


