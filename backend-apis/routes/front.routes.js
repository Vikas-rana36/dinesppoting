const { login, signup, verify, forgotPassword, updatePassword,  } = require('../controllers/auth.controller')
const validateRequest = require('../core/middlewares/validateRequest')
const {loginJoiSchema, signupJoiSchema, ForgotPasswordJoiSchema, ContactUsJoiSchema} = require('../core/validations/auth.validations')
const {contactUs} = require('../controllers/contact.controller')
const { searchByLatLng, fetchCategory, allCategories, businessDetails, addYelpCategory, businessReview, autoComplete  } = require('../controllers/yelp.controller')
const { googleRating, tripAdvisorRating  } = require('../controllers/reviewRating.controller')
// Routes =============================================================
module.exports = router => {
   
    // POST route to mock a login  endpoint
    router.post("/api/auth/login",[validateRequest(loginJoiSchema)], login)
    router.post("/api/auth/signup",[validateRequest(signupJoiSchema)], signup)  
    router.get("/api/auth/verify/:userid/:token", verify)
    router.post("/api/auth/forgotPassword",[validateRequest(ForgotPasswordJoiSchema)], forgotPassword)
    router.post("/api/auth/resetPassword/", updatePassword)  
    router.post("/api/contact/contactus",[validateRequest(ContactUsJoiSchema)], contactUs)  

    // yelp apis for frontend allCategories
    router.get("/api/yelp/searchbylatlng", searchByLatLng)
    router.get("/api/yelp/listCategories", fetchCategory)
    router.get("/api/yelp/allCategories", allCategories)
    router.get("/api/yelp/businessDetails/:bId", businessDetails)
    router.post("/api/yelp/addCategory", addYelpCategory)
    router.get("/api/yelp/reviewBusiness/:bId", businessReview)
    router.post("/api/yelp/autocomplete", autoComplete)

    // google rating api
    router.post("/api/googleRating/googleReviews", googleRating)
    router.post("/api/tripAdvisor/reviewRating", tripAdvisorRating)


    
}