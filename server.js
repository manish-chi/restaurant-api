let app = require("./app");
let mongoose = require("mongoose");

let databaseConnection = process.env.DATABASE_CONNECTION.replace(
  "<USERNAME>",
  process.env.DATABASE_USERNAME
);

databaseConnection = databaseConnection.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(databaseConnection)
  .then((conn) => {
    console.log("**Connection Successfull!!!**");
    console.log(conn);
  })
  .catch((err) => {
    console.log($`There was some error : ${err}`);
  });

let PORT = process.env.PORT || 8080;

let server = app.listen(PORT, () => {
  console.log(`Server successfully started at ${PORT}`);
});
