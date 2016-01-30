var libraryDao = require('../dao/libraryDao.js');

/**
 * Get all libraries within a distance radius of the provided location
 * @param Location loc {null}
 * @param int milesRadius {}
 * @return libraries
*/
exports.getLibrariesByLocationAndDistance = function(req, res){
    libraryDao.getLibrariesByLocationAndDistance(req.query.loc, req.query.milesRadius, res)
};
