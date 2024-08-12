const catchAsync = require("../utils/catchAsync");
const Menu = require("../models/menuModel");
const handleFactory = require('../controllers/handlerFactory');

exports.getMenuItemsByName = catchAsync(async (req, res, next) => {
    let  restaurantId = req.params.restaurantId;

    let retrivedItems = JSON.parse(req.query.menuItemNames);

    console.log(typeof retrivedItems);

    let items = await Promise.all(retrivedItems.map(async (item) => {
        console.log(item);
        return await Menu.find({ 
            name: { $regex: `${item}.*`, $options: 'i' }, 
            restaurants: { $eq: restaurantId } 
        });
    }));


  if (!items) throw new AppError("404", "Items with name not found!");

  return res.status(200).json({
    status: "success",
    data: items,
  });
});


exports.addDish = handleFactory.addOne(Menu);