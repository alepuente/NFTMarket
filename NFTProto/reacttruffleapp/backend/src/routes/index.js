const {Router} = require('express')
const router = Router();
const {getItems, deleteAuction, startAuction, makeBid,updatePrice, createNFT} = require('../controllers/index.controller');
router.get('/items', getItems);
router.delete('/deleteAuction/:id', deleteAuction);
router.post('/startAuction', startAuction);
router.post('/makeBid', makeBid);
router.post('/updatePrice', updatePrice);
router.post('/createNFT', createNFT);

module.exports = router;