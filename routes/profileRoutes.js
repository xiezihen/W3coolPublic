/*
//// ROUTES CALLBACK FUNCTIONS ////

write callback functions here
example:

exports.mycallbackfunction = function(req, res) {

}
*/

//Schemas
var model = require('../models/schema');

exports.profile = function(req, res) {
    if (!req.session.user){
            res.render('login.html');
    }else {
        if (!req.query.user) {

         //res.render("profile.html");
         model.users.findOne({username: req.session.user.username}, function(err, user){
            dbError(err, res);
            res.render('profile.html', {
                    username: user.username,
                    firstname: user.firstName,
                    lastname: user.lastName,
                    campus: user.campus,
                    year: user.yearOfStudy,
                    email: user.email,
                    phone: user.phone
                });
         })

        } else {
            model.users.findOne({username: req.query.user}, function (err, user) {
                dbError(err, res);

                if (!user) {
                    res.send({error: true, msg: "The account" + req.query.user + " does not exist"});
                } else {
                    console.log(user);

                    res.render('viewProfile.html', {
                        username: user.username,
                        firstname: user.firstName,
                        lastname: user.lastName,
                        campus: user.campus,
                        year: user.yearOfStudy,
                        email: user.email,
                        phone: user.phone
                    });
                }

            });
        }
        }


}

exports.getUser = function(req, res) {


    if (!req.session.user){
        res.render('login.html');
    }else{
        res.send(req.session.user);

    }
}

// get the books for the user in the session.
exports.getBook = function(req, res) {

	var username = req.session.user.username;

	model.listings.find({seller: username}, function(err, allBooks) {
		if (err) {
			console.log(err);
			res.json({"error": true, "msg": "An error has occured. Please try again later."});
		}
		res.send(allBooks);
    });
}

function dbError(err, res) {
    if (err) {
        console.log(err);
        res.json({"error": true, "msg": err});
        //res.json({"error": true, "msg": "An error has occured. Please try again later."});
    }
}

exports.updateInfo = function(req, res) {
     var value = req.body.value;
     var data = req.body.data;

     model.users.findOne({username: req.params.username}, function(err, user){
  
        if (value == "firstName"){
            user.firstName = data;
        }else if (value == 'lastname'){
            user.lastName = data;

        }else if (value == 'campus'){
            user.campus = data;

        }else if (value == 'yearOfStudy'){
            user.yearOfStudy = data;

        }else if (value == 'email'){
            user.email = data;

        }else if (value == 'phone'){
            user.phone = data;

        }



        user.admin = "false";


        user.save(function(err, updateObject){
            if(err) {
                console.log(err);
                res.status(500).send();
            } else {
                res.send(user);
                console.log(user);

            }


        })


     })



}

exports.addListing = function(req, res){
    // need to validate isbn and price

    req.checkBody('isbn', '*ISBN need to be numeric wtih 9 to 15 characters.').isNumeric().isLength({min: 9, max: 15});
    req.checkBody('price', '*Must be a valid price. e.g 10.00').isPrice();

    //Optional fields TODO
    if (req.body.courses != ''){
        req.checkBody('courses', '*Must be valid course(s)').isCourses();
    };
    // do not need to check Notes;

    // check for required fields
    req.checkBody('textbook', '*Textbook name is required.').notEmpty();
    req.checkBody('author', '*Author name is required.').notEmpty();
    req.checkBody('isbn', '*isbn is required.').notEmpty();
    req.checkBody('price', '*Price is required.').notEmpty();

    // captures and maps validation errors
    var errors = req.validationErrors();
    var mappedErrors = req.validationErrors(true);

    if (errors) { // ***Validation Fails***

        // stores error messages per body parameter
        var errorMsgs = { 'errors': {} };

        if (mappedErrors.textbook) {
            errorMsgs.errors.error_textbook = mappedErrors.textbook.msg;
        };
        if (mappedErrors.author) {
            errorMsgs.errors.error_author = mappedErrors.author.msg;
        };
        if (mappedErrors.isbn) {
            errorMsgs.errors.error_isbn = mappedErrors.isbn.msg;
        };
        if (mappedErrors.courses) {
            errorMsgs.errors.error_courses = mappedErrors.courses.msg;
        };
        if (mappedErrors.price) {
            errorMsgs.errors.error_price = mappedErrors.price.msg;
        };

        res.json(errorMsgs);

    } else {
        var newListing = new model.listings();

        newListing.seller = req.body.seller;
        newListing.textbook = req.body.textbook;
        newListing.author = req.body.author;
        newListing.isbn = req.body.isbn;
        newListing.courses = req.body.courses;
        newListing.price = req.body.price;
        newListing.notes = req.body.notes;

        newListing.save(function(err, savedListing) {
            if (err) {
                console.log(err);
                res.send({error: true, msg: "  Error: The listing was not successfully added"})

            } else {
                res.status(200).json({msg: "  The listing was successfully added and it will be visible to others."});
            };
        });

    }
}
