import catchAsync from "../utils/catchAsync.js";
import Menu from "../models/menuModel.js";
import * as handleFactory from "../controllers/handlerFactory.js";
import mongoose from "mongoose";
import * as embedDocuments from "../utils/embed-documents.js";
import AppError from "../utils/appError.js";

export const getMenuBySearch = catchAsync(async (req, res, next) => {
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

export const getMenuItemsByName = catchAsync(async (req, res, next) => {
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

export const addDish = handleFactory.addOne(Menu);
