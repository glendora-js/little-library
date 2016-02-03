var Libraries = require('./models/Library'),
    secrets = require('./config/secrets'),
    mongoose = require('mongoose');

// we'll want everything within, say, ? km distance
var distance = 10;

// earth's radius in km = ~6371
var radius = 6371;

var lng = -117.74;
var lat = 34.12;

// latitude boundaries
var maxlat = lat + rad2deg(distance / radius);
var minlat = lat - rad2deg(distance / radius);

// longitude boundaries (longitude gets smaller when latitude increases)
var maxlng = lng + rad2deg(distance / radius / Math.cos(deg2rad(lat)));
var minlng = lng - rad2deg(distance / radius / Math.cos(deg2rad(lat)));

console.log("maxlng="+maxlng);
console.log("minlng="+minlng);
console.log("maxlat="+maxlat);
console.log("minlat="+minlat);

/*
 SELECT *
 FROM coordinates
 WHERE
 lat BETWEEN :minlat AND :maxlat
 lng BETWEEN :minlng AND :maxlng
 */

//Connect to MongoDB
mongoose.connect(secrets.db);
mongoose.connection.on('error', function(){
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});
var re = new RegExp('^((?!po box).)*$', 'i');

var query = Libraries
    .find({})
    //.where({'coordinates.0' : {'$gte' : 40}})
    .where({'coordinates.1' : {'$gte': minlng, '$lt': maxlng}})
    .where({'coordinates.0' : {'$gte': minlat, '$lt': maxlat}})
    .where({'street' : {$regex: re}})
    .exec( function(err, libraries) {
        if (err) throw err;
        complete(libraries);
    });


function complete(libraries){
        console.log('total libraries processed = ' + libraries.length);
        for (var key in libraries) {
            console.log("coordinate = " + libraries[key].coordinates);
        }
        process.exit();
}

function deg2rad(angle) {
    //  discuss at: http://phpjs.org/functions/deg2rad/
    // original by: Enrique Gonzalez
    // improved by: Thomas Grainger (http://graingert.co.uk)
    //   example 1: deg2rad(45);
    //   returns 1: 0.7853981633974483

    return angle * .017453292519943295; // (angle / 180) * Math.PI;
}

function rad2deg(angle) {
    //  discuss at: http://phpjs.org/functions/rad2deg/
    // original by: Enrique Gonzalez
    // improved by: Brett Zamir (http://brett-zamir.me)
    //   example 1: rad2deg(3.141592653589793);
    //   returns 1: 180

    return angle * 57.29577951308232; // angle / Math.PI * 180
}