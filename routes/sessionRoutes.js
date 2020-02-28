// returns session status of website user
exports.status = function(req, res) {
    
    if (!req.session.user) {
        res.json({"session": "visitor"});
        
	} else if (req.session.user.admin == true) {
        res.json({"session": "admin"});
        
	} else {
        res.json({"session": "user"}); 
    }
}
    
// returns first name of user in current session
exports.name = function(req, res) {
    if (!req.session.user) {
        res.json({});
        
    } else {
        res.json({"name": req.session.user.firstName});
    }
}

// returns username of current session
exports.account = function(req, res) {
    if (!req.session.user) {
        res.json({});
    } else {
        res.json({"username": req.session.user.username})
    }
}
