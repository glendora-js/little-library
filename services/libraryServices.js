var libraryDao = require('../dao/libraryDao.js');

/**
 * Get all libraries within a distance radius of the provided location
 * @param Location loc {null}
 * @param int kilometerRadius {}
 * @return libraries
*/
exports.getLibrariesByDistance = function(req, res){
    libraryDao.getLibrariesByDistance(req.query.location, req.query.kilometerRadius, function(libraries) {
        req.session.libraries = libraries;
        res.json(libraries);
    });
};
