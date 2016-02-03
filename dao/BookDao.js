var Book = require('../models/Book'),
    mongoose = require('mongoose');

/**
 * Check in library book
 * @param int bookId
 * @return int status
 */
exports.checkInBook = function(bookId) {
    return(200);
};

/**
 * Check out library book
 * @param int bookId
 * @return int
 */
exports.checkOutBook = function(bookId) {
    return(200);
};

/**
 * Check in new library book by title
 * @param String text {}
 * @return int
 */
exports.checkInNewBookByTitle = function(text) {
    return(200);
};

/**
 * Check in new library book by isbn
 * @param int isbn {}
 * @return int
 */
exports.checkInNewBookByISBN = function(isbn, library_id) {
    var book = new Book(formatNewBook(isbn, library_id));
    book.save(function (err) {
        if (err){
            //successful insert
            return(500);
        } else {
            return(200);
        }
    });
    return;
};

/**
 * Get all books within a specified library
 * @param int libraryId {null}
 * @return books
 */
exports.getBooksByLibraryId = function(libraryId) {
    return ("1234567890");
};

/**
 * Get all books within a specified distance from location
 * @param Location loc {}
 * @param int milesRadius {}
 * @return books
 */
exports.getBooksByDistance = function(loc, milesRadius) {
    return("1234567890");
};

/**
 * Get all book information for specified book
 * @param int bookId {}
 * @return book
 */
exports.getBookById = function(bookId) {
    return "1234567890";
};

function formatNewBook(isbn, library_id){
    var bookObj = {
        isbn: isbn,
        library_id: library_id,
        checked_out: false,
        last_check_in_dt: Date.now(),
        last_check_out_dt: null,
        checked_out_user_id: null
    };
    return bookObj;
}