import { DynamicStructuredTool } from "@langchain/core/tools";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import { createSessionUrl } from "../utils/paymentGateway.js";
import orderModel from "../models/orderModel.js";
import foodModel from "../models/menuModel.js";
import CartManager from "../utils/cartManager.js";
import Formatter from "../utils/formatter.js";
import UserManager from "../utils/userManager.js";
import OrderManager from "../utils/orderManager.js";

export function generatePaymentLink() {
  return new DynamicStructuredTool({
    name: "generatePaymentLink",
    description:
      "Generates a secure Stripe payment link for the user's order and also shows user location google maps image - so they can complete the payment online(USE emojis).",
    schema: z.object({}),
    func: async ({}, config) => {
      try {
        let userManager = new UserManager();

        if (!(await userManager.checkIfUserIsVerified(config)))
          return "Please provide your phone number 📱 to proceed further..";

        let cartManager = new CartManager();
        await cartManager.getCart(config);

        if (cartManager.cart.length == 0)
          return `❌ 🛒 cart is currently empty. Please first add some items in cart and try again!`;

        const paymentLink = await createSessionUrl(cartManager.cart);
        return `Ok please go ahead and click and pay using 💳 ${paymentLink}`;
      } catch (err) {
        console.log(err);
      }
    },
  });
}

export function paymentSuccess() {
  return new DynamicStructuredTool({
    name: "paymentSuccess",
    description:
      "displays necessary messages after payment is successful.Only run this method when you receive input as `paymentsuccessfrombot`",
    schema: z.object({}),
    func: async ({}, config) => {
      try {
        let message = "✅ Payment successful! Thank you for your order.";

        //check if user is verified
        let userManager = new UserManager();

        if (!(await userManager.checkIfUserIsVerified(config)))
          return "Please provide your phone number 📱 to proceed further..";

        let cartManager = new CartManager();

        await cartManager.getCart(config);

        //check if cart has items and its not empty.
        if (cartManager.cart.length == 0)
          return `❌ you haven't added anything in cart. Please order something first so that I can assist you in payment.`;

        let order = new OrderManager();

        let user = await userManager.saveUserToDatabase(config, null);

        let createdOrder = await order.createOrder(cartManager, user);

        console.log(createdOrder._id);

        return new Formatter().getOrderSummary(
          cartManager,
          createdOrder,
          message
        );
      } catch (err) {
        console.log(err);
      }
    },
  });
}
