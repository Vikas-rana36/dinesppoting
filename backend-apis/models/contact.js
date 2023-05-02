const mongoose = require("mongoose");
var contactUsSchema = new mongoose.Schema(
	{       
        first_name: { 
            type: String, 
        },
        last_name: {
            type: String,
        },      
        email: { 
            type: String,
        },
        message:{
            type: String,
        },
        is_deleted:{
            type: Boolean,
            default: false
        }       
    },
    {
        timestamps: true,
    },
);

module.exports.Contact  = mongoose.model('Contact', contactUsSchema)