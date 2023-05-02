'use strict';
var mongoose = require('mongoose');
var sha1 = require('sha1');
var md5 = require('md5');
var userSchema = new mongoose.Schema(
    {
        first_name: { 
            type: String, 
            trim:true 
        },
        last_name: { 
            type: String, 
            trim:true 
        },
        email: { 
            type: String, 
            trim:true 
        },
        password: { 
            type: String 
        },    
        login_type: {
            type: String,
            default: 'login'
        },
        social_token: {
            type: String 
        },
        salt_key: { 
            type: String 
        },     
        is_active:{
            type: Boolean,        
            default: true
        },
        is_verified:{
            type: Boolean,     
            default: false
        },
        is_deleted: {
            type: Boolean,
            default: false
        },
        is_approved_by_admin:{
            type: Boolean,
            default: false
        },
        device_data:{
            type: Array,
        },
        auth_token:{ 
            type: String 
        },
        reset_password_token:{ 
            type: String 
        },
        last_login: {
            type: Date,
        }
    },
    {
        timestamps: true,
    },
);

//pre save hook on mongodb
userSchema.pre('save', async function save(next) {
    if (!this.isModified('password')) return next();
    try {  
        const salt = await sha1(`${this.email}${new Date()}`) 
        const password = await md5(`${this.password}`) 
        this.password = await md5(`${password}${salt}`) 
        this.salt_key = salt;
        return next();
    } catch (err) {
        return next(err);
    }
});

userSchema.methods.passwordCompare = async function (saltKey, savedPassword, requestedPassword) {

  
    const password = await md5(`${requestedPassword}`)
    const encryptedPassword = await md5(`${password}${saltKey}`)   
    return (encryptedPassword == savedPassword)?true:false    
}

userSchema.methods.generateToken = async function (saltKey) {

  
    return md5(saltKey);  
}

userSchema.methods.generateResetPasswordToken = async function (saltKey) {

  
    return md5(`${saltKey}-${new Date()}`);  
}

userSchema.methods.encryptPassword = async function (userData, password) {
    const MD5Password = await md5(`${password}`) 
    const encryptedPassword = await md5(`${MD5Password}${userData.salt_key}`)    
    return encryptedPassword;  
}
let User = mongoose.model('User', userSchema)
//module.exports.User =  mongoose.model('User', userSchema);
module.exports = {User, userSchema}