const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 3000;

const accountSidOTP = process.env.ACCOUNT_SID_OTP;
const authTokenOTP = process.env.AUTH_TOKEN_OTP;
const serviceSidOTP = process.env.SERVICE_SID;
const client = twilio(accountSidOTP, authTokenOTP);
app.get("/",(req,res)=>{
    res.status(200).json({message:"Hi"})
})
app.post("/send-otp", async (req, res) => {
    const { phoneNumber } = req.body;
    console.log("reached")
    try {
        const verification = await client.verify.services(serviceSidOTP)
            .verifications
            .create({ to: phoneNumber, channel: 'sms' });
        console.log(`OTP sent to ${phoneNumber}: ${verification.sid}`);
        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post("/verify-otp", async (req, res) => {
    const { phoneNumber, code } = req.body;

    try {
        const verificationCheck = await client.verify.services(serviceSidOTP)
            .verificationChecks
            .create({ to: phoneNumber, code: code });
        if (verificationCheck.status === 'approved') {
            console.log('OTP verified successfully');
            res.status(200).json({ message: 'OTP verified successfully' });
        } else {
            console.log('Invalid OTP');
            res.status(400).json({ error: 'Invalid OTP' });
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ error: "Failed to verify OTP" });
    }
});

// app.listen(port, () => {
//     console.log(`Server is listening on port ${port}`);
// });

const server = () => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  };
  
  server();
