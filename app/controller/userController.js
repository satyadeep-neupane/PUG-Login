const User = require('../model/model.user');

const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');



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
    const ifUserExists = await User.find({email: req.body.email});
    
    if(ifUserExists.length >= 1){
        return res.redirect('/user');
    }

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

exports.attemptLogin = async (req, res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;
        
        if(email == '' || password == '')
        {
            return res.send("Fill Username or Password");
        }

        const user = await User.findOne({'email': email});

        const match = await bcrypt.compare(password, user.password);

        if(match) {
            const accessToken = generateAccessToken(generatePayload(user));
            const refreshToken = generateRefreshToken(generatePayload(user));
            res.cookie('token', accessToken)
                .send("Login Successful");
        }else{
            res.send("Username or password Invalid");
        }
    }catch(err)
    {
        console.log(err);
    }
}

exports.delete = async (req, res) => {
    try{
        const id = req.params.id;
        const user = await User.findByIdAndRemove(id);
        res.redirect('/user');
    }catch(err){
        return res.status(500).send({
            message: err.message || "Some error occurred while deleting user."
        });
    }
}

function generateAccessToken(payload) {
    // expires after half and hour (1800 seconds = 30 minutes)
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}

function generateRefreshToken(payload) {
    // expires after half and hour (1800 seconds = 30 minutes)
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
}

function generatePayload(user)
{
    return {
        sub: user._id,
        email: user.email,
        role: user.role,
        iat: Math.floor(Date.now() / 1000) - 30
    }
}
