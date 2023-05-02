'use strict';
const _ = require('lodash');
const yelp = require('yelp-fusion');
const fs = require('fs');
// const { categoryData } = require('../categories.json')
const { apiResponse} = require("../core/response/response")
const { Category } = require('../models/category');
const { SUCCESS, REDIRECTION, CLIENT_ERROR, SERVER_ERROR } = require("../core/response/statusCode")
const {ERROR_MSG, SUCCESS_MSG} = require("../core/response/messages")

const apiKey = process.env.YELP_API_KEY;
const client = yelp.client(apiKey);

// Place holder for Yelp Fusion's API Key. Grab them
// from https://www.yelp.com/developers/v3/manage_app
exports.searchByLatLng = async (req, res) => {
  const {lat, long, location, category, term, limit, offset, sortBy, price, open_now, attributes, radius} = req.query
  
  const searchRequest = {
    location: location,
    latitude: lat,
    longitude: long,
    limit: parseInt(limit) || 24,
    offset: parseInt(offset - 1) * parseInt(limit) || 0,
  };

  if(term){
    searchRequest['term'] = term
  }
  if(price){
    searchRequest['price'] = price
  }
  if(sortBy){
    searchRequest['sort_by'] = sortBy
  }
  if(category){
    searchRequest['categories'] = category.replace(/\s+/g, '').toLowerCase()
  }
  if(open_now && open_now != 'both'){
    searchRequest['open_now'] = open_now
  }
  if(attributes){
    searchRequest['attributes'] = attributes
  }
  if(radius){
    searchRequest['radius'] = parseInt(radius)
  }

  // console.log("searchRequest>>>>>>>>>>>",searchRequest);
  client.search(searchRequest).then(response => {
    const total = (response.jsonBody.total && response.jsonBody.total <= 1000) ?  response.jsonBody.total : 1000
    return apiResponse(res, false, [], '', SUCCESS.OK, total, response.jsonBody.businesses);  
  }).catch(e => {
    console.log(e);
    return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
  });
}

exports.fetchCategory = async (req, res) => {
 try {
    const [data, count] = await Promise.all([
      Category.find({}).sort({createdAt: -1}),
      Category.countDocuments({})
    ]);
    return apiResponse(res, false, [], '', SUCCESS.OK, count, data)    
 } catch (error) {
    console.log('err',error)
    return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
 }

}

// get all the categories
exports.allCategories = async (req, res) => {
  try {
    client.allCategories().then(response => {
      // console.log(response.jsonBody.categories);
      var allelem = [];
      response.jsonBody.categories.forEach(element => {
        if(element.parent_aliases[0] === 'restaurants' || element.parent_aliases[0] === 'food' || element.parent_aliases[0] === 'nightlife' || element.parent_aliases[0] === 'bars' || element.parent_aliases[0] === 'hotels' || element.parent_aliases[0] === 'hotelstravel'){
          allelem.push(element)
        }
      });
      console.log("food&resto>>>>>>>>",allelem);
      
       return apiResponse(res, false, [], '', SUCCESS.OK, 0, allelem);  
    }).catch(e => {
      console.log(e);
    return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
    });
  } catch (error) {
    console.log('err',error)
    return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
  }
}

exports.businessDetails = async (req, res) => {
  try {
    var business_id = req.params.bId;
    client.business(business_id).then(response => {
      console.log(response.jsonBody);
      return apiResponse(res, false, [], '', SUCCESS.OK, 0, response.jsonBody);  
    }).catch(e => {
      console.log(e);
    return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
    });
  } catch (error) {
    console.log('err',error)
    return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
  }
}

// yelp reviews for the business
exports.businessReview = async (req, res) => {
  try {
    var business_id = req.params.bId;
    client.reviews(business_id).then(response => {
      // console.log(response);
      return apiResponse(res, false, [], '', SUCCESS.OK, 0, response.jsonBody.reviews);  
    }).catch(e => {
      console.log(e);
    return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
    });
  } catch (error) {
    console.log('err',error)
    return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
  }
}

// yelp autocomplete api
exports.autoComplete = async (req, res) => {
  try {
    var { searchText }  = req.body;
    // console.log("searchText>>>>>>>>>>>>>",searchText);
    client.autocomplete({text:searchText}).then(response => {
      // console.log("res>>>>>>>>>>>>>>>>>",response.jsonBody.categories);
      return apiResponse(res, false, [], '', SUCCESS.OK, 0, response.jsonBody.terms);  
    }).catch(e => {
      // console.log(e);
      return apiResponse(res, false, [], '', SUCCESS.OK, 0, []);  
    // return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
    });
  } catch (error) {
    console.log('err',error)
    return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
  }
}

exports.addYelpCategory = async (req, res) => {
  // Category added by the json file
  // Read users.json file
fs.readFile("categories.json", function(err, data) {
      
  // Check for errors
  if (err) throw err;
 
  // Converting to JSON
  const users = JSON.parse(data);
  // console.log(users.length,"lkjtug");
  for(let ele of users){
    if(ele.parents[0] == 'food' || ele.parents[0] == 'restaurants')
    {
      // console.log("hello food", ele.parents[0], "titiwl>>>>>>>>", ele.title);
      //save FAQ 
      ele['name'] = ele.parents[0]
      let newCategory = new Category(_.pick(ele, ['title','alias','name']));
      newCategory.save(async function (err, record) {
          
        if (err) return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError,0,  [])
            
        return apiResponse(res, false, [], '', SUCCESS.OK, 0, [record])         
        
    });
        
    }
  }
    
  // console.log(users); // Print users 
});
}