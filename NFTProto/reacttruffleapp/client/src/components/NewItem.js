import React, { useContext, useState } from "react";
import Context from "../scripts/context";
import { Grid, Button, IconButton, FormControl, InputLabel, FilledInput, InputAdornment } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faGavel } from '@fortawesome/free-solid-svg-icons'
import { ENDPOINT } from "../constants";
import "react-datepicker/dist/react-datepicker.css";
import Web3 from "web3";

const useStyles = makeStyles((theme) => ({
    image: {
        maxWidth: 'calc(100vw / 1.7)',
        maxHeight: 'calc(100vh / 1.3)',
        backgroundSize: 'contain'
    },
    info: {
        borderLeft: '20px',
        borderRight: '20px',
    }
}));

const NewItem = React.memo(props => {
    const classes = useStyles();
    const { state, actions } = useContext(Context);
    let history = useHistory();
    const [priceText, setPriceText] = useState('')
    const placeholderURL = 'https://mojibeer.ntf.ne.jp/wp/wp-content/uploads/placeholder-image-600x450.png'
    const [urlText, setURLText] = useState(placeholderURL)
    const [imagePathValidFlg, setImagePathValidFlg] = useState(false)
    const [nameText, setNameText] = useState('')
    const currentAccount = state.accounts ? state.accounts[0] : ''

    const backProfile = () => {
        history.push({ pathname: "/profile" })
    }
    const handleCreate = async () => {
        try {
            const tokenId = await state.nftContract.methods.createToken.call('a0000', { from: currentAccount });
            await state.contract.methods.createMarketItem.call(state.nftContract._address, tokenId, Web3.utils.toWei(priceText, 'ether'), { from: currentAccount })

        } catch (error) {

        }
        if (parseFloat(priceText) > 0 && urlText != placeholderURL && imagePathValidFlg != false && nameText != '') {
            fetch(ENDPOINT.createNFT, {
                "method": "POST",
                "headers": { 'Content-Type': 'application/json' },
                "body": JSON.stringify({
                    item_price: priceText,
                    item_name: nameText,
                    item_picture: urlText
                })
            })
            backProfile()
        }
    }

    const handleChange = (input) => {
        setPriceText(input.target.value)
    }
    const handleURLChange = (input) => {
        setImagePathValidFlg(true)
        setURLText(input.target.value)
    }
    const handleNameChange = (input) => {
        setNameText(input.target.value)
    }

    const handleURLError = () => {
        setImagePathValidFlg(false)
    }
    return (
        <>
            <IconButton onClick={backProfile} style={{ left: '0px', position: 'absolute' }}>
                <FontAwesomeIcon icon={faArrowCircleLeft} />
            </IconButton>
            <Grid container spacing={2} justifyContent='center' alignItems='center' style={{ paddingTop: '40px' }}>
                <Grid item s={8}>
                    <img src={urlText} alt="Wrong Image URL" className={classes.image} onError={handleURLError} onEmptied={handleURLError} />
                </Grid>
                <Grid item s={4} className={classes.info} style={{ display: 'grid' }}>
                    <FormControl fullWidth sx={{ m: 1 }} variant="filled">
                        <InputLabel htmlFor="filled-URL">画像のURL</InputLabel>
                        <FilledInput
                            id="filled-URL"
                            value={urlText}
                            onChange={handleURLChange}
                        />
                        <InputLabel htmlFor="filled-adornment-amount">価格</InputLabel>
                    </FormControl>
                    <FormControl fullWidth sx={{ m: 1 }} variant="filled">
                        <InputLabel htmlFor="filled-name">NFT名</InputLabel>
                        <FilledInput
                            id="filled-name"
                            onChange={handleNameChange}
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{ m: 1 }} variant="filled" >
                        <FilledInput
                            id="filled-adornment-amount"
                            onChange={handleChange}
                            endAdornment={<InputAdornment position="start">ETH</InputAdornment>}
                        />
                    </FormControl>
                    <Button
                        variant='contained'
                        color='primary'
                        size="medium"
                        startIcon={<FontAwesomeIcon icon={faGavel} />}
                        onClick={handleCreate}
                        style={{ marginTop: '20px', justifySelf: 'center' }}
                    >
                        NFT作成
                    </Button>
                </Grid>
            </Grid>
        </>
    );
})

export default NewItem;
