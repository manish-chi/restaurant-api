import { callAgent } from "../utils/gptConnector.js";
import catchAsync from "../utils/catchAsync.js";
import crypto from 'crypto';

export const getChatResponse = catchAsync(async (req, res, next) => {
  const input = req.query.query;
  const sessionId = req.query?.sessionId ?? crypto.randomUUID();

  const response = await callAgent(input,sessionId);


  return res.status(200).json({
    status: "success",
    data: response,
  });
});
