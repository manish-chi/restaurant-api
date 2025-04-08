import {callAgent} from "../utils/gptConnector.js";
import catchAsync from '../utils/catchAsync.js';

export const getChatResponse = catchAsync(async (req, res, next) => {

  const input = req.body.query;

  const response = await callAgent(input);

  return res.status(200).json({
    status: "success",
    data: response,
  });
});
