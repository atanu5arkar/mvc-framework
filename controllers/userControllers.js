import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserModel from "../models/User.js";

function homepageController(req, res) {
    res.statusCode = 200;
    return res.end(JSON.stringify({ msg: 'Welcome to the Home Route.' }));
}

async function registrationController(req, res) {
    try {
        const body = JSON.parse(req.data.body);
        let { fname, email, password } = body;

        const user = await UserModel.findOne({ email });

        if (user) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ msg: 'User is already Registered!' }));
        }
        password = await bcrypt.hash(password, 10);
        await new UserModel({ fname, email, password }).save();

        res.statusCode = 201;
        return res.end(JSON.stringify({ msg: 'User Registered Successfully!' }));
    } catch (error) {
        throw error;
    }
}

async function loginController(req, res) {
    try {
        const body = JSON.parse(req.data.body);
        let { email, password } = body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            res.statusCode = 401;
            return res.end(JSON.stringify({ msg: 'Invalid Credentials!' }));
        }
        const isPasswdValid = await bcrypt.compare(password, user.password);

        if (!isPasswdValid) {
            res.statusCode = 401;
            return res.end(JSON.stringify({ msg: 'Invalid Credentials!' }));
        }
        const token = jwt.sign({ email }, 'sherl0ck', { expiresIn: '1h' });

        res.statusCode = 200;
        return res.end(JSON.stringify({ msg: 'Logged In Successfully!', token }));
    } catch (error) {
        throw error;
    }
}

async function getUserDataController(req, res) {
    try {
        const token = req.headers['auth-key'];

        if (!token) {
            res.statusCode = 401;
            return res.end(JSON.stringify({ msg: 'Access Denied!' }));
        }
        const { email } = jwt.verify(token, 'sherl0ck');
        const userData = await UserModel.findOne({ email }, '-_id -__v -password');
        
        res.statusCode = 200;
        return res.end(JSON.stringify(userData));
        
    } catch (error) {
        if (error.name == 'JsonWebTokenError') {
            res.statusCode = 401;
            return res.end(JSON.stringify({ msg: 'Access Denied!' }));
        }
        throw error;
    }
}

export { homepageController, registrationController, loginController, getUserDataController };