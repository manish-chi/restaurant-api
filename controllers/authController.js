const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const JWT = require("jsonwebtoken");

function sendAccessToken(user, res) {
  let userId = user._id;

  let token = JWT.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  let cookieOptions = {
    expiresIn: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV == "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;
  user.passwordConfirm = undefined;

  return res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
}

exports.signup = catchAsync(async (req, res, next) => {
  let user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  sendAccessToken(user, res);
});

exports.login = catchAsync(async (req, res, next) => {
  let { email, password } = req.body;

  if (!email || !password)
    throw new AppError(400, "Please provide email & password");

  let user = await User.findOne({ email: req.body.email });
  if (!user)
    throw new AppError(404, "User associated with email address is not found");

  if (!user.comparePasswords(user.password, req.body.password)) {
    throw new AppError(401, "Sorry, Password is incorrect! Please try again!");
  }

  req.user = user;

  sendAccessToken(user, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  if (!req.headers.authorization) {
    throw new AppError(400, "Authorization headers are not provided.");
  }

  let token = "";

  if (req.headers.authorization) {
    if (req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
  }

  let decoded = JWT.verify(token, process.env.JWT_SECRET);

  let user = User.findById({ _id: decoded.id });

  if (!user)
    throw new AppError(404, "User belonging to this token no longer exists.");

  req.user = user;

  next();
});

exports.generateDirectLineToken = catchAsync(async (req, res, next) => {
  const userId = "dl_" + req.params.id;
  

  if (!userId) throw new AppError(404, "Sorry, User with ID not found!");

  try {
    const response = await fetch(
      "https://directline.botframework.com/v3/directline/tokens/generate",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + process.env.DIRECTLINE_SECRET,
        },
        json: {
          user: { id: userId ,name : 'manish chitre' },
          trustedOrigins: ["http://localhost:8000"]
        },
      }
    );

    if (response.ok) {
      const body = await response.json();
      res.json({
        token: body.token,
        userId: userId,
      });
    } else {
      throw new AppError(500, "Call to retrieve token from Direct Line failed");
    }
  } catch (err) {
    throw new AppError(err.statusCode,err.message);
  }
});
