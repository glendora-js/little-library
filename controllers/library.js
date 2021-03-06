var Library = require('../models/Library');
var _ = require('lodash');

//TODO add more formatting for individual fields 
var fields = {
  'library_id' : { 
  },
  'name' : { 
    strCase : 'capitalized' 
  }, 
  'story' : { 
  }, 
  'charter' : { 
  }, 
  'street' : { 
    strCase : 'capitalized'
  }, 
  'city' : { 
    strCase : 'capitalized'
  }, 
  'state' : { 
    strCase : 'upper' 
  },
  'zip' : { 
  },
  'country' : {
    strCase : 'capitalized'
  }, 
  'coordinates' : { 
    format : function(str){
      return str.split(',');
    }
  }, 
  'email' : { 
  }, 
  'steward_name' : { 
    strCase : 'capitalized' 
  },
  'photo_url' : {
  }, 
  'status' : { 
  }
};

/* Normalize library data for db
 *
 */
function normalizeData(key, data){
 
  if (typeof data == "string")
    data = data.trim();
  
  if (fields[key] !== undefined){
    if (fields[key].strCase !== undefined){
      switch(fields[key].strCase){
        case 'upper':
          data = data.toUpperCase();
          break;
        case 'capitalized':
          data = data.split(' ').map(function(str){
            return str.charAt(0).toUpperCase() + str.slice(1);
          }).join(' ');
          break;
      }
    }
    if (fields[key].format !== undefined){
      data = fields[key].format(data);
    }
  }
  return data;
}

exports.index = function(req, res) {
  res.render('library', {
      title: 'Libraries'
  });
};

/*GET for library by id/name
 *
 */
exports.getLibraries = function(req, res) {
 
  //TODO change id to library name  
  Library.findOne({ 'id': req.params.id }, function(err, lib){
    if (err) return console.error(err);

    res.render('library', {
        title : 'Libraries ' + req.params.id,
        lib: data //use lib when scraper finished
    });
  })
}

/* GET for library by id/name
 *
 */
exports.getLibrary = function(req, res) {
  
  //TODO change id to library name  
  Library.findOne({ 'library_id': req.params.id }, function(err, lib){
    if (err) return handleError(err);
    res.render('library', {
        title : 'Library ' + req.params.id,
        lib: lib //use lib when scraper finished
    });
  })
}

/* ADMIN */

/* /admin/libraries 
 *
 * params: status, city, zipcode, steward, email
 *
 * GET library list
 *
 */
exports.lib_list = function(req, res){
  
  var filters = ['status', 'city', 'zip', 'steward_name', 'email'];  
  var filter_data = {};
  var filter_query = {};
  var page = req.query.p ? req.query.p : 1;

  _.each(filters, function(filter){
    
    if (req.query[filter] !== undefined){
      if (filter == 'status'){
        switch(req.query[filter]){
          case 'all':
            filter_query[filter] = { $in : [false, true] };
            break;
          case 'enable':
            filter_query[filter] = true;
            break;
          case 'disable':
            filter_query[filter] = false;
            break;
        }
      } else {
        filter_query[filter] = normalizeData(filter, decodeURIComponent(req.query[filter])); 
      } 
      filter_data[filter] = normalizeData(filter, decodeURIComponent(req.query[filter]));
    } else {
      filter_data[filter] = "";
    }
  });
  
  //pagination
  var limit = 25;  

  Library.
    find(filter_query).
    skip(limit * (page-1)).
    limit(limit).
    exec(function(err, libs){
      if (err) return console.error(err);
      else {
        //now get the totals
        Library.count(filter_query, function (err, count){
          if (!err){
            res.render('admin/libraries', {
              title : 'Libraries',
              token : res.locals._csrf,
              libs: libs, 
              filter_data : filter_data,
              page : page,
              total : count
            });
          } else{
            conole.log(err);
          } 
        });
      }
    });
}

/* /admin/library/:id
 *
 * GET library create/edit page
 *
 */ 
exports.getAdminLibrary = function(req, res){
  var query = { library_id : req.params.id };
  Library.findOne(query, function(err, library) {
    if (err) console.error(err);
    
    var data = {};
    var title = library ? library.name.toUpperCase() : "New Library";
    
    if (req.params.id !== "new"){
      //only for existing library
      data = library;
      var coordinates = data.coordinates ? data.coordinates[0].toString() + "," + data.coordinates[1].toString() : "";
      data.coordinates = coordinates;
    } else {
      //initiate new library
      for (var key in fields){
        data[key] = '';
      }
    }

    res.render('admin/library', {
      title : title,
      data : data 
    });
  });
  
};

/* /admin/library/edit/:id
 *
 * POST update library details
 *
 */
exports.postUpdateLibrary = function(req, res) {
  var partial = req.body.partial; //for partial update, ie. toggleStatus
  
  if (!partial){
    //full update requires validation
    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('library_id', 'Library ID cannot be blank').notEmpty();
    //req.assert('story', 'Story cannot be blank').notEmpty();
    req.assert('charter', 'Charter # cannot be blank').notEmpty();
    req.assert('street', 'Street cannot be blank').notEmpty();
    req.assert('state', 'State cannot be blank').notEmpty();
    req.assert('zip', 'Zip cannot be blank').notEmpty();
    req.assert('country', 'Country cannot be blank').notEmpty();
    req.assert('coordinates', 'Coordinates cannot be empty').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('steward_name', 'Steward cannot be blank').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
      req.flash('errors', errors);
      //include post data
      return res.render('admin/library', {
        title : req.body.name,
        data : req.body
      }); 
    }
  }  
  
  var query = { library_id : req.params.id };
  var fields = req.body;
  //normalize data
  for (var key in req.body){
    if (req.body[key] !== undefined)
      req.body[key] = normalizeData(key, req.body[key]);
  }

  Library.update(query, fields,
    { upsert: true }, // insert the document if it does not exist
    function (err, result){
      
      if (!partial) {
        if (err){
          req.flash('errors', { msg : err.message });
        } else {
          req.flash('success', { msg : req.body.name + ' has been updated successfully!' });
        }
        res.redirect('/admin/libraries');
      } else {
        if (err){
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      }
    }
  );
};

/* /admin/library/delete
 *
 * POST delete library by id
 *
 */
exports.postDeleteLibrary = function(req, res){
  var id = req.body.library_id;
  Library.findOneAndRemove({library_id: id}, function(err, item){
    if (err)
      console.log(err);
    var status = err ? 500 : 200;
    res.sendStatus(status);
  });
};

/**
 * Google API search by location.
 */
exports.postSearch= function(req, res, next) {
  var location = req.body.location
  res.render('map', {mapData: {location : location}});
};

/**
 * Show library details.
 */
exports.postShowLibrary = function(req, res, next) {
  var libraries = req.session.libraries;
  var library = libraries[req.body.librariesKey];
  for (var key in library) {
    if (key == 'photo_url')
      for (var imageKey in library[key]) {
        console.log("imageKey = "+ imageKey+" , value = " + library[key][imageKey]);
      }
      console.log("key = "+ key+" , value = " + library[key]);
  }
  console.log("library['library_id'] = " +library['library_id'])
  req.session.library_id = library['library_id'];
  res.render('library', {libData: {libraryInfo : library}});
};
