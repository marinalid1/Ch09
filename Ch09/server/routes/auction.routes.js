import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import auctionCtrl from '../controllers/auction.controller'

const router = express.Router()

// Pg 413, the open Auction API
router.route('/api/auctions')
  .get(auctionCtrl.listOpen)

// Pg 415, The Auctions by bidder API
router.route('/api/auctions/bid/:userId')
  .get(auctionCtrl.listByBidder)

  // Pg 423, the read auction API
router.route('/api/auction/:auctionId')
  .get(auctionCtrl.read)

// Pg 407, the create auction API
router.route('/api/auctions/by/:userId')
  .post(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.isSeller, auctionCtrl.create)
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, auctionCtrl.listBySeller)

// Pg 421, Edit and delete auction APIs
router.route('/api/auctions/:auctionId')
  .put(authCtrl.requireSignin, auctionCtrl.isSeller, auctionCtrl.update)
  .delete(authCtrl.requireSignin, auctionCtrl.isSeller, auctionCtrl.remove)

router.route('/api/auctions/image/:auctionId')
  .get(auctionCtrl.photo, auctionCtrl.defaultPhoto)

router.route('/api/auctions/defaultphoto')
  .get(auctionCtrl.defaultPhoto)

// Pg 421, invoke the auctionById controller method
router.param('auctionId', auctionCtrl.auctionByID)
// Pg 407, user is available in the request object as profile
router.param('userId', userCtrl.userByID)

export default router
