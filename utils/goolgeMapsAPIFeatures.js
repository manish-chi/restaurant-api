class GoogleMapsAPIFeatures {
  buildGoogleMapsRestoLocationsUrl(restaurants) {
    let markers = restaurants.map((restaurant, idx) => {
      let colors = {
        tiffins: "0xDDA0DD",
        veg: "green",
        "non-veg": "red",
      };

      console.log(colors[restaurant.type]);

      let color = colors[restaurant.type];

      return `&markers=size:mid|color:${color}|label:${idx + 1}|${
        restaurant.location.coordinates[0]
      },${restaurant.location.coordinates[1]}`;
    });

    return `https://maps.googleapis.com/maps/api/staticmap?size=600x400&zoom=11&maptype=roadmap${markers.join(
      ""
    )}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
  }
}

export default GoogleMapsAPIFeatures;
