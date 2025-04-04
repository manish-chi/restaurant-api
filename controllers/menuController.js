const catchAsync = require("../utils/catchAsync");
const Menu = require("../models/menuModel");
const handleFactory = require("../controllers/handlerFactory");
const mongoose = require("mongoose");
const embedDocuments = require("../utils/embed-documents");
const AppError = require("../utils/appError");

exports.getMenuBySearch = catchAsync(async (req, res, next) => {
  const query = req.body.query;
  console.log(query);
  const results = await embedDocuments.searchMenu(query);

  if (results.length === 0) {
    next(
      new AppError(403, "No matching menu items found. Try a different query?")
    );
  }

  res.status(200).json({ status: "success", data: results });
});

exports.getMenuItemsByName = catchAsync(async (req, res, next) => {
  let restaurantId = "";

  if (req.params.restaurantId) {
    restaurantId = req.params.restaurantId;
  }

  let retrivedItems = JSON.parse(req.query.menuItemNames);

  let items = await Promise.all(
    retrivedItems.map(async (item) => {
      if (restaurantId) {
        return await Menu.find({
          name: { $regex: `${item}.*`, $options: "i" },
          restaurants: { $in: [new mongoose.Types.ObjectId(restaurantId)] },
        });
      } else {
        return await Menu.find({
          name: { $regex: `${item}.*`, $options: "i" },
        });
      }
    })
  );

  if (!items) throw new AppError("404", "Items with name not found!");

  return res.status(200).json({
    status: "success",
    data: items,
  });
});

exports.addDish = handleFactory.addOne(Menu);
