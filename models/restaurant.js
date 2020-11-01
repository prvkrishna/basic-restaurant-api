var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var restaurantSchema = new Schema({
  name: String,
  address: String,
  coordinates: Array,
  operationTimings: {
    startTime:String,
    endTime:String
  },
  contactNumbers: Array,
  menu: [
    {
      itemName: String,
      price: Number,
      isAvailable: Boolean
    }
  ],
  review: {
    users: Number,
    rating: Number
  }
});

module.exports = mongoose.model('restaurant', restaurantSchema);