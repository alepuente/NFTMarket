import React, { useContext, useEffect, useState } from "react";
import GalleryItem from "./GalleryItem"
import { Grid, Typography, Container, Card, CardActionArea, CardMedia, CardContent } from '@material-ui/core'
import Context from "../scripts/context";
import { useHistory } from "react-router-dom";
import logo from '../assets/plus.png'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    media: {
        height: 'calc(100vw /8)'
    }
}));

const Profile = React.memo(props => {
    const { state } = useContext(Context);
    const { contract } = state;
    let history = useHistory();
    if (!contract) {
        history.push({ pathname: "/" })
    }
    const [galleryItems, setItems] = useState()
    const classes = useStyles();
    const toNewItem = (e) => {
        history.push({ pathname: "/newItem" })
    }
    useEffect(() => {
        contract.methods.fetchMyNFTs().call().then(function (item) {
            setItems(
                state.items.map((data, index) => {
                    const currentAccount = state.accounts ? state.accounts[0] : ''
                    if (data.item_price > 5) {
                        return (
                            <>
                                <Grid item xs={4} key={index}>
                                    <GalleryItem data={data} />
                                </Grid>
                            </>

                        )
                    }
                })
            )

        })
    }, [state.items])
    return (
        <>
            <Container>
                <Typography variant="h5" component="p" align='center' style={{ overflowWrap: 'anywhere', fontSize: '10vw' }}>
                    MY NFTS
                </Typography>
                <Grid container spacing={1} style={{ margin: '10px 0px' }}>
                    {galleryItems}
                    <Grid item xs={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vw /3.3)' }}>
                        <img src={logo} className={classes.media} onClick={toNewItem} />
                    </Grid>
                </Grid>
            </Container>
        </>
    )
});

export default Profile;