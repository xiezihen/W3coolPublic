
//Schemas
var model = require('../models/schema');

// handles registration
exports.addUser = function(req, res) {

    //Input Validation
    req.checkBody('confirm', '*Password does not match.').equals(req.body.password);
    req.checkBody('email', '*Must be a valid UofT email.').isStuEmail();
    req.checkBody('phonenum', '*Must be a valid phone number.').isPhone();
    req.checkBody('username', '*Username must be alphanumeric with 5 to 15 characters.').isAlphanumeric().isLength({min: 5, max: 15});
    req.checkBody('password', '*Password must be alphanumeric with 5 to 15 characters.').isAlphanumeric().isLength({min: 5, max: 15});
    req.checkBody('confirm', '*Must be alphanumeric with 5 to 15 characters.').isAlphanumeric().isLength({min: 5, max: 15});
    req.checkBody('firstname', '*Must be alphabetic and under 25 characters.').isLength({min: 1, max: 25}).isAlpha();
    req.checkBody('lastname', '*Must be alphabetic and under 25 characters.').isLength({min: 1, max: 25}).isAlpha();

    //Optional fields
    if (req.body.courses != ''){
        req.checkBody('courses', '*Must be valid course(s)').isCourses();
    };
    if (req.body.year != ''){
        req.checkBody('year', '*Must be valid year.').isInt({min: 1, max: 9});
    };

    //Validation - required fields
    req.checkBody('username', '*Username is required.').notEmpty();
    req.checkBody('password', '*Password is required.').notEmpty();
    req.checkBody('confirm', '*Please confirm password.').notEmpty();
    req.checkBody('firstname', '*First name is required.').notEmpty();
    req.checkBody('lastname', '*Last name is required.').notEmpty();
    req.checkBody('email', '*UofT email is required.').notEmpty();
    req.checkBody('phonenum', '*Phone number is required').notEmpty();

    // captures and maps validation errors
    var errors = req.validationErrors();
    var mappedErrors = req.validationErrors(true);

    console.log(errors);

    if (errors) { // ***Validation Fails***

        // stores error messages per body parameter
        var errorMsgs = { 'errors': {} };

        if (mappedErrors.username) {
            errorMsgs.errors.error_username = mappedErrors.username.msg;
        };
        if (mappedErrors.password) {
            errorMsgs.errors.error_password = mappedErrors.password.msg;
        };
        if (mappedErrors.confirm) {
            errorMsgs.errors.error_confirm = mappedErrors.confirm.msg;
        };
        if (mappedErrors.firstname) {
            errorMsgs.errors.error_firstname = mappedErrors.firstname.msg;
        };
        if (mappedErrors.lastname) {
            errorMsgs.errors.error_lastname = mappedErrors.lastname.msg;
        };
        if (mappedErrors.courses) {
            errorMsgs.errors.error_courses = mappedErrors.courses.msg;
        };
        if (mappedErrors.year) {
            errorMsgs.errors.error_year = mappedErrors.year.msg;
        };
        if (mappedErrors.email) {
            errorMsgs.errors.error_email = mappedErrors.email.msg;
        };
        if (mappedErrors.phonenum) {
            errorMsgs.errors.error_phonenum = mappedErrors.phonenum.msg;
        };

        // sends back error data
        console.log(errorMsgs.errors);
        res.json(errorMsgs);

    } else { // ***Validation Succeeds***

        // creating new userSchema object
        var newUser = new model.users();

        // setting registration data into new user object
        newUser.username = req.body.username;
        newUser.password = req.body.password;
        newUser.admin = false;
        newUser.firstName = req.body.firstname;
        newUser.lastName = req.body.lastname;
        newUser.campus = req.body.campus;
        newUser.yearOfStudy = req.body.year;
        newUser.phone = req.body.phonenum;
        newUser.email = req.body.email;
        newUser.course = req.body.courses;

        // saves newUser into database
        newUser.save(function(err, savedUser) {
            if (err) {
                console.log(err);
                res.send({error: true, msg: "  Error: Username already taken."})

            } else {
                res.status(200).json({msg: "  Registration was successful! Please log in with your new account."});
            };
        });
    };
};

exports.signin = function(req, res) {

    //Input validation
    req.checkBody('username', '*Username must be alphanumeric with 5 to 15 characters.').isAlphanumeric().isLength({min: 5, max: 15});
    req.checkBody('password', '*Password must be alphanumeric with 5 to 15 characters.').isAlphanumeric().isLength({min: 5, max: 15});

    //Required fields
    req.checkBody('username', '*Please enter your username first.').notEmpty();
    req.checkBody('password', '*Password is required.').notEmpty();

    // captures validation errors and maps them
    var errors = req.validationErrors();
    var mappedErrors = req.validationErrors(true);

    if (errors) { // ***Validation Fails***

        // stores error messages per body parameter
        var errorMsgs = { 'errors': {} };

        if (mappedErrors.username) {
            errorMsgs.errors.error_username = mappedErrors.username.msg;
        };
        if (mappedErrors.password) {
            errorMsgs.errors.error_password = mappedErrors.password.msg;
        };

        // sends back error data
        console.log(errorMsgs);
        res.json(errorMsgs);

    } else { // ***Validation Succeeds***

        // searches database for user object that matches login request
        model.users.findOne({username: req.body.username, password: req.body.password}, function (err, user) {
            if (err) {
                console.log(err);
                res.json({"error": true, "msg": "An error has occured. Please try again later."});

            };
            if(!user) {
                res.json({"error": true, "msg": "Invalid username or password"});

            } else {

                // upon succession creates user session containing the user object
                // redirects to homepage
                req.session.user = user;
                res.status(200).json({redirect: '/'});
            };
        });
    };
};

// handles log out (deletes user session)
exports.signout = function(req, res) {
    req.session.destroy();
    res.redirect('/login');
};
