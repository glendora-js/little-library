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