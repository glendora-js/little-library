var bookDao = require('../dao/bookDao.js'),
    genreDao = require('../dao/genreDao.js'),
    libraryDao = require('../dao/libraryDao.js');
/**
 * Check in library book
 * @param int bookId
 * @return int
 */
exports.checkInBook = function(req, res) {
    res.status(bookDao.checkInBook(req.query.bookId));
    res.end();
};

/**
 * Check out library book
 * @param int bookId
 * @return int
*/
exports.checkOutBook = function(req, res) {
    res.status(bookDao.checkOutBook(req.query.bookId));
    res.end();
};

/**
 * Check in new library book by title
 * @param String text {}
 * @return int
*/
exports.checkInNewBookByTitle = function(req, res) {
    res.status(bookDao.checkInNewBookByTitle(req.query.text));
    res.end();
};

/**
 * Check in new library book by isbn
 * @param int isbn {}
 * @return int
 */
exports.checkInNewBookByISBN = function(req, res) {
    console.log("req.session.library_id=" + req.session.library_id);
    bookDao.checkInNewBookByISBN(req.query.isbn, req.session.library_id);
    res.end();
};

/**
 * Get all genres within a specified library
 * @param int libraryId {null}
 * @return genres
*/
exports.getGenreByLibraryId = function(req, res) {
    res.status(genreDao.getGenreByLibraryId(req.query.libraryId));
    res.end();
};

/**
 * Get all books within a specified library
 * @param int libraryId {null}
 * @return books
*/
exports.getBooksByLibraryId = function(req, res) {
    res.json({"isbn": bookDao.getBooksByLibraryId(req.query.libraryId, req.query.milesRadius)});
    res.end();
};

/**
 * Get all books within a specified distance from location
 * @param Location loc {}
 * @param int milesRadius {}
 * @return books
*/
exports.getBooksByDistance = function(req, res) {
    return bookDao.getBooksByDistance(req.query.loc, req.query.milesRadius, function(isbn) {
        res.json({"isbn": isbn});
    });
    res.end();
};


/**
 * Get all books within a specified distance from location
 * @param Location loc {}
 * @param int milesRadius {}
 * @return genres
*/
exports.getGenreByDistance = function(req, res) {
    return genreDao.getGenreByDistance(req.query.loc, req.query.milesRadius, res);
    res.end();
};

/**
 * Get all book information for specified book
 * @param int bookId {}
 * @return book
*/
exports.getBookById = function(req, res) {
    return bookDao.getBookById(req.query.bookId);
    res.end();
};

/**
 * Search books, genre and libraries for specified text
 * @param String text {null}
 * @return results
*/
exports.searchBookGenreCity = function(req, res) {
    var bookResults = bookDao.searchBooks(req.query.text);
    var genreResults = genreDao.searchGenre(req.query.text);
    var cityResults = libraryDao.searchLibrariesByCity(req.query.text);
    var results = (bookResults, genreResults, cityResults);
    return results;
};

//module.exports = {bookServices:bookServices};