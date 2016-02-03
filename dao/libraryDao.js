var Libraries = require('../models/Library'),
    mongoose = require('mongoose');

var re = new RegExp('^((?!po box).)*$', 'i');

/**
 * Get all books within a specified kilometerRadius from location
 * @param Location loc {}
 * @param int kilometerRadius {}
 * @return libraries
 */
exports.getLibrariesByDistance = function(location, kilometerRadius, callback) {
// we'll want everything within, say, kilometerRadius

// earth's radius in km = ~6371
    var radius = 6371;

    var lng = Number(location['lng']);
    var lat = Number(location['lat']);

// latitude boundaries
    var maxlat = lat + rad2deg(kilometerRadius / radius);
    var minlat = lat - rad2deg(kilometerRadius / radius);

// longitude boundaries (longitude gets smaller when latitude increases)
    var maxlng = lng + rad2deg(kilometerRadius / radius / Math.cos(deg2rad(lat)));
    var minlng = lng - rad2deg(kilometerRadius / radius / Math.cos(deg2rad(lat)));

    /*
     SELECT *
     FROM coordinates
     WHERE
     lat BETWEEN :minlat AND :maxlat
     lng BETWEEN :minlng AND :maxlng
     */

    var query = Libraries
        .find({})
        .where({'coordinates.1' : {'$gte': minlng, '$lt': maxlng}})
        .where({'coordinates.0' : {'$gte': minlat, '$lt': maxlat}})
        .where({'street' : {$regex: re}})
        .exec( function(err, libraries) {
            if (err) throw err;
            callback(libraries);
        });
};

/**
* @param String text {} 
* @return results
*/
exports.searchByCity = function(text) {
    var results;
    return results;
};

function complete(libraries){
    console.log('total libraries processed = ' + libraries.length);
    for (var key in libraries) {
        console.log("coordinate = " + libraries[key].coordinates);
    }
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