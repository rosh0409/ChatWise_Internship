import nodemailer from "nodemailer";

export const sendEmail = (sender, password, reciever, subject, message) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: sender ,
      pass: password,
    },
  });

  var mailOptions = {
    from: sender,
    to: reciever,
    subject: subject,
    text: message,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error.message);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
