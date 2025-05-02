import { Redis } from "@upstash/redis";
import { sendOTP, verifyOTP } from "../utils/twilioManager.js";
import { DynamicStructuredTool } from "langchain/tools";
import z from "zod";
import GoogleMapsAPIFeatures from "../utils/goolgeMapsAPIFeatures.js";

let redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export function userValidationTool() {
  return new DynamicStructuredTool({
    name: "userValidationTool",
    description:
      "Handles user verification by collecting a phone number, sending an OTP, and verifying it. After successful OTP verification, the tool Ask the user for their delivery address/location(USE emojis). This is the user's home/delivery location, not the restaurant's location.",
    schema: z.object({
      phoneNumber: z
        .number()
        .describe("phone number in the 10 digit format without country code."),
      otp: z.number().describe("6 digit numeric number"),
      name: z.string().describe("name of the user"),
      deliveryAddress: z
        .string()
        .describe(
          "delivery address of the user.This is NOT the restaurant location."
        ),
    }),
    func: async (data, config) => {
      let user = await redis.get(`user:${config.metadata.sessionId}`);

      if (user) {
        user = typeof user == "string" ? JSON.parse(user) : user;
      }

      if (user == null) {
        let phoneNumber = data.phoneNumber;
        let response = await sendOTP(phoneNumber.toString());

        if (response.status == "pending") {
          await redis.set(
            `user:${config.metadata.sessionId}`,
            JSON.stringify({ phoneNumber: phoneNumber })
          );
          return "OTP has been sent to your phone number📲✅. Please enter the OTP to verify your number.";
        }

        return `Sorry ${
          user.name ?? "☹️"
        } Failed to send OTP. Please try again later.`;
      }

      if (!user?.isVerified) {
        let otp = data.otp;
        let isOTPcorrect = await verifyOTP(user.phoneNumber.toString(), otp);
        if (isOTPcorrect) {
          user.isVerified = true;
          await redis.set(
            `user:${config.metadata.sessionId}`,
            JSON.stringify(user)
          );
          return "Your phone number has been verified successfully! ✅ what's your name?";
        }

        return "Invalid OTP. Please try again.";
      }

      if (!user?.name) {
        let name = data.name;
        user.name = name;
        await redis.set(
          `user:${config.metadata.sessionId}`,
          JSON.stringify(user)
        );
        return `where do you wish to deliver this order? Please provide nearest landmark 📍 this will help our delivery agent 🚚?`;
      }

      if (!user?.deliveryAddress) {
        let deliveryAddress = data.deliveryAddress;

        let summary = `${user.name} here's your delivery address.📍`;

        let geoMapFeatures = new GoogleMapsAPIFeatures();

        let googleMapsUrl = await geoMapFeatures.locateUserAddress(
          deliveryAddress
        );

        if (!geoMapFeatures.isUserInsideHyderabad) {
          return `Sorry ${
            user.name ?? "☹️"
          }, we don't deliver food @ this location since this is outside of Hyderabad! ❌`;
        }

        user.deliveryAddress = deliveryAddress;
        await redis.set(
          `user:${config.metadata.sessionId}`,
          JSON.stringify(user)
        );

        return `${googleMapsUrl}`;
      }

      return "generating payment link please wait..🕧";
    },
  });
}
