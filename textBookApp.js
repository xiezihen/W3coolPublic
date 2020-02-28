var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var nunjucks = require('nunjucks');
var expressValidator = require('express-validator');

// Reference to routes
var listings = require('./routes/listingRoutes.js');
var login = require('./routes/loginRoutes.js');
var profile = require('./routes/profileRoutes.js');
var sUser = require('./routes/sessionRoutes.js');

var app = express();

// View engine
nunjucks.configure('views', { autoescape: true, express: app });
app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/'));


// Set up to use sessions
app.use(session({ secret: 'w3coolsupersecretcode', resave: false, saveUninitialized: false}));


// The request body is received on GET or POST.
// A middleware that just simplifies things a bit.
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));


// Create custom validators here
app.use(expressValidator({
    customValidators: {

        isPhone: function(value) {
            return value.search( /\d{3}?-?\d{3}-?\d{4}$/ ) !== -1;
        },
        isCourses: function(value) {
            var valid = true;
            for (var i=0; i<value.length; i++) {
                if (value[i].search( /[A-Z]{3}[\d]{3}/ ) === -1 || value[i].length != 6) {
                    valid = false;
                }
            }
            return valid;
        },
        isCourse: function(value) {
            return value.search( /[A-Z]{3}[\d]{3}/ ) !== -1 || value.length != 6;
        },
        isStuEmail: function(value) {
            return value.search( /.+(@mail.utoronto.ca)/ ) !== -1;
        },
        isPrice: function(value) {
            return value.search( /^\d+(?:\.\d{0,2})$/ ) !== -1;
        }
    }
}));


// HTTP request methods (GET, POST, PUT, DELETE)

// gets web pages
// default html file = visitor view
// scripts (dynamic html) manage the user/admin view
app.get('/', function (req, res) {
  res.render('index.html');
});

app.get('/login', function(req,res) {
    res.render('login.html');
});

app.get('/profile', profile.profile);
app.get('/username', login.signin);
//app.get('/books', profile.findAll);
app.get('/user', profile.getUser);

app.put('/updateUserInfo/:username', profile.updateInfo);

app.get('/getBook', profile.getBook);
app.post('/listings', profile.addListing);

app.get('/session', sUser.status);
app.get('/sessionName', sUser.name)
app.get('/sessionAccount', sUser.account);


// add API URLS here
app.post('/register', login.addUser);
app.post('/login', login.signin);
app.get('/logout', login.signout);
app.get('/listings', listings.search);
app.delete('/listings', listings.deleteListing);


//starts server
app.listen(process.env.PORT || 3000);
console.log('Listening on port 3000');
