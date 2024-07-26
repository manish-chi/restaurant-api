let app = require("./app");
let mongoose = require("mongoose");

let databaseConnection = process.env.DATABASE_CONNECTION.replace(
  "<username>",
  process.env.DATABASE_USERNAME
);

databaseConnection = process.env.DATABASE_CONNECTION.replace(
  "<password>",
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

let server = app.listen(process.env, () => {
  console.log(`Server successfully started at ${PORT}`);
});
