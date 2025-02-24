const user = require("../models/user");
const nodemailer = require("nodemailer");
const crypto = require("crypto");


const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'mohitkarande2004@gmail.com',
        pass: 'chig lgxd wkov iqvf'
    }
});

function getSignin(req, res) {
    return res.json({signin: "please sign in"});
}

async function createUser(req, res) {
    const {name, UserName, email, password} = req.body;
    
    if (!name || !UserName || !email || !password) {
        return res.status(400).json({error: "All fields are required!"});
    }
    
    try {
        
        const verificationToken = crypto.randomBytes(32).toString('hex');
        
        
        const newUser = await user.create({
            name,
            UserName,
            email,
            password,
            verificationToken
        });
        
        const verificationLink = `http://localhost:8500/user/verify/${verificationToken}`;
        
        const mailOptions = {
            from: 'mohitkarande2004@gmail.com',
            to: email,
            subject: 'Email Verification for InstaHang',
            html: `
                <h1>Welcome to InstaHang!</h1>
                <p>Hello ${name},</p>
                <p>Please click the link below to verify your email address:</p>
                <a href="${verificationLink}">Verify Email</a>
                <p>If you did not create this account, please ignore this email.</p>
            `
        };
        
        await transporter.sendMail(mailOptions);
        
        return res.status(201).json({
            message: "User created successfully. Please check your email to verify your account."
        });
    } catch (error) {
        console.error("User creation error:", error);
        if (error.code === 11000) {  
            return res.status(400).json({error: "Email already exists"});
        }
        return res.status(500).json({error: "Server error"});
    }
}

async function AuthenticateUser(req, res) {
    const {email, password} = req.body;
    if (!email || !password)
        return res.status(400).json({error: "All fields are required"});
    try {
        const User = await user.matchPassword(email, password);
        console.log("Authenticated user:", User);
        return res.status(200).json({message: "User Logged In Successfully"});
    } catch (error) {
        console.error("Error during login:", error.message);
        return res.status(401).json({error: error.message});
    }
}

async function verifyEmail(req, res) {
    try {
        const { token } = req.params;
        
        // Find user with the token
        const User = await user.findOne({
            verificationToken: token
        });
        
        if (!User) {
            return res.status(400).json({
                error: "Invalid verification token"
            });
        }
    
        await user.findOneAndUpdate(
            { _id: User._id },
            { 
                isVerified: true,
                verificationToken: undefined,
                verificationTokenExpiry: undefined
            }
        );
        
        return res.end("Email verified Succesfully"); 
        
    } catch (error) {
        console.error("Verification error:", error);
        return res.status(500).json({error: "Server error"});
    }
}

// Resend verification email if needed
async function resendVerificationEmail(req, res) {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({error: "Email is required"});
    }
    
    try {
        const User = await user.findOne({ email });
        
        if (!User) {
            return res.status(404).json({error: "User not found"});
        }
        
        if (User.isVerified) {
            return res.status(400).json({error: "Email is already verified"});
        }
        
        // Generate new verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        
        User.verificationToken = verificationToken;
        
        await User.save();
        
        // Create verification link
        const verificationLink = `http://localhost:8500/user/verify/${verificationToken}`;
        
        // Send verification email
        const mailOptions = {
            from: 'mohitkarande2004@gmail.com',
            to: email,
            subject: 'Email Verification for InstaHang',
            html: `
                <h1>Welcome to InstaHang!</h1>
                <p>Hello ${User.name},</p>
                <p>Please click the link below to verify your email address:</p>
                <a href="${verificationLink}">Verify Email</a>
                <p>If you did not create this account, please ignore this email.</p>
            `
        };
        
        await transporter.sendMail(mailOptions);
        
        return res.status(200).json({
            message: "Verification email resent. Please check your inbox."
        });
        
    } catch (error) {
        console.error("Error resending verification email:", error);
        return res.status(500).json({error: "Server error"});
    }
}

module.exports = {
    getSignin,
    createUser,
    AuthenticateUser,
    verifyEmail,
    resendVerificationEmail
};