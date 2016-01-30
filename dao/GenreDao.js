/**
 * Get all genres within a specified library
 * @param int libraryId {null}
 * @return genres
 */
exports.getGenreByLibraryId = function(libraryId, res) {
    res.status(200);
};

/**
 * Get all books within a specified distance from location
 * @param Location loc {}
 * @param int milesRadius {}
 * @return genres
 */
exports.getGenreByDistance = function(loc, milesRadius, res) {
    res.status(200);
};

/**
 * Search genre  for specified text
 * @param String text {null}
 * @return results
 */
exports.searchBookGenreCity = function(text, res) {
    res.status(200);
};