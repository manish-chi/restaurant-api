import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID;

const client = twilio(accountSid, authToken);

export async function sendOTP(toPhoneNumber) {
  try {
    let response = {};
    if (process.env.NODE_ENV === "production") {
      return (response = await client.verify.v2
        .services(serviceId)
        .verifications.create({
          to: toPhoneNumber.includes("+91")
            ? `${toPhoneNumber}`
            : `+91${toPhoneNumber}`,
          channel: "sms",
        }));
    }

    response.status = "pending";
    return response;
  } catch (err) {
    console.log(err);
  }
}

export async function verifyOTP(toPhoneNumber, code) {
  try {
    if (process.env.NODE_ENV === "production") {
      const verificationCheck = await client.verify.v2
        .services(serviceId)
        .verificationChecks.create({
          to: toPhoneNumber.includes("+91")
            ? `${toPhoneNumber}`
            : `+91${toPhoneNumber}`,
          code: code,
        });

      return verificationCheck.status === "approved" ? true : false;
    }

    return true;
  } catch (err) {
    console.log(err);
  }
}
