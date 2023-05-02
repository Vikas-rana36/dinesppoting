const _ = require('lodash'); 
require('dotenv').config({path:__dirname+'../.env'})
const { Contact } = require('../models/contact');
const { Admin } = require('../models/admin/admin');
const { apiResponse} = require("../core/response/response")
const { SUCCESS, REDIRECTION, CLIENT_ERROR, SERVER_ERROR } = require("../core/response/statusCode")
const {ERROR_MSG, SUCCESS_MSG} = require("../core/response/messages")
const {sendEmail} = require('../core/utilities/emailService');
const {contactUsTemplateUser, contactUsTemplateAdmin} = require('../core/utilities/emailTemplates');
const ContactObject = new Contact();

// contact us for frontend
exports.contactUs =async (req, res) => {
    const { first_name, email, last_name, message } = req.body;

    let adminInformation = await Admin.findOne({ is_active: true },{ email: 1 })

    //save user 
    var newContact = new Contact(_.pick(req.body, ['first_name','email','last_name', 'message']));

    newContact.save(async function (err, contact) {
        console.log("contact>>>>>>>>>>>>>>",contact);
        
        if (err) return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])        
        let link = `${process.env.WEB_ENDPOINT}` 
        let fullName = contact.name; 
        let templateData = contactUsTemplateUser({fullName,link})
        const mailOptions = {
            to: contact.email,           
            subject: templateData.subject,
            html: templateData.html  
	    };
        let isEmailSent = await sendEmail(mailOptions, res)
        let templateDataAdmin = contactUsTemplateAdmin({first_name,email,last_name,message})
        const mailOptionsAdmin = {
            to: adminInformation.email,           
            subject: templateDataAdmin.subject,
            html: templateDataAdmin.html  
	    };
      await  sendEmail(mailOptionsAdmin, res)

       
        let userData = _.pick(contact, ['_id'])
        return apiResponse(res, false, [], '', SUCCESS.OK, 0, userData)    
            
    });
}
