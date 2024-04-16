const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

const port = 3000;

// Twilio Credentials
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const twilioClient = twilio(accountSid, authToken);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post("/initiate-call", async (req, res) => {
    const { to } = req.body;
    try {
        const call = await twilioClient.calls.create({
            url: "https://4048-106-51-166-229.ngrok-free.app/conference-call", // URL to fetch TwiML instructions
            to,
            from: "+12512998076", // Your Twilio phone number
        });
        console.log(`Call initiated: ${call.sid}`);
        res.status(200).json({ message: "Call initiated successfully" });
    } catch (error) {
        console.error("Error initiating call:", error);
        res.status(500).json({ error: "Failed to initiate call" });
    }
});
app.post("/conference-call", (req, res) => {
    const twimlResponse = new twilio.twiml.VoiceResponse();
    const dial = twimlResponse.dial({ record: true });
    dial.number(
        {
            statusCallbackEvent: "initiated ringing answered completed",
            statusCallbackMethod: "POST",
        },
        "+918976788430"
    );
    res.type("text/xml");
    res.send(twimlResponse.toString());
});
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
