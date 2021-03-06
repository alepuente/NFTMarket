import React, { useContext, useEffect, useState } from "react";
import Context from "../scripts/context";
import { Grid, Button, Typography, IconButton, FormControl, InputLabel, DateTimePicker, FilledInput, InputAdornment } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faHandHoldingMedical, faGavel, faSave } from '@fortawesome/free-solid-svg-icons'
import { ENDPOINT } from "../constants";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";

const useStyles = makeStyles((theme) => ({
    image: {
        maxWidth: '100%',
        maxHeight: 800,
        backgroundSize: 'contain'
    },
    info: {
        borderLeft: '20px',
        borderRight: '20px',
    }
}));

const ItemDetails = React.memo(props => {
    const classes = useStyles();
    const { state } = useContext(Context);
    let history = useHistory();
    const item = state.items[props.location.state.itemId]
    const [action, setAction] = useState()
    const [timer, setTimer] = useState()
    const CALL_INTERVAL = 1000;
    const [priceText, setPriceText] = useState('')
    const currentAccount = state.accounts ? state.accounts[0] : ''
    const todayDate = new Date()
    const [endDate, setEndDate] = useState(todayDate)

    const backHome = () => {
        history.push({ pathname: "/" })
    }

    useEffect(() => {
        if (item !== null) {
            if (item.auction_flg) {
                setPriceText(item.auction_current_bid)
                const interval = setInterval(() => {
                    setTimer(calculateEndDate(item.auction_end_date))
                }, CALL_INTERVAL)
                return () => clearInterval(interval)
            } else {
                setPriceText(item.item_price)
            }
        } else {
            backHome()
        }

    }, [])

    const calculateEndDate = (date) => {
        const ms = Date.parse(date) - Date.now()
        if (ms > 0) {
            const days = Math.floor(ms / (24 * 60 * 60 * 1000));
            const daysms = ms % (24 * 60 * 60 * 1000);
            const hours = Math.floor(daysms / (60 * 60 * 1000));
            const hoursms = ms % (60 * 60 * 1000);
            const minutes = Math.floor(hoursms / (60 * 1000));
            const minutesms = ms % (60 * 1000);
            const sec = Math.floor(minutesms / 1000);
            var timeLeft = ''
            if (days > 0) {
                timeLeft += days + '???'
                return timeLeft
            }
            if (hours > 0 || days > 0) {
                timeLeft += hours + '???'
            }
            if (minutes > 0 || hours > 0) {
                timeLeft += minutes + '???'
            }
            if (days + hours + minutes === 0) {
                timeLeft += sec + '???'
            }
            return timeLeft
        } else {
            return '??????'
        }
    }

    const handleClick = async () => {
        const response = await state.contract.methods.getItem(item.item_id).send({ from: currentAccount })
            .then(
                history.push({ pathname: "/" })
            );
    }
    const handleRemoveAuction = () => {
        fetch(ENDPOINT.removeAuction + '/' + item.auction_id, {
            "method": "DELETE"
        })
        backHome()
    }

    const handleStartAuction = () => {
        fetch(ENDPOINT.startAuction, {
            "method": "POST",
            "headers": { 'Content-Type': 'application/json' },
            "body": JSON.stringify({
                price: priceText,
                end_date: endDate,
                item_id: item.item_id
            })
        })
        backHome()
    }

    const handleMakeBid = () => {
        if (parseFloat(priceText) > parseFloat(item.auction_current_bid)) {
            fetch(ENDPOINT.makeBid, {
                "method": "POST",
                "headers": { 'Content-Type': 'application/json' },
                "body": JSON.stringify({
                    price: priceText,
                    current_bider: currentAccount,
                    auction_id: item.auction_id
                })
            })
            backHome()
        }
    }

    const handleUpdate = () => {
        fetch(ENDPOINT.updatePrice, {
            "method": "POST",
            "headers": { 'Content-Type': 'application/json' },
            "body": JSON.stringify({
                price: priceText,
                item_id: item.item_id,
            })
        })
        backHome()

    }

    const handleChange = (input) => {
        setPriceText(input.target.value)
    }

    const handleDateChange = (date) => {
        console.log(date)
        setEndDate(date)
    }

    useEffect(() => {
        if (item.ownerAddress === "" || currentAccount !== item.ownerAddress) {
            if (item.auction_flg) {
                if (calculateEndDate(item.auction_end_date) === '??????') {
                    setAction(
                        <>
                        </>
                    )
                } else {

                    setAction(
                        <>
                            <FormControl fullWidth sx={{ m: 1 }} variant="filled" style={{ maxWidth: '40%' }}>
                                <InputLabel htmlFor="filled-adornment-amount">??????</InputLabel>
                                <FilledInput
                                    id="filled-adornment-amount"
                                    value={priceText}
                                    onChange={handleChange}
                                    endAdornment={<InputAdornment position="start">ETH</InputAdornment>}
                                />
                            </FormControl>
                            <br></br>
                            <Button
                                variant='contained'
                                size="medium"
                                startIcon={<FontAwesomeIcon icon={faHandHoldingMedical} />}
                                onClick={handleMakeBid}
                            >
                                ????????????
                            </Button>
                        </>
                    )
                }
            } else {
                setAction(
                    <>
                        <Typography variant={'subtitle1'}>
                            {item.item_price + ' ETH'}
                        </Typography>
                        <Button
                            variant='contained'
                            size="medium"
                            startIcon={<FontAwesomeIcon icon={faHandHoldingMedical} />}
                            onClick={handleClick}
                        >
                            ???????????????
                        </Button>
                    </>
                )
            }
        } else {
            if (item.auction_flg) {
                if (calculateEndDate(item.auction_end_date) === '??????') {
                    setAction(
                        <>
                            <Button
                                variant='contained'
                                size="medium"
                                startIcon={<FontAwesomeIcon icon={faHandHoldingMedical} />}
                                onClick={handleRemoveAuction}
                            >
                                ????????????????????????
                            </Button>
                        </>
                    )
                }
            } else {
                setAction(
                    <>
                        <FormControl fullWidth sx={{ m: 1 }} variant="filled" style={{ maxWidth: '40%' }}>
                            <InputLabel htmlFor="filled-adornment-amount">??????</InputLabel>
                            <FilledInput
                                id="filled-adornment-amount"
                                value={priceText}
                                onChange={handleChange}
                                endAdornment={<InputAdornment position="start">ETH</InputAdornment>}
                            />
                            <Button
                                variant='contained'
                                size="medium"
                                startIcon={<FontAwesomeIcon icon={faSave} />}
                                onClick={handleUpdate}
                            >
                            </Button>
                            <Button
                                variant='contained'
                                size="medium"
                                startIcon={<FontAwesomeIcon icon={faGavel} />}
                                onClick={handleStartAuction}
                                style={{ marginTop: '20px', float: 'right' }}
                            >
                                ????????????????????????
                            </Button>
                            <DatePicker
                                minDate={todayDate}
                                selected={endDate}
                                showDisabledMonthNavigation
                                onChange={handleDateChange} />
                        </FormControl>
                    </>
                )
            }

        }
    }, [priceText, endDate])

    return (
        <>
            <IconButton onClick={backHome}>
                <FontAwesomeIcon icon={faArrowCircleLeft} />
            </IconButton>
            <Grid container spacing={2} justifyContent='center' alignItems='center'>
                <Grid item s={8}>
                    <img src={item.item_picture} className={classes.image} />
                </Grid>
                <Grid item s={4} className={classes.info}>
                    <Typography variant={'h3'} style={{ overflowWrap: 'anywhere' }}>
                        {item.item_name}
                    </Typography>
                    <Typography style={{ overflowWrap: 'anywhere' }}>
                        ???????????????:{item.ownerAddress}
                    </Typography>
                    {item.auction_flg &&
                        <>
                            <Typography
                                variant='subtitle1'>
                                ????????????:{item.auction_current_bid}
                            </Typography>
                            <Typography
                                variant='subtitle1'>
                                ??????????????????:{item.auction_current_bider}
                            </Typography>
                            <Typography
                                variant='subtitle1'>
                                ????????????:{timer}
                            </Typography>
                        </>
                    }
                    {action}

                </Grid>
            </Grid>
        </>
    );
})

export default ItemDetails;
