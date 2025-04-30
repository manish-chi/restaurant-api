import { Redis } from "@upstash/redis";
import customerModel from "../models/customerModel.js";

class UserManager {
  constructor() {
    this.name = null;
    this.phoneNumber = null;
    this.location = null;
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  async savePhoneNumber(phoneNumber, config) {
    let user = this.#getUserIfExists(config);
    user.phoneNumber = phoneNumber;
    await this.redis.set(
      `user:${config.metadata.sessionId}`,
      JSON.stringify(user)
    );
  }

  async saveName(name, config) {
    let user = this.#getUserIfExists(config);
    user.name = name;
    await this.redis.set(
      `user:${config.metadata.sessionId}`,
      JSON.stringify(user)
    );
  }

  async saveLocation(location, config) {
    let user = this.#getUserIfExists(config);
    user.deliverAddress = location;
    await this.redis.set(
      `user:${config.metadata.sessionId}`,
      JSON.stringify(user)
    );
  }

  async #getUserIfExists(config) {
    let user = this.redis.get(`user:${config.metadata.sessionId}`);
    if (user) {
      user = typeof user === "string" ? JSON.parse(user) : user;
    }
    return user;
  }

  async saveUserToDatabase(config) {
    let user = await this.#getUserIfExists(config);
    user.sessionId = config.metadata.sessionId;
    user = await customerModel.create(user);
    return user;
  }

  async checkIfUserIsVerified(config, user = null) {
    if (user == null) user = await this.#getUserIfExists(config);

    if (user) {
      if (
        user.isVerified &&
        user.phoneNumber &&
        user.name &&
        user.deliveryAddress
      )
        return true;
    }

    return false;
  }
}

export default UserManager;
