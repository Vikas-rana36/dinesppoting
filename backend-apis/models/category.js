const mongoose = require("mongoose");
//Model for user details.
const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String 
		},
        title: {
			type: String 
		},
        alias: {
			type: String 
		}

	},
	{
		timestamps: true,
	},
);
module.exports.Category =  mongoose.model('Category', categorySchema);
