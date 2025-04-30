import axios from "axios";

class GoogleMapsAPIFeatures {
  constructor() {
    this.result = null;
    this.isUserInsideHyderabad = false;
  }
  buildGoogleMapsRestoLocationsUrl(restaurants) {
    let markers = restaurants.map((restaurant, idx) => {
      let colors = {
        tiffins: "0xDDA0DD",
        veg: "green",
        "non-veg": "red",
      };

      let color = colors[restaurant.type];

      return `&markers=size:mid|color:${color}|label:${idx + 1}|${
        restaurant.location.coordinates[0]
      },${restaurant.location.coordinates[1]}`;
    });

    return `https://maps.googleapis.com/maps/api/staticmap?size=600x400&zoom=11&maptype=roadmap${markers.join(
      ""
    )}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
  }

  async locateUserAddress(address) {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${process.env.GOOGLE_MAPS_GEO_CODE_KEY}`;

    try {
      const response = await axios.get(url);
      const result = response.data.results[0];

      this.isUserInsideHyderabad = result.address_components.some(
        (component) => component.long_name.toLowerCase() === "hyderabad" || component.long_name.toLowerCase() === "secunderabad"
      );

      console.log(`*** this is in hyd or not? : ${this.isUserInsideHyderabad}`);

      let lat = result.geometry.location.lat;
      let lng = result.geometry.location.lng;

      return `https://maps.googleapis.com/maps/api/staticmap?size=600x400&zoom=16&maptype=roadmap&markers=size:mid|color:red|${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    } catch (err) {
      console.error("Geocoding error:", err.message);
      return null;
    }
  }
}

export default GoogleMapsAPIFeatures;
