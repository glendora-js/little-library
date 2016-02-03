var fs = require('fs'),
  request = require('request'),
  secrets = require('./config/secrets'), 
  mongoose = require('mongoose'),
  Libraries = require('./models/Library');

var opts = {
  city : '',
  state : '',
  zip : ''
};

function usage(){
  var help = 'Usage: node scraper.js [options]\n';
  help = help + 'Options:\n';
  help = help + '  -h --help\n';
  help = help + '  -c --city    Monrovia\n';
  help = help + '  -s --state   California\n';
  help = help + '  -z --zip     91016\n';
  help = help + 'Note: Adds all new libraries to db';
  console.log(help);
  process.exit(1);
}

/**
 * POST request to map url
 *
 */
function scrape(callback){
  var located = formatLocation();
  var post_data = {
    'action':'MapPageController',
    'method':'remoteSearch',
    'data':
      located,
      'type':'rpc',
      'tid':2,
      'ctx':{
        'csrf':'VmpFPSxNakF4Tmkwd01TMHlNMVF3T1RveE16bzFOUzQxT0RSYSxCcDZHSUU2akU1UkFDdlV2N29ULUJ0LFpUTmhZelkw',
        'vid':'066d00000027Meh',
        'ns':'',
        'ver':29}
  };

  var headers = {
    'User-Agent' : 'GlendoraJS Meetup Group',
    'Referer' : 'http://littlefreelibrary.force.com/mapPage'
  }

  var options = {
    url : 'http://littlefreelibrary.force.com/apexremote',
    method : 'POST',
    headers : headers,
    json : post_data
  }
 
  request.post(options, function (err, res, body){
      if (err){
        throw new Error('Something bad happened with the POST request:\n' + err);
      } else if (res.statusCode != 200){
        throw new Error('Non-OK status code:' + res.statusCode);
      } else {
        console.log('Found ' + body[0].result.length + ' libraries ...');
        if (body[0].result.length){
          callback(body[0].result);
        } else {
          process.exit(1);
        }
      }
    }
  );
}

var count = 0; //check callback counts
var update_err = []; //failed inserts
var skipped = []; //lib already in db

function storeLibs(results){

  for (var i = 0; i < results.length; i++){
    var result = formatLib(results[i]);
    count++;
     
    Libraries.update(
      { library_id : result.library_id }, 
      result,
      { upsert : true }, 
      function(err, obj){
        count--;
        if (err){
          //don't throw, keep update going
          update_err.push({
            error : err,
            id : result.library_id
          });
        } else if (!obj.upserted){
          skipped.push(result.library_id);
        } 
        complete(results.length);
      }
    );
  }
}

function complete(total_libs){
  if (!count){
    
    console.log(update_err.length + ' libraries with errors.');
    
    //found in the db and not added
    console.log(skipped.length + ' libraries skipped.');
    
    var updated = total_libs - update_err.length - skipped.length;
    console.log(updated + ' libraries inserted.');
    
    process.exit();
  }
}

/**
 * Prepare library fields
 * 
 * TODO normalize data
 */
function formatLib(lib){
  var library = lib.library;
  var libObj = {
    library_id : library.Id,
    name : library.Library_Name__c ? library.Library_Name__c : '',
    story : library.Library_Story__c ? library.Library_Story__c : '',
    charter : library.Official_Charter_Number__c ? parseInt(library.Official_Charter_Number__c) : 0,
    street : library.Street__c ?library.Street__c : '',
    city : library.City__c ? library.City__c : '',
    state : library.State_Province_Region__c ? library.State_Province_Region__c : '',
    zip : library.Postal_Zip_Code__c ? parseInt(library.Postal_Zip_Code__c) : 0,
    country : library.Country__c ? library.Country__c : '',
    coordinates : [
      parseFloat(library.Library_Geolocation__c.latitude),
      parseFloat(library.Library_Geolocation__c.longitude)
    ],
    email : library.Primary_Steward_s_Email__c ? library.Primary_Steward_s_Email__c : '', 
    steward_name : library.Primary_Steward_s_Name__c ? library.Primary_Steward_s_Name__c : '',
    status : true
  };

  var photos = [],
      link = 'http://littlefreelibrary.force.com/servlet/servlet.FileDownload?file=';
  
  //add all attachments as photos
  var i = 1;
  while (i > 0){
    if (lib['attachment' + i.toString()]){
      photos.push(link + lib['attachment' + i.toString()]);
      i++;
    } else {
      break;
    }
  }
  
  libObj.photo_url = photos;
  
  return libObj;
}

/** 
 * Format located details in suitable array for POST request
 *
 * zipcode : ['91016','ZipCode',null,null]
 * cityState : ['MonroviaSEPERATECalifornia','CityState',null,null]
 * city : ['BLANKSEPERATECalifornia','CityState',null,null]
 * state : ['MonroviaSEPERATEBLANK','CityState',null,null]
 */ 
function formatLocation(){
  var located = [];
  if (opts.city || opts.state){
    var cityState = [];
    cityState[0] = opts.city ? opts.city : 'BLANK';
    cityState[1] = 'SEPERATE';
    cityState[2] = opts.state ? opts.state : 'BLANK';
    
    located[0] = cityState.join('');
    located[1] = 'CityState';
  } else if (opts.zip){
    located[0] = opts.zip;
    located[1] = 'ZipCode';
  }
  
  if (located.length){
    located[2] = null;
    located[3] = null;
  } 
  return located;
}

//Connect to MongoDB
mongoose.connect(secrets.db);
mongoose.connection.on('error', function(){
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

if (process.argv.indexOf('--help') != -1 ||
    process.argv.indexOf('-h') != -1){
  usage();
}

var partial = false; //scrape all libraries

//TODO validate parameter data
// optional params
for (var key in opts){
  if (process.argv.indexOf('--' + key) != -1){  
    opts[key] = process.argv[process.argv.indexOf('--' + key) + 1]; 
    partial = true;
  } else if (process.argv.indexOf('-' + key.charAt(0)) != -1){
    opts[key] = process.argv[process.argv.indexOf('-' + key.charAt(0)) + 1];
    partial = true; 
  } 
}

//TODO support full scrape
if (partial){
  scrape(storeLibs);
} else{
  console.log('Sorry, full scrape is not supported yet...\n');
  usage();
}

