const winston = require('winston');
const fs = require('fs'); //file system
const { User } = require('../../models/user')
const { Admin } = require('../../models/admin/admin')
const { apiResponse} = require("../response/response")
const { SUCCESS, REDIRECTION, CLIENT_ERROR, SERVER_ERROR } = require("../response/statusCode")
const {ERROR_MSG, SUCCESS_MSG} = require("../response/messages")

const validToken = async (req, res, next) => {
    try{        
        const authHeader = String(req.headers['authorization'] || '');
        const authType = req.headers['auth-type'];
        if (authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7, authHeader.length);
            if (!token) return apiResponse(res, true, [], ERROR_MSG['TOKEN-NOT-PROVIDED'], CLIENT_ERROR.badRequest, 0, [])
            let existingUser = '';
            if(authType === 'admin'){
                existingUser = await Admin.findOne({auth_token:token},
                    { _id: 1 })
            }else{
                existingUser = await User.findOne(
                    {auth_token:token},
                    { _id: 1 }
                    );
            }
            if(!existingUser){
                return apiResponse(res, true, [], ERROR_MSG['INVALID-TOKEN'], CLIENT_ERROR.badRequest, 0, [])
            }
            next();
        }else{
            return apiResponse(res, true, [], ERROR_MSG['BEARER-TOKEN-NOT-PROVIDED'], CLIENT_ERROR.badRequest, 0, [])
        }
        
    }catch(e){
        console.log("error>>>>>>>>>>", e)
        winston.error(e.message, e);
        return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
    }
}

module.exports = {validToken};