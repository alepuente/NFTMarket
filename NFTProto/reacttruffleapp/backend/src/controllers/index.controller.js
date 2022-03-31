const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'nftmarket',
    port: '5432'
})
const getItems = async (req, res) => {
    const response = await pool.query(
        'SELECT\
        item_id,\
        item_name,\
        item_picture,\
        item_price,\
        auction_id,\
        CASE WHEN auction_flg is NULL THEN FALSE ELSE TRUE END AS auction_flg,\
        auction_end_date,\
        auction_current_bid,\
        auction_current_bider\
        FROM items\
        FULL JOIN\
        auctions ON auctions.auction_item_id = item_id\
        ORDER BY item_id'
    );
    res.status(200).json(response.rows)
    console.log('CALL')
}
const deleteAuction = async (req, res) => {
    const id = req.params.id;
    const response = await pool.query(
        'DELETE FROM public.auctions WHERE auction_id = $1', [id]
    )
    res.status(200)
    console.log('REMOVED AUCTION' + id)
}

const startAuction = async (req, res) => {
    const { price, end_date, item_id } = req.body;
    console.log(req.body)
    const response = await pool.query(
        'INSERT INTO public.auctions(\
            auction_flg, auction_end_date, auction_current_bid, auction_item_id)\
            VALUES (TRUE, $1, $2, $3);', [end_date, price, item_id]
    )
    res.status(200)
    console.log('STARTED AUCTION' + item_id)
}

const makeBid = async (req, res) => {
    const { price, current_bider, auction_id } = req.body;
    console.log(req.body)
    const response = await pool.query(
        'UPDATE public.auctions\
        SET auction_current_bid=$1, auction_current_bider=$2\
        WHERE auction_id=$3;', [price, current_bider, auction_id]
    )
    res.status(200)
    console.log('NEWBID ' + auction_id)
}

const updatePrice = async (req, res) => {
    const { price, item_id } = req.body;
    console.log(req.body)
    const response = await pool.query(
        'UPDATE public.items\
        SET item_price=$1\
        WHERE item_id=$2;', [price, item_id]
    )
    res.status(200)
    console.log('UPDATED PRICE' + item_id)
}

const createNFT = async (req, res) => {
    const { item_price, item_name, item_picture } = req.body;
    console.log(req.body)
    const response = await pool.query(
        'INSERT INTO public.items(\
        item_name, item_picture, item_price)\
        VALUES ($1, $2, $3);', [item_name, item_picture,item_price]
    )
    res.status(200)
    console.log('NEW NFT')
}

module.exports = {
    getItems,
    deleteAuction,
    startAuction,
    makeBid,
    updatePrice,
    createNFT
}