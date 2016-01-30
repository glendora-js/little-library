var Book = require('../models/Book'),
    mongoose = require('mongoose'),
    secrets = require('../config/secrets');

/**
 * Check in library book
 * @param int bookId
 * @return int
 */
exports.checkInBook = function(bookId, res) {
    res.status(200);
};

/**
 * Check out library book
 * @param int bookId
 * @return int
 */
exports.checkOutBook = function(bookId, res) {
    res.status(200);
};

/**
 * Check in new library book by title
 * @param String text {}
 * @return int
 */
exports.checkInNewBookByTitle = function(text, res) {
    res.status(200);
};

/**
 * Check in new library book by isbn
 * @param int isbn {}
 * @return int
 */
exports.checkInNewBookByISBN = function(isbn, library_id, res) {
    var book = new Book(formatNewBook(isbn, library_id));
    book.save(function (err) {
        if (err){
            //successful insert
            res.status(500).send('Error inserting book into database!');
        } else {
            res.status(200);
        }
    });
    return;
};

/**
 * Get all books within a specified library
 * @param int libraryId {null}
 * @return books
 */
exports.getBooksByLibraryId = function(libraryId, res) {
    res.json({"title": "The Martian (Mass Market Mti)", "authors": ["Andy Weir"],
            "publisher": "Broadway Books",
            "publishedDate": "2015-08-18",
            "description": "Six days ago, astronaut Mark Watney became one of the first people to walk on Mars. Now, he's sure he'll be the first person to die there. After a dust storm nearly kills him and forces his crew to evacuate while thinking him dead, Mark finds himself stranded and completely alone with no way to even signal Earth that he's alive--and even if he could get word out, his supplies would be gone long before a rescue could arrive. Chances are, though, he won't have time to starve to death. The damaged machinery, unforgiving environment, or plain-old \"human error\" are much more likely to kill him first. But Mark isn't ready to give up yet. Drawing on his ingenuity, his engineering skills--and a relentless, dogged refusal to quit--he steadfastly confronts one seemingly insurmountable obstacle after the next. Will his resourcefulness be enough to overcome the impossible odds against him?",
            "industryIdentifiers": [
                {
                    "type": "ISBN_10",
                    "identifier": "110190500X"
                },
                {
                    "type": "ISBN_13",
                    "identifier": "9781101905005"
                }
            ],
            "readingModes": {
                "text": false,
                "image": false
            },
            "pageCount": 448,
            "printType": "BOOK",
            "categories": [
                "Fiction"
            ],
            "averageRating": 4.0,
            "ratingsCount": 1302,
            "maturityRating": "NOT_MATURE",
            "allowAnonLogging": false,
            "contentVersion": "preview-1.0.0",
            "imageLinks": {
                "smallThumbnail": "http://books.google.com/books/content?id=ZYUdswEACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api",
                "thumbnail": "http://books.google.com/books/content?id=ZYUdswEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api"
            },
            "language": "en",
            "previewLink": "http://books.google.com/books?id=ZYUdswEACAAJ&dq=isbn:9781101905005&hl=&cd=1&source=gbs_api",
            "infoLink": "http://books.google.com/books?id=ZYUdswEACAAJ&dq=isbn:9781101905005&hl=&source=gbs_api",
            "canonicalVolumeLink": "http://books.google.com/books/about/The_Martian_Mass_Market_Mti.html?hl=&id=ZYUdswEACAAJ"
        });
};

/**
 * Get all books within a specified distance from location
 * @param Location loc {}
 * @param int milesRadius {}
 * @return books
 */
exports.getBooksByDistance = function(loc, milesRadius, res) {
    return res.json({"isbn": "1234567890"});
};

/**
 * Get all book information for specified book
 * @param int bookId {}
 * @return book
 */
exports.getBookById = function(bookId, res) {
    return res.json({"isbn": "1234567890"});
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
