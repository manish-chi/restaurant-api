let fs = require("fs");
let mongoose = require("mongoose");
const dotenv = require("dotenv");
let Restaurant = require("./models/restaurantModel");
let Menu = require('./models/menuModel');

dotenv.config({ path: "C:\\Users\\Manish\\Dhaba Delicious\\restaurant-api\\config.env" });

console.log(process.env.DATABASE_CONNECTION);

let databaseConnection = process.env.DATABASE_CONNECTION.replace(
  "<USERNAME>",
  process.env.DATABASE_USERNAME
);

databaseConnection = databaseConnection.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

console.log(databaseConnection);

let restaurants = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/restaurants/restaurant.json`, "UTF-8")
);

let menu = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/menu/menu.json`,'UTF-8')
)

mongoose.connect(databaseConnection).then((conn) => {
  console.log("Database Connected Successfully");
  console.log(conn);
});

async function importData() {
  await Restaurant.create(restaurants);
  console.log("Data has been successfully uploaded!!");
}

async function importMenuData(){
  await Menu.create(menu);
  console.log("Data has been successfully uploaded!!");
}

async function deleteData() {
  await Restaurant.deleteMany();
  console.log("Data has been successfully uploaded!!");
}

if (process.argv[2] == "--import-data") {
 // importData();
 importMenuData();
} else if (process.argv[2] == "--delete-data") {
  deleteData();
}
