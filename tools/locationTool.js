import Restaurant from "../models/restaurantModel.js";
import { DynamicStructuredTool } from "langchain/tools";
import { z } from "zod";
import GoogleMapsAPIFeatures from "../utils/goolgeMapsAPIFeatures.js";
import Formatter from "../utils/formatter.js";
export function locateToolRestaurant() {
  return new DynamicStructuredTool({
    name: "LocateToolRestaurant",
    description: "Provides the location of the all restaurants along with google maps image and use 🕖 emoji in description",
    schema: z.object({}),
    func: async () => {
      try {
        const restaurants = await Restaurant.find();

        if (!restaurants)
          return "Sorry, Serives arent available at the moment! 😟";

        let googleMapsUrl =
          new GoogleMapsAPIFeatures().buildGoogleMapsRestoLocationsUrl(
            restaurants
          );

        let summary = new Formatter().getRestaurantLocationSummary(restaurants);

        return JSON.stringify({ url: googleMapsUrl, locations: summary });
      } catch (err) {
        console.log(err);
      }
    },
  });
}
