import { Stripe } from "stripe";

export const createSessionUrl = async (items) => {
  const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

  let session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: items.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Number(item.price_in_INR),
        },
        quantity: Number(item.quantity),
      };
    }),
    success_url: `${process.env.BOT_APP_URL}/api/notify`,
    cancel_url: process.env.BOT_CANCEL_URL,
  });

  return session.url;
};
