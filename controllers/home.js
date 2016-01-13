/**
 * GET /
 * Home page.
 */
function is_mobile(req) {
  var ua = req.header('user-agent');
  if (/mobile/i.test(ua)) return true;
  else return false;
};

exports.index = function(req, res) {
  if (is_mobile(req)) res.render('mobile/home', {
    title: ''
  });
  else res.render('home', {
    title: 'Home - '
  });
};