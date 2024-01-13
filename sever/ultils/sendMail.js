const nodemailer = require("nodemailer");
const asynchandle = require('express-async-handler')



const sendMail = asynchandle(async({email,html,subject})=>{
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false ,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
  
    let info = await transporter.sendMail({
      from: 'cuahangdientu" <no-relplycuahangdientu.com>', // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      html: html, // html body
    });
  return info
    
})
module.exports = sendMail