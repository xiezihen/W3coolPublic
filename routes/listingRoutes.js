
//Schemas
var model = require('../models/schema');

// handles filtered listing searches
exports.search = function(req, res) {
    console.log(req.query);

    // if the following queries exist, validate accordingly
    if (req.query.textbook) {
        req.checkQuery('textbook', '*Input must be at most 25 characters').isLength({max: 25});

    };
    if (req.query.course) {
        req.checkQuery('course', '*Please type valid course code (eg. CSC108)').isCourse();

    };
    if (req.query.seller) {
        req.checkQuery('seller', '*Input must be alphanumeric and at most 25 characters').isAlphanumeric().isLength({max:25});

    };
    if (req.query.isbn) {
        req.checkQuery('isbn', '*Please type valid ISBN (eg. 9780538498869)').isISBN();

    };
    
    // captures validation errors and maps them
    var errors = req.validationErrors();
    var mappedErrors = req.validationErrors(true);
        
    console.log(errors);
        
    if (errors) { // ***Validation Fails***
        
        // stores error messages per query
        var errorMsgs = { 'errors': {} };
        
        if (mappedErrors.textbook) {
            errorMsgs.errors.error_textbook = mappedErrors.textbook.msg;
        };
        if (mappedErrors.course) {
            errorMsgs.errors.error_course = mappedErrors.course.msg;
        };
        if (mappedErrors.seller) {
            errorMsgs.errors.error_seller = mappedErrors.seller.msg;
        };
        if (mappedErrors.isbn) {
            errorMsgs.errors.error_isbn = mappedErrors.isbn.msg;
        };
        
        // sends back error data
        console.log(errorMsgs.errors);
        res.json(errorMsgs);
        
    } else { // ***Validation Succeeds***
        
        // stores requested search parameters
        var search = {};
        
        // populates search object
        if (req.query.textbook) {
            // searches case-insensitive keywords
            search['keywords'] = {$regex: new RegExp('^' + req.query.textbook.toLowerCase(), 'i')};
            
        };
        if (req.query.course) {
            search['courses'] = req.query.course;
            
        };
        if (req.query.seller) {
            search['seller'] = req.query.seller;
            
        };
        if (req.query.isbn) {
            search['isbn'] = req.query.isbn;
            
        };

        console.log(search);
        
        // sends seller contact info ONLY when logged in
        if (!req.session.user) {
            searchWithoutContact(search, res);
        } else {
            searchDB(search, res);
        }
    }
}

exports.deleteListing = function(req, res) {

    model.listings.remove(req.body, function(err) {

        res.json({"msg": "Listing successfully deleted."})
    })
}

// searches database with populated search object
// formats a response containing listing objects found
// includes seller contact info
function searchDB(search, res) {

    // stores formatted response of found listings 
    matches = [];

    // searches for filtered listings
    model.listings.find(search, function(err, results) {
        dbError(err, res);
        
        if (results.length == 0) {
            res.send({error: true, msg: "No matches"});
            
        } else { // succeeds listing search
            
            // a counter to signal when to send response
            // *necessary due to database query delay
            var counter = results.length;
            
            // iterate through each result
            results.forEach(function(doc, err) {

                // searches for the seller of current 'doc'
                model.users.findOne({username: doc.seller}, function (err, user) {
                    dbError(err, res);
                    
                    if (!user) {
                        res.send({error: true, msg: "this shouldn't happen"});
                        
                    } else { //succeeds user search
                        
                        // populates matches with formatted response
                        matches.push({
                            "listing": doc,
                            "seller": {
                                "username": user.username,
                                "email": user.email,
                                "phonenum": user.phone
                            }
                        });

                        // only sends response ONCE all results have been iterated through
                        if (--counter == 0) {
                            res.json({"sData": matches})
                        };
                    };
                });
            });
        };
    });
};

// same as 'searchDB' excluding contact info and counter
function searchWithoutContact(search, res) {
    matches = [];

    model.listings.find(search, function(err, results) {
        dbError(err, res);

        if (results.length == 0) {
            res.send({error: true, msg: "No matches"});
            
        } else {
            results.forEach(function(doc, err) {
                matches.push({ "listing": doc });
                    
            });
            res.json({"sData": matches});
        };
    });
};


// sends common db query error message
function dbError(err, res) {
    if (err) {
        console.log(err);
        res.json({"error": true, "msg": err});
        //res.json({"error": true, "msg": "An error has occured. Please try again later."});
    };
};
