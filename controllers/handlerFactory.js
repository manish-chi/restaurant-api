const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let results = await Model.find();
    return res.status(200).json({
      status: "success",
      data: {
        results,
      },
    });
  });

exports.getOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    let result = await Model.findById(req.params.id);

    if (!result) throw new AppError(404, "Invalid Restaurant ID");

    return res.status(200).json({
      status: "success",
      data: {
        result,
      },
    });
  });
};

exports.addOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    console.log(req.body);
    let result = await Model.create(req.body);
    return res.status(201).json({
      status: "success",
      data: {
        result,
      },
    });
  });
};

exports.updateOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    let updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedDoc) throw new AppError(404, "Restaurant with ID not found!!!");

    return res.status(200).json({
      status: "success",
      data: {
        updatedDoc,
      },
    });
  });
};

exports.deleteOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    let result = await Model.findByIdAndDelete(req.params.id);

    if (!result)
      throw new AppError(404, "No document with Restaurant ID found!");

    return res.status(200).json({
      status: "success",
      data: {
        result,
      },
    });
  });
};
