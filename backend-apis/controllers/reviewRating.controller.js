'use strict';
const _ = require('lodash');
const { apiResponse} = require("../core/response/response")
const { Category } = require('../models/category');
const axios = require('axios')
const { SUCCESS, REDIRECTION, CLIENT_ERROR, SERVER_ERROR } = require("../core/response/statusCode")
const {ERROR_MSG, SUCCESS_MSG} = require("../core/response/messages")
require('dotenv').config()

exports.googleRating = async (req, res) => {
    const key = process.env.GOOGLE_API_KEY
    let { searchGoogleRating } = req.body
    searchGoogleRating = JSON.stringify(searchGoogleRating)
  
    await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURI(searchGoogleRating)}&key=${key}`).then(response => {
        console.log("res>>>>>>>>>>>>>>>>",response.data);
    // handle success
     return apiResponse(res, false, [], '', SUCCESS.OK, 0, response.data.results);  
  })
  .catch(error => {
    // handle error
    console.log("error>>>>>>>>>",error);
    return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
  })
}

exports.tripAdvisorRating = async (req, res) => {
  try {
    const key = process.env.TRIPADVISOR_API_KEY
    let { querySearch, phone, latlong } = req.body
    querySearch = JSON.stringify(querySearch)
    let phoneQuery = '';
    if(phone){
      phoneQuery = `&phone=${phone}`
    }

    let resData = await axios.get(`https://api.content.tripadvisor.com/api/v1/location/search?searchQuery=${encodeURI(querySearch)}&category=restaurants${phoneQuery}&latLong=${latlong}&language=en&key=${key}`);
    // console.log("api data>>>>>>>>>>>>>>",resData.data.data);
    if(resData.data.data.length > 0){
      if(resData.data.data[0] && resData.data.data[0].location_id){
        await axios.get(`https://api.content.tripadvisor.com/api/v1/location/${resData.data.data[0].location_id}/details?language=en&currency=USD&key=${key}`).then(response => {
              console.log("res>>>>>>>>>>>>",response.data);
               // handle success
              return apiResponse(res, false, [], '', SUCCESS.OK, 0, response.data);
            })
            .catch(error => {
              // handle error
              console.log("error>>>>>>>>>",error);
              return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
            })
      }
    }else{
      return apiResponse(res, false, [], '', SUCCESS.OK, 0, resData.data.data);
    }
    //return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, []) 
  } catch (error) {
    // handle error
    console.log("error>>>>>>>>>",error);
    return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
  }

}
