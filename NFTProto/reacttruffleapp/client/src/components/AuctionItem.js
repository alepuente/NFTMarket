import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardMedia, CardHeader, CardActionArea, Typography } from '@material-ui/core'
import { useHistory } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 400,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    }
}));
const AuctionItem = React.memo(props => {
    const classes = useStyles();
    let history = useHistory();
    const { data } = props
    const [timer, setTimer] = useState()
    const CALL_INTERVAL = 1000;
    useEffect(() => {
        if (data.auction_flg) {
            const interval = setInterval(() => {
                setTimer(calculateEndDate(data.auction_end_date))
            }, CALL_INTERVAL)
            return () => clearInterval(interval)
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
                timeLeft += days + '日'
                return timeLeft
            }
            if (hours > 0 || days > 0) {
                timeLeft += hours + '時'
            }
            if (minutes > 0 || hours > 0) {
                timeLeft += minutes + '分'
            }
            if (days + hours === 0 && minutes <= 9) {
                timeLeft += sec + '秒'
            }
            return timeLeft
        } else {
            return '終了'
        }
    }
    const openItemDetails = (e) => {
        history.push({ pathname: "/item", state: { itemId: e.currentTarget.value } })
    }

    calculateEndDate(data.auction_end_date)
    return (
        <>
            <Card className={classes.root} >
                <CardActionArea onClick={openItemDetails} value={data.item_id}>
                    <CardMedia
                        className={classes.media}
                        image={data.item_picture}
                        title=""
                    />
                    <Typography
                        style={{ fontSize: '3vw', paddingLeft: '2vw' }}
                        variant='subtitle1'>
                        {data.item_name}
                    </Typography>
                    <CardContent style={{ padding: '0px 16px 10px' }}>
                        <Typography
                            style={{ fontSize: '2vw', textAlign: 'end' }}
                            variant='subtitle1'>
                            現在価格:{data.auction_current_bid}
                        </Typography>
                        <Typography
                            style={{ fontSize: '2vw', textAlign: 'end' }}
                            variant='subtitle1'>
                            残り時間:{timer}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </>
    )
});

export default AuctionItem;