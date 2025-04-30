import Restaurant from "../models/restaurantModel.js";
import { DynamicStructuredTool } from "langchain/tools";
import { z } from "zod";
import GoogleMapsAPIFeatures from "../utils/goolgeMapsAPIFeatures.js";
import Formatter from "../utils/formatter.js";
export function locateToolRestaurant() {
  return new DynamicStructuredTool({
    name: "LocateToolRestaurant",
    description:
      "This tool is used to fetch and display all available restaurant branch locations on a map. It should return a single Google Maps URL showing pins or markers for each restaurant's address or coordinates. Use this only when the user asks for restaurant locations, branches, outlets, or where to find 'Dhaba Delicious'.",
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
