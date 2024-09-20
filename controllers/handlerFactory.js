const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const fs = require("fs");
<<<<<<< HEAD
const path = require("path");
=======
const AppError = require("../utils/appError");
const fs = require("fs");
>>>>>>> mail-feature-for-reservation

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

<<<<<<< HEAD
exports.getCard = (pathOfFile) => {
  return catchAsync(async (req, res, next) => {
    try {
      const filePath = path.join(__dirname, pathOfFile);

      let data = fs.readFileSync(filePath, "utf8");
=======
exports.getCard = (path) => {
  return catchAsync(async (req, res, next) => {
    try {
      let data = fs.readFileSync(path, "utf8");
>>>>>>> mail-feature-for-reservation

      return res.status(200).json({
        status: "success",
        data: data,
      });
    } catch (err) {
<<<<<<< HEAD
      throw new AppError(400, err.message);
=======
      return next(new AppError(err.statusCode,err.message));
>>>>>>> mail-feature-for-reservation
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
