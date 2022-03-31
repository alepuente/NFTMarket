import React from "react";
import GalleryItem from "./GalleryItem"
import { Grid, Typography, Container, Divider } from '@material-ui/core'
import AuctionItem from "./AuctionItem";


const GalleryList = React.memo(props => {
    const { galleryItems, auctionsItems } = props;
    return (
        <>
            <Container>
                <Typography variant="h1" component="p" align='center' style={{ overflowWrap: 'anywhere', fontSize: '10vw' }}>
                    NFT MARKET
                </Typography>
                <Divider />
                <Grid container spacing={1} style={{ margin: '10px 0px' }}>
                    {auctionsItems.map((item, index) => {
                        return (
                            <Grid item xs={4} key={index}>
                                <AuctionItem data={item} />
                            </Grid>
                        )
                    })}
                </Grid>
                <Divider />
                <Grid container spacing={1} style={{ margin: '10px 0px' }}>
                    {galleryItems.map((item, index) => {
                        return (
                            <Grid item xs={4} key={index}>
                                <GalleryItem data={item} />
                            </Grid>
                        )
                    })}
                </Grid>
            </Container>
        </>
    )
});

export default GalleryList;