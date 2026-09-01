let twilioClient = null;
let twilioLib = null;

function isTwilioEnabled() {
  const sid = process.env.TWILIO_ACCOUNT_SID || "";
  const token = process.env.TWILIO_AUTH_TOKEN || "";
  const from = process.env.TWILIO_PHONE_NUMBER || "";
  return sid && token && from && !sid.includes("YOUR_");
}

function getClient() {
  if (twilioClient) return twilioClient;
  if (!isTwilioEnabled()) return null;
  try {
    twilioLib = twilioLib || require("twilio");
    twilioClient = twilioLib(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    return twilioClient;
  } catch (e) {
    console.warn("Twilio package not installed yet — run: npm install twilio --save");
    return null;
  }
}

exports.sendOTP = async (phone, code) => {
  const client = getClient();
  if (!client) {
    console.log(`\n📱 [DEV MODE] OTP for ${phone}: ${code}\n`);
    return true;
  }
  try {
    return await client.messages.create({
      body: `Your AM38 verification code is: ${code}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
  } catch (err) {
    console.error("Twilio send failed, falling back to console:", err.message);
    console.log(`\n📱 [FALLBACK] OTP for ${phone}: ${code}\n`);
    return true;
  }
};

exports.sendSMS = async (to, body) => {
  const client = getClient();
  if (!client) {
    console.log("Twilio disabled. SMS:", body);
    return true;
  }
  try {
    return await client.messages.create({ body, from: process.env.TWILIO_PHONE_NUMBER, to });
  } catch (err) {
    console.error("Twilio SMS failed:", err.message);
    return true;
  }
};