var Library = require('../models/Library');

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


      res.render('library', {
          title : 'Library ' + req.params.id,
          lib: data //use lib when scraper finished
      });
    })
}
