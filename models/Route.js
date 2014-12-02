require('./User');
var mongoose = require('mongoose');

var RouteSchema = new mongoose.Schema({
  user : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description : { type : String, required : true },
  waypoints : { type : [Number], required : true }
});

module.exports = mongoose.model('Route', RouteSchema);
