const { login, forgotPassword, updatePassword, adminInfo, updateAdmin, changePassword  } = require('../controllers/admin/auth.controller')

const {loginJoiSchema, ForgotPasswordJoiSchema} = require('../core/validations/auth.validations')
const { userlisting, changeUserStatus, fetchAllUser } = require('../controllers/admin/user.controller')
const {validToken} = require('../core/middlewares/auth')
const { uploadFile  } = require('../controllers/admin/aws-file-upload.controller')

const fileUpload = require('../core/middlewares/fileUpload')
const validateRequest = require('../core/middlewares/validateRequest')


// Routes =============================================================
module.exports = router => {
    // POST route to mock a login  endpoint
    router.post("/api/admin/auth/login", [validateRequest(loginJoiSchema)], login)   
    router.post("/api/admin/auth/forgotPassword",[validateRequest(ForgotPasswordJoiSchema)], forgotPassword)
    router.post("/api/admin/auth/resetPassword", updatePassword) 
    router.post("/api/admin/auth/adminInfo",validToken, adminInfo) 
    router.post("/api/admin/auth/adminedit",validToken, updateAdmin)
    router.post("/api/admin/auth/passwordChange",validToken, changePassword)
    
    // user routes
    router.post("/api/admin/user/listing",validToken, userlisting)
    router.post("/api/admin/user/allUsers",validToken, fetchAllUser)
    router.post("/api/admin/user/changeStatus",validToken, changeUserStatus)

    // Admin file upload Settings
    router.post("/api/admin/upload/uploadFile", fileUpload,  uploadFile)
    
}