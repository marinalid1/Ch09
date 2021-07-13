import mongoose from 'mongoose'
const AuctionSchema = new mongoose.Schema({
  // Pg 404, Item Name
  itemName: {
    type: String,
    trim: true,
    required: 'Item name is required'
  },
  // Pg 404, Item Description
  description: {
    type: String,
    trim: true
  },
  // Pg 405, Item Image
  image: {
    data: Buffer,
    contentType: String
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
  // Pg 405, Bidding Start time
  bidStart: {
    type: Date,
    default: Date.now
  },
  // Pg 405, Bidding End time
  bidEnd: {
    type: Date,
    required: "Auction end time is required"
  },
  // Pg 405, Seller
  seller: {
    type: mongoose.Schema.ObjectId, 
    ref: 'User'
  },
  // Pg 406, Starting Bid
  startingBid: { type: Number, default: 0 },
  // Pg 406, List of bids
  bids: [{
    bidder: {type: mongoose.Schema.ObjectId, ref: 'User'},
    bid: Number,
    time: Date
  }]
})

export default mongoose.model('Auction', AuctionSchema)
