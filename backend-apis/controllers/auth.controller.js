const _ = require('lodash'); 
require('dotenv').config({path:__dirname+'../.env'})
const { User } = require('../models/user');
const { apiResponse} = require("../core/response/response")
const { SUCCESS, REDIRECTION, CLIENT_ERROR, SERVER_ERROR } = require("../core/response/statusCode")
const {ERROR_MSG, SUCCESS_MSG} = require("../core/response/messages")
const {sendEmail} = require('../core/utilities/emailService');
const {signUpTemplate, forgotPasswordTemplate} = require('../core/utilities/emailTemplates');
const userObject = new User();

/*
* Here we would probably call the DB to confirm the user exists
* Then validate if they're authorized to login
* Then confirm their password
* Create a JWT or a cookie
* And finally send it back if all's good
*/
exports.login = async (req, res) => {

    // If no validation errors, get the req.body objects that were validated and are needed
    const { email, password, device_token, socialToken, name } = req.body

    if(socialToken){
       await User.findOneAndUpdate({ "email": email }, {$set: { social_token: socialToken, first_name:name, login_type:'socialLogin', last_login: Date.now() } }, { upsert: true, new: true, setDefaultsOnInsert: true }, function(err, user){
            if (err) return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, []) 
            let userData = _.pick(user, ['_id','first_name','email', 'social_token'])
            return apiResponse(res, false, [], '', SUCCESS.OK, 0,userData);
       })
    }

    user = await User.findOne({ "email": email  },{ email: 1, role:1, salt_key:1, created_at: 1, password:1, login_type:1, is_active:1, is_verified:1, profile_pic:1 });
    if (!user) return  apiResponse(res, true, [], ERROR_MSG['ACCOUNT-NOT-EXIST'], CLIENT_ERROR.badRequest,0, []);
    if (user.login_type === 'socialLogin') return  apiResponse(res, true, [], ERROR_MSG['SOCIAL-LOGIN'], CLIENT_ERROR.badRequest,0, []);
    if(!user.is_verified) return apiResponse(res, true, [], ERROR_MSG['ACCOUNT-NOT-VERIFIED'], CLIENT_ERROR.badRequest, 0, [])
    //checking password match
    const isValidPassword = await userObject.passwordCompare(user.salt_key, user.password, req.body.password);

    if (!isValidPassword) return apiResponse(res, true, [], ERROR_MSG['PASSWORD-MISMATCH'], CLIENT_ERROR.badRequest, 0,[]); 

    if (!user.is_active) return apiResponse(res, true, [], ERROR_MSG['USER-NOT-ACTIVE'], CLIENT_ERROR.badRequest,0, []);  
    

   
    const token = await userObject.generateToken(user.salt_key);//generate token
    //console.log('token',token);

    await User.findOneAndUpdate({ _id: user._id }, { $set: { auth_token: token, device_data: device_token, last_login: Date.now() } }, { new: true })

    
    let userData = _.pick(user, ['_id','first_name','last_name','email'])
    userData['token'] = token;
    res.setHeader('x-ds-auth-token', token);
    res.header('Access-Control-Expose-Headers', 'x-ds-auth-token')   
    
    return apiResponse(res, false, [], '', SUCCESS.OK, 0,userData);   
    
}

/*
* Here we would probably call the DB to confirm the user exists
* Then validate and save in DB
* Create a JWT or a cookie
* Send an email to that address with the URL to approve account
* And finally let the user know their email is waiting for them at their inbox
*/
exports.signup = async (req, res) => {
    // If no validation errors, get the req.body objects that were validated and are needed
    const { first_name, last_name, email, password } = req.body;
    //checking unique email
    let existingUser = await User.findOne(
        {email:email},
        { _id: 1 }
    );
    
    if (existingUser) return apiResponse(res, true, [], ERROR_MSG['EMAIL-ALREADY-EXIST'], CLIENT_ERROR.badRequest, 0, []);    

    //save user 
    newUser = new User(_.pick(req.body, ['first_name', 'last_name','email', 'password', 'is_active', 'is_verified', 'salt_key', 'device_data']));


    
    newUser.save(async function (err, user) {
        
        if (err) return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, []) 

        const token = await userObject.generateToken(user.salt_key);//generate token
        //console.log('token',token);

        await User.findOneAndUpdate({ _id: user._id }, { $set: { auth_token: token } }, { new: true })
        let link = `${process.env.WEB_ENDPOINT}/auth/verify/${user._id}/${token}`   
       
        let templateData = signUpTemplate({link})

        const mailOptions = {
            to: user.email,           
            subject: templateData.subject,
            html: templateData.html  
	    };
		sendEmail(mailOptions, res)

        res.setHeader('x-ds-auth-token', token);
        res.header('Access-Control-Expose-Headers', 'x-ds-auth-token')   
        let userData = _.pick(user, ['_id','first_name', 'last_name','email', 'role_id','category_id'])
        return apiResponse(res, false, [], '', SUCCESS.OK, 0, userData)    
        
    });

}

/*
* Here we would probably call the DB to confirm the user exists
* Then validate and save in DB
* Create a JWT or a cookie
* Send an email to that address with the URL to approve account
* And finally let the user know their email is waiting for them at their inbox
*/
exports.verify = async (req, res) => { 
    try{
    const userId = req.params.userid; 
    //checking unique email
    let existingUser = await User.findOne(
        {_id:userId},
        { auth_token:1 }
    );

    //checking unique email, verified, token
    let linkUser = await User.findOne(
        {$and: [{_id:userId}, {is_verified: true}, {auth_token: ''}]},
        { auth_token:1 }
    );
    
    // if link already used and no data into the table
    if (linkUser) return apiResponse(res, true, [], ERROR_MSG['LINK-EXPIRED'], CLIENT_ERROR.badRequest, 0, []);    


    // if user not exists in db
    if (!existingUser) return apiResponse(res, true, [], ERROR_MSG['ACCOUNT-NOT-EXIST'], CLIENT_ERROR.badRequest, 0, []);    

    // check otp and remove data from temp and insert into user table
    if(req.params.token == existingUser.auth_token){
        let user = await User.findOneAndUpdate({ _id: userId }, { $set: { is_verified: true, auth_token: '' } }, { new: true })                                                
        return apiResponse(res, false, [], '', SUCCESS.OK, 0, [{ok: true }])
    }    
}catch(err){
    console.log("catch>>>>>>",err)
    return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
}

}

/*
* Here we would probably call the DB to confirm the user exists
* Then validate and save in DB
* Create a JWT or a cookie
* Send an email to that address with the URL to change password account
* And finally let the user know their email is waiting for them at their inbox
*/
exports.forgotPassword = async (req, res) => {
    //console.log("email>>>>>>>>",req.body)

    // If no validation errors, get the req.body objects that were validated and are needed
    const { email } = req.body

   //checking email exists
   let userInformation = await User.findOne(
        {email:email},
        { _id:1, email:1, first_name:1, last_name:1, is_verified:1 }
    );

    if (!userInformation) return apiResponse(res, true, [], ERROR_MSG['ACCOUNT-NOT-REGISTERD'], CLIENT_ERROR.badRequest, 0, []) 

    if(!userInformation.is_verified) return apiResponse(res, true, [], ERROR_MSG['FORGOT-PASSWORD-INACTIVE-ACCOUNT'], CLIENT_ERROR.badRequest, 0, []) 

    const resetPasswordToken = await userObject.generateResetPasswordToken(userInformation.salt_key);//generate reset password token 
    await User.findOneAndUpdate({ _id: userInformation._id }, { $set: { reset_password_token: resetPasswordToken, updatedAt:new Date() } }, { new: true })
    const link = `${process.env.WEB_ENDPOINT}/auth/reset-password/${userInformation._id}/${resetPasswordToken}`
    let fullName = `${userInformation.first_name} ${userInformation.last_name}`
    let templateData = forgotPasswordTemplate({fullName, link})
    const mailOptions = {
        to: userInformation.email,  
        subject: templateData.subject,     
        html: templateData.html     
    };
    sendEmail(mailOptions, res);

    return apiResponse(res, false, [], '', SUCCESS.OK, 0, [userInformation]) 
}

/**
 * after forgot password reset password for the user
 * check user by the new token
 * update existing user password  
 * **/
exports.updatePassword = async (req, res) => {

    //console.log('req',req.body);
    // If no validation errors, get the req.body objects that were validated and are needed
    const { password, userId, forgotToken }  = req.body  
    //checking unique email

    let existingUser = await User.findOne({_id:userId,reset_password_token: forgotToken},  { _id: 1, password:1, email:1, reset_password_token:1, salt_key:1 })   
    
    if (!existingUser) return apiResponse(res, true, [], ERROR_MSG['INVALID-ACCOUNT-TOKEN'], CLIENT_ERROR.badRequest, [])     

      

    const encryptedPassword = await userObject.encryptPassword(existingUser, password);//encrypted password
    if(encryptedPassword == existingUser.password){
        return apiResponse(res, true, [], ERROR_MSG['USE-ANOTHER-PASSWORD'], CLIENT_ERROR.badRequest,0, []) 
    }

    await User.findOneAndUpdate({ email: existingUser.email }, { $set: { password: encryptedPassword, updatedAt:new Date(), reset_password_token:'' } }, { new: true })
    return apiResponse(res, true, [], '', SUCCESS.OK, 0,[{"id":existingUser._id}])   
}