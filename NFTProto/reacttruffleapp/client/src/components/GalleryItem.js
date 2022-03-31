import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardMedia, Typography, CardActionArea } from '@material-ui/core'
import { useHistory } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  root: {

  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  }
}));
const GalleryItem = React.memo(props => {
  const classes = useStyles();
  let history = useHistory();
  const { data } = props
  const openItemDetails = (e) => {
    history.push({ pathname: "/item", state: { itemId: e.currentTarget.value } })
  }
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
        </CardActionArea>
        <CardContent style={{ padding: '0px 16px 10px' }}>
          <Typography
            style={{ fontSize: '2vw', textAlign: 'end' }}
            variant='subtitle1'>
            {data.item_price + ' ETH'}
          </Typography>
        </CardContent>
      </Card>
    </>
  )
});

export default GalleryItem;