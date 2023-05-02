let emailHeader = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

    <title>template</title>
  </head>
  <body>`
let emailFooter = `</div></body></html>`


exports.signUpTemplate   = (requiredData)=>{
    return(
        {
        "subject":'Successful Signup',
        "html":`${emailHeader}
        <div style="margin:0;padding: 30px 0;background: url(${process.env.WEB_ENDPOINT}/assets/images/bg.jpg) repeat-x left -70px #F1F1F1;display: inline-block;background-position: top;">
            <div style="max-width: 600px; padding:0px 20px; margin: 0 auto;display: block;font-family: 'Roboto', sans-serif;font-size: 14px;">
        
            
                <table style="margin:0 0 30px;background: #fff;padding: 25px;border-radius: 6px;width:100%;margin:0 auto;">
                    <tr align="center">
                        <td style="font-size: 35px;font-weight: 500;letter-spacing: 2px;color: #1f1f1f;">Welcome !</td>
                    </tr> 
                    <tr>
                        <td style="padding:10px;"></td>
                    </tr>
                    <tr align="center">
                        <td><img src="${process.env.WEB_ENDPOINT}/assets/images/handshake.png" width="80px" alt=""></td>
                    </tr>    
                    <tr>
                        <td style="padding:10px;"></td>
                    </tr>
                    <tr>
                        <td style="font-size: 15px;color: #6b6b6b;line-height: 22px;">We're excited to have you get started. First, you need to confirm your account. Just press the button below.</td>
                    </tr>
                    <tr>
                        <td style="padding:20px;"></td>
                    </tr>
                    <tr align="center">
                        <td><a target="_blank"  style="background: #EE942B;border: none;color: #fff;font-size: 15px;padding: 14px 20px;cursor: pointer;text-decoration:none;" href="${requiredData.link}">Confirm Account</a></td>
                    </tr>  
                    <tr>
                        <td style="padding:18px;"></td>
                    </tr>
                    <tr align="center">
                        <td style="font-size: 15px;color: #6b6b6b;">If that doesn't work, copy and paste the following link in your browser.</td>
                    </tr>
                    <tr align="center">
                        <td style="font-size: 15px;color: #6b6b6b;">Link:${requiredData.link}</td>
                    </tr>
                </table>    
            </div>
            ${emailFooter}`
        }
    )  

}

exports.forgotPasswordTemplate  = (requiredData)=>{
    return(
        {
        "subject":'Reset Password',
        "html":`${emailHeader}
        <div style="margin:0;padding: 30px 0;background: url(${process.env.WEB_ENDPOINT}/assets/images/bg.jpg) repeat-x left -70px #F1F1F1;display: inline-block;background-position: top;">
            <div style="max-width: 600px; padding:0px 20px; margin: 0 auto;display: block;font-family: 'Roboto', sans-serif;font-size: 14px;">
        
            
                <table style="margin:0 0 30px;background: #fff;padding: 25px;border-radius: 6px;width:100%;margin:0 auto;"> 
                    <tr>
                        <td style="padding:10px;"></td>
                    </tr>
                    <tr>
                        <td style="font-size: 15px;color: #6b6b6b;line-height: 22px;">Hello ${requiredData.fullName},</td>
                    </tr>
                    <tr>
                        <td style="font-size: 15px;color: #6b6b6b;line-height: 22px;">To reset your password, please click on below button.</td>
                    </tr>
                    <tr>
                        <td style="padding:20px;"></td>
                    </tr>
                    <tr align="center">
                        <td><a target="_blank"  style="background: #EE942B;border: none;color: #fff;font-size: 15px;padding: 14px 20px;cursor: pointer;text-decoration:none;" href="${requiredData.link}">Reset Password</a></td>
                    </tr>  
                    <tr>
                        <td style="padding:18px;"></td>
                    </tr>
                    <tr align="center">
                        <td style="font-size: 15px;color: #6b6b6b;">If that doesn't work, copy and paste the following link in your browser.</td>
                    </tr>
                    <tr align="center">
                        <td style="font-size: 15px;color: #6b6b6b;">Link: ${requiredData.link}</td>
                    </tr>
                </table>    
            </div>
        </div>`
        }
    )
}

exports.contactUsTemplateUser = (requiredData)=>{
    return(
        {
        "subject":'Contact us',
        "html":`${emailHeader}
        <div style="margin:0;padding: 30px 0;background: url(${process.env.WEB_ENDPOINT}/assets/images/bg.jpg) repeat-x left -70px #F1F1F1;display: inline-block;background-position: top;">
            <div style="max-width: 600px; padding:0px 20px; margin: 0 auto;display: block;font-family: 'Roboto', sans-serif;font-size: 14px;">
        
            
                <table style="margin:0 0 30px;background: #fff;padding: 25px;border-radius: 6px;width:100%;margin:0 auto;">
                    <tr align="center">
                        <td style="font-size: 35px;font-weight: 500;letter-spacing: 2px;color: #1f1f1f;">Thankyou for contact us!</td>
                    </tr> 
                    <tr>
                        <td style="padding:10px;"></td>
                    </tr>
                    <tr align="center">
                        <td><img src="${process.env.WEB_ENDPOINT}/assets/images/handshake.png" width="80px" alt=""></td>
                    </tr>    
                    <tr>
                        <td style="padding:10px;"></td>
                    </tr>
                    <tr>
                        <td style="font-size: 15px;color: #6b6b6b;line-height: 22px;">Thanks for contacting us, we will reach out to you as soon as possible.</td>
                    </tr>
                    <tr>
                        <td style="padding:20px;"></td>
                    </tr>
                    <tr align="center">
                        <td><a target="_blank"  style="background: #EE942B;border: none;color: #fff;font-size: 15px;padding: 14px 20px;cursor: pointer;text-decoration:none;" href="${requiredData.link}">Visit us</a></td>
                    </tr>  
                </table>    
            </div>
        ${emailFooter}`
        }
    )
}

exports.contactUsTemplateAdmin = (requiredData)=>{
    return(
        {
        "subject":'Contact us',
        "html":`${emailHeader}
        <div style="margin:0;padding: 30px 0;background: url(${process.env.WEB_ENDPOINT}/assets/images/bg.jpg) repeat-x left -70px #F1F1F1;display: inline-block;background-position: top;">
        <div style="max-width: 400px; padding:0px 20px; margin: 0 auto;display: block;font-family: 'Roboto', sans-serif;font-size: 14px;">
    
        
            <table style="margin:0 0 30px;background: #fff;padding: 25px;border-radius: 6px;width:100%;margin:0 auto;">
                <tr align="left">
                    <td style=" font-size:20px;font-weight:600;margin: 10px 0 20px 0;color:#111;display:block;">New contact details</td>
                </tr>
                <tr>
                    <td style="font-size: 15px;color: #6b6b6b;line-height: 22px;text-align: left;"><b style="color:#111;">Name: </b> ${requiredData.first_name} ${requiredData.last_name}</td>
                </tr>
                <tr>
                    <td style="font-size: 15px;color: #6b6b6b;line-height: 22px;text-align: left;"><b style="color:#111;">Email: </b> ${requiredData.email}</td>
                </tr>
                <tr>
                    <td style="font-size: 15px;color: #6b6b6b;line-height: 22px;text-align: left;"><b style="color:#111;">Message: </b> ${requiredData.message}</td>
                </tr>
                <tr>
                    <td style="padding:20px;"></td>
                </tr>
                <tr align="center">
                    <td><a target="_blank"  style="background: #EE942B;border: none;color: #fff;font-size: 15px;padding: 14px 20px;cursor: pointer;text-decoration:none;" href="${requiredData.link}">Visit us</a></td>
                </tr>  
            </table>    
        </div>
    ${emailFooter}`
        }
    )
}
