const mainNavigationModel = require("../models/mainNavigationModel");

exports.getMainNavigationMenus = async (req, res, next) => {
  let mainOptions = await mainNavigationModel.find();
  res.status(200).json({
    status: "success",
    data: mainOptions,
  });
};
