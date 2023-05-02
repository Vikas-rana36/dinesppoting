const _ = require('lodash'); 
const { User } = require('../../models/user');
const { apiResponse} = require("../../core/response/response")
const { SUCCESS, REDIRECTION, CLIENT_ERROR, SERVER_ERROR } = require("../../core/response/statusCode")
const {ERROR_MSG, SUCCESS_MSG} = require("../../core/response/messages");
const mongoose = require("mongoose");

exports.userlisting = async (req, res) => {
    try {
        const { first_name, last_name, email, createdAt, updatedAt } = req.body
        var filteredQuery, page, limit = ''
        let fname_regex = new RegExp(first_name,'i');
        let lname_regex = new RegExp(last_name,'i');
        let email_regex = new RegExp(email,'i');
        if(req.query.search){
            page = req.query.page  ? parseInt(req.query.page) - 1 : 0;
            limit = 10;
            const filter_fname = (first_name && first_name != 'undefined')  ? { first_name: fname_regex } : {};
            const filter_lname = (last_name && last_name != 'undefined')  ? { last_name: lname_regex } : {};
            const filter_email = (email && email != 'undefined')  ? { email: email_regex } : {};
            const filter_createdAt = (createdAt && createdAt != 'undefined') ? { createdAt: {$gte: new Date(createdAt)} } : {};
            const filter_updatedAt = (updatedAt && updatedAt != 'undefined') ? { updatedAt: {$lte: new Date(updatedAt).setHours(23, 59, 59, 59)} } : {};
            filteredQuery = { ...filter_fname, ...filter_lname, ...filter_email, ...filter_createdAt, ...filter_updatedAt, is_deleted:false, is_verified:true}
        }else{
            page = req.query.page  ? parseInt(req.query.page) - 1 : 0;
            limit = 10;
            filteredQuery = {
                is_deleted:false, is_verified:true
            }
        }
        const [data, count] = await Promise.all([
            User.find(filteredQuery).sort({createdAt: -1}).skip(page * limit).limit(limit),
            User.countDocuments(filteredQuery)
        ]);
        return apiResponse(res, false, [], '', SUCCESS.OK, count, data)  

    } catch (error) {
        console.log('err',error)
         return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
    }    
}
exports.fetchAllUser = async (req, res) => {
    try {
        const [data, count] = await Promise.all([
            User.find({is_deleted:false, is_verified:true}).sort({createdAt: -1}),
            User.countDocuments({is_deleted:false, is_verified:true})
        ]);
        return apiResponse(res, false, [], '', SUCCESS.OK, count, data)  

    } catch (error) {
        console.log('err',error)
         return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
    }    
}
exports.changeUserStatus = async (req, res) => {
    const {id, status} = req.body
    let condition = {}
    condition['_id'] = mongoose.Types.ObjectId(id);

    let record = await User.findOne(condition, { _id: 1 } );
    
    if (record) {
        await User.findOneAndUpdate(condition, { $set: { is_active: status } }, { new: true })

        return apiResponse(res, false, [], '', SUCCESS.OK, [record]) 
    }

    return  apiResponse(res, true, [], ERROR_MSG['NO-RECORD-FOUND'], CLIENT_ERROR.badRequest, 0,[]);  
   
}

async function findUserByEmail(email){
    //checking unique Category
    return await User.findOne(
        {email:email},
        { _id: 1 }
    );
}