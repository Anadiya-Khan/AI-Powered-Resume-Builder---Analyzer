import nodemailer from "nodemailer";

const sendEmail = async({to,subject,text})=>{
    const transporter = nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth : {
            user : process.env.SMTP_USER,
            pass : process.env.SMTP_PASS,
        }
    })

    await transporter.sendMail({
        from :process.env.SMTP_USER,
        to,
        subject,
        text,
    })

    transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP Error:", error);
  } else {
    console.log("SMTP Server is ready");
  }
});
}

export default sendEmail;