var User = require('../models/User');

//Admin

/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
  res.render('admin/home', {
    title: 'Home'
  });
};

exports.user_list = function(req, res) {
	User.find( function(err, users){
		console.log('testing', users)
		res.render('admin/users', {
		    users: users
		});
	})
}