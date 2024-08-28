const handleFactory = require("../controllers/handlerFactory");
const Order = require("../models/orderModel");
const catchAsync = require("../utils/catchAsync");

exports.addOrder = handleFactory.addOne(Order);

exports.top3Orders = catchAsync(async (req, res, next) => {
  let orders = await Order.aggregate([
    {
      $lookup: {
        from: "menus",
        localField: "items",
        foreignField: "_id",
        as: "menuItems",
      },
    },
    { $unwind: "$menuItems" },
    {
      $project: {
        menuItems: {
          name: 1,
          type: 1,
          image: 1,
          category: 1,
          description: 1,
          _id: 1,
        },
        _id: 0,
      },
    },
    { $group: { _id: "$menuItems", count: { $sum: 1 } } },
    { $project: { item: "$_id", count: "$count", _id: 0 } },
    { $sort: { count: -1 } },
    { $limit: 3 },
  ]);

  return res.status(200).json({
    status: "success",
    data: [orders],
  });
});
