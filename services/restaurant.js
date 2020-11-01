module.exports = function (router, User) {
    var Restaurant = require('../models/restaurant');
    router.post('/addRestaurant', (req, res) => {
        let { name, address, coordinates, operationTimings, contactNumbers } = req.body;
        let restaurant = new Restaurant();
        restaurant.name = name;
        restaurant.address = address;
        restaurant.coordinates = coordinates;
        restaurant.operationTimings = operationTimings;
        restaurant.contactNumbers = contactNumbers;
        restaurant.save((err) => {
            if (err) return res.json({ status: false, message: err });
            res.json({ status: true, restaurant: restaurant, message: 'Restaurant created successfully' });
        });
    });
    router.put('/publishMenu', (req, res) => {
        let { restaurantId, menu } = req.body;
        if (restaurantId) {
            Restaurant.updateOne(
                { _id: restaurantId },
                { $set: { menu: menu } }
                , function (err, restaurant) {
                    if (err) return res.json({ status: false, message: err });
                    res.json({ status: true, restaurant: "", message: 'Menu added' });
                }
            );
        } else {
            res.json({ status: false, message: 'Invalid Inputs' });
        }
    })
    router.get('/getRestaurants', (req, res)=>{
        console.log("req.params: ", req.query)
        let {name, item, address} = req.query, condition="";
        if(!name && !item && !timings){
            return res.json({ status: false, message: 'Invalid Inputs' });
        }
        if(name && item && address){
            condition = {name:name, item:item, address:address}
        }else if(item && address){
            condition = {item:item, address:address, }
        }else if(address){
            condition = {address:address}
        }else{
            //If no address, then calculating within 5km radius
            var METERS_PER_MILE = 1609.34;
            condition = {item:item, location: { $nearSphere: { $geometry: { type: "Point", coordinates: [ -73.93414657, 40.82302903 ] }, $maxDistance: 5 * METERS_PER_MILE } } } 
        }
        Restaurant.find(condition,function(err, restaurants){
            res.json({ status: true, restaurants: restaurants, message: 'Available restaurants' });
        })
    })
    router.post('/rateRestaurant', (req, res)=>{
        let {id, rating }=req.body;
        Restaurant.find({_id:id}, function(err, restaurant){
            if(!err){
                let users = restaurant.review.users, previousRating=restaurant.review.rating, currentRating=0;
                users = users+1;
                currentRating = (previousRating + rating)/users;
                Restaurant.updateOne(
                    { _id: restaurant._id },
                    { $set: { 'review.rating': currentRating, 'review.users':users} }
                    , function (err, updated) {
                        if (err) return res.json({ status: false, message: err });
                        res.json({ status: true, updated: updated, message: 'Updated successfully' });
                    }
                );
            }
        })
    })

    router.post('/filterByRating', (req, res)=>{
        Restaurant.find({'review.rating':{$gte:req.body.rating}}, function(err, restaurants){
            res.json({ status: true, restaurants: restaurants, message: 'Available restaurants' });
        })
    })

    return router;
}