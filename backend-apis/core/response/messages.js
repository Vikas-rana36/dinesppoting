const ERROR_MSG = {
    "ACCOUNT-NOT-EXIST":'Account does not exist in our system.',
    "PASSWORD-MISMATCH":"Password does not match.",
    "USER-NOT-ACTIVE":"Sorry! You are not an active user. Please contact admin.",
    "EMAIL-ALREADY-EXIST":"Email already registered.",
    "SYSTEM-ERROR":"Sorry!! We could not save your information due to some internal system error. Please try after some time.",
    "ACCOUNT-NOT-REGISTERD":"Account is not registered in our system.",
    "USE-ANOTHER-PASSWORD":"You can not use previous password again. Please use new password.",
    "NO-RECORD-FOUND":"No Record Found",
    "CATEGORY-EXIST":"Category already existed.",
    "ALREADY-EXIST":"Record already existed.",
    "ACCOUNT-NOT-VERIFIED": "Account is not verified. Please check your email and verify your account",
    "LINK-EXPIRED": "Email link already used or has been expired.",
    "INVALID-ACCOUNT-TOKEN":"Invalid/expired token. Please make sure that you have used correct email link.",
    "FORGOT-PASSWORD-INACTIVE-ACCOUNT": "This request can not be processed as your account is not verified. Please verify your account first .",
    "OLD-PASSWORD-NOT-MATCHED": "Old password does not match. Please check and try again.",
    "SOCIAL-LOGIN": "You have to login with the google login button."
}

const SUCCESS_MSG = {
    errorBoolean: false    
}

module.exports = {ERROR_MSG, SUCCESS_MSG}