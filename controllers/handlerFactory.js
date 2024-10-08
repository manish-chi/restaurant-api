const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const fs = require("fs");


exports.getAll = (Model) => {
  return catchAsync(async (req, res, next) => {
    let results = await Model.find();
    return res.status(200).json({
      status: "success",
      data: {
        results,
      },
    });
  });
};

exports.getOne = (Model, popOptions) => {
  return catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOptions) query.populate(popOptions);

    let result = await query;

    if (!result) return next(new AppError(404, "Invalid Restaurant ID"));

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
    let result = await Model.create(req.body);
    return res.status(201).json({
      status: "success",
      data: {
        result,
      },
    });
  });
};

exports.getCard = (path) => {
  return catchAsync(async (req, res, next) => {
    try {
      let data = fs.readFileSync(path, "utf8");

      return res.status(200).json({
        status: "success",
        data: data,
      });
    } catch (err) {
      return next(new AppError(err.statusCode,err.message));
    }
  });
};

exports.updateOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    let obj = req.body;

    let doc = await Model.findById({ _id: req.params.id });

    let listOfAttributes = Object.keys(doc._doc);

    let isAttributePresentOrNot = listOfAttributes.some((ele) => {
      return Object.keys(obj).includes(ele);
    });

    if (!isAttributePresentOrNot)
      throw new AppError(
        400,
        "The requested attribute can't be updated in database"
      );

    let updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedDoc)
      return next(new AppError(404, "Restaurant with ID not found!!!"));

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
      return next(new AppError(404, "No document with Restaurant ID found!"));

    return res.status(200).json({
      status: "success",
      data: {
        result,
      },
    });
  });
};
