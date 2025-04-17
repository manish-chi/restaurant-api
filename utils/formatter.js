class Formatter {
  foodFormatResponse(items) {
    return items.map((item, i) => `${i + 1}. ${item.name}`).join("\n");
  }

  MenuTimeOfDay() {
    let hours = new Date().getHours();
    if (hours >= 6 && hours <= 11) return "breakfast";
    return "lunch";
  }

  async getCartSummary(config, redis, failedMessages,cart) {
   
    if (cart.length == 0) failedMessages.push(`Oops! cart 🛒 seems empty! ❗`);

    let totalCost = 0;
    let summary = cart.map((item, idex) => {
      totalCost = totalCost + item.price;
      return `${idex + 1}. ${item.name} x ${item.quantity} = ${item.price}\n`;
    });

    return failedMessages.length > 0
      ? `${failedMessages.join(", ")}`
      : `${summary}\n 💰Total Amount = ₹${totalCost}`;
  }
}

export default Formatter;
