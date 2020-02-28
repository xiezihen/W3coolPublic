//the two schemas(user, listing) are included
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//User Schema
var userSchema = new Schema(
    {
        username: {
            type: String, required: true, unique: true
        },
        password: {
            type: String, required: true
        },
        admin: {
            type: Boolean, required: true
        },
        firstName: {
            type: String, required: true
        },
        lastName: {
            type: String, required: true
        },
        campus: {
            type: String
        },
        yearOfStudy: {
            type: String
        },
        phone: {
            type: String, required: true
        },
        email: {
            type: String, required: true
        },
        course: {
            type: [String]
        },
    },
    {
            collection: "users"
    }
)

//listing Schema
var listingSchema = new Schema(
    {
        seller: {
            type: String, required: true
        },
        textbook: {
            type: String, required: true
        },
        author: {
            type: String, required: true
        },
        isbn: {
            type: String, required: true
        },
        courses: {
            type: [String]
        },
        price: {
            type: String, required: true,
        },
        notes: {
            type: String
        },
        keywords: {
            type: [String]
        }
    },
    {
            collection: "listings"
    }
)

// Doc for Mongoose Connections: http://mongoosejs.com/docs/connections
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://user1:abc123@ds119578.mlab.com:19578/w3cool');

var users = mongoose.model('user', userSchema);
var listings = mongoose.model('listing', listingSchema);

module.exports = {
    users: users,
    listings: listings
};
