const User = require('../model/model.user');

const bcrypt = require('bcrypt');
const saltRounds = 10;


exports.create = async (req, res) => {
    return res.render('user/create');
}

exports.index = async (req, res) => {
    try{
        const users = await User.find();
        return res.render('user/index', {users: users});
    }catch(err){
        return res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    }
}

exports.store = async (req, res) => {
    console.log(req.body.password)
    bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash
        });
    
        newUser.save();
        res.redirect('/user');
    });
}

exports.login = (req, res) => {
    return res.render('user/login');
}

exports.verifyUser = async (req, res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;
        
        if(email == null || password == null)
        {
            res.send("Fill Username or Password");
        }

        const user = await User.findOne({'email': email});

        const match = await bcrypt.compare(password, user.password);

        if(match) {
            res.send("Login Successful");
        }else{
            res.send("Username or password Invalid");
        }
    }catch(err)
    {
        console.log(err);
    }
}