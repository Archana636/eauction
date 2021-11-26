const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const AuctionSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  initialvalue: {
    type: String,
    required: true
  },
  finalvalue: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Auction = mongoose.model("auctionitems", AuctionSchema);
