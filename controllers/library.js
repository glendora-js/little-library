var Library = require('../models/Library');

//dummy data until scraper is finished
var data = {
  name: "My Little Library",
  story: "This is my story",
  street: "222 First Street",
  city: "Monrovia",
  state: "California",
  zip: 91016,
  email: "my_email@email.com",
  steward_name: "Mr. Stew Ward"
};

exports.index = function(req, res) {
  res.render('library', {
      title: 'Library'
  });
};

/* GET for library by id/name
 *
 */
exports.getLibrary = function(req, res) {
  
  //TODO change id to library name  
  Library.findOne({ 'id': req.params.id }, function(err, lib){
    if (err) return handleError(err);
    
    res.render('library', {
        title : 'Library ' + req.params.id,
        lib: data //use lib when scraper finished
    });
  })
}

/* ADMIN */

/* GET library list
 *
 */
exports.lib_list = function(req, res){
  Library.find(function(err, libs){
    if (err) return handleError(err);
    res.render('admin/libraries', {
      title : 'Libraries',
      libs: [data] //use libs when scraper finished
    });
  });
}

/* POST update library details
 *
 */
exports.postUpdateLibrary = function(req, res) {
  var id = req.params.id;
  Library.findById(id, function(err, lib) {
    if (err) return handleError(err);
    var details = req.body;
    //TODO validate && format details
    for (var key in details){
      if (details.hasOwnPropery(key)){
        lib[key] = details[key];
      }
    }
    lib.save(function(err){
      var status = err ? 500 : 200;
      res.send(status);
    });
  });
}

/* POST delete library by id
 *
 */
exports.postDeleteLibrary = function(req, res){
  var id = req.params.id;
  Library.findOneAndRemove({id: id}, function(err, item){
    var status = err ? 500 : 200;
  });
}

/**
 * POST /account/delete
 * Delete user account.
 */
exports.getSearch= function(req, res, next) {
  var location = req.params.location
  res.redirect('https://www.google.com/maps/place/+#{location}');
};

