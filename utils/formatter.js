class Formatter {
  foodFormatResponse(items) {
    return items.map((item, i) => `${i + 1}. ${item.name}`).join("\n");
  }

  MenuTimeOfDay() {
    let hours = new Date().getHours();
    if (hours >= 6 && hours <= 11) return "breakfast";
    return "lunch";
  }

  hourFormatter(time) {
    return new Date(time).toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    });
  }

  async getCartSummary(cartManager) {
    if (cartManager.cart.length == 0)
      cartManager.notFoundItemsMessages.push(`Oops! cart 🛒 seems empty! ❗`);

    let totalCost = 0;
    let summary = cartManager.cart.map((item, idex) => {
      totalCost = totalCost + item.price;
      return `${idex + 1}. ${item.name} x ${item.quantity} = ${item.price}\n`;
    });

    return cartManager.notFoundItemsMessages.length > 0
      ? `${cartManager.notFoundItemsMessages.join(", ")}`
      : `${summary}\n 💰Total Amount = ₹${totalCost}`;
  }

  getRestaurantLocationSummary(restaurants) {
    let resturantNamesWithTimeArr = restaurants.map((restaurants) => {
      return `${restaurants.name}-(${
        restaurants.location.address
      })) \n (🔓${this.hourFormatter(
        restaurants.open
      )} - 🔒${this.hourFormatter(restaurants.close)})`;
    });

    return resturantNamesWithTimeArr.join(" \n\n");
  }

  async getAddToCartSummary(cartManager) {
    // Build summary
    let summary = "🛒 Here's your updated cart:\n";
    let totalItems = 0;

    cartManager.cart.forEach((item, idx) => {
      summary += `${item.type} == "veg" ? "🟢" : "🔴" ${idx + 1}. ${
        item.quantity
      } x ${item.name} = ${item.price}🍽️\n`;
      totalItems += 1;
    });

    console.log(cartManager.cart);

    summary += `❌${cartManager.notFoundItemsMessages.join(
      ","
    )}\n\n✅ Total items: ${totalItems}\n🧾 You can proceed to checkout or add more items?`;
  }

  getOrderSummary(cartManager, createdOrder, message) {
    const itemList = cartManager.cart
      .map((item, index) => `  ${index + 1}. ${item.name} x ${item.quantity}`)
      .join("\n");

    message += `\n🛒 Order Summary with Order Id : ${createdOrder._id.toString()}:\n${itemList}`;
  }
}

export default Formatter;
