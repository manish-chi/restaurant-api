import { callAgent } from "../utils/gptConnector.js";
import catchAsync from "../utils/catchAsync.js";

export const getChatResponse = catchAsync(async (req, res, next) => {
  const input = req.query.query;
  const sessionId = req.query?.sessionId ?? null;

  const response = await callAgent(input,sessionId);

  return res.status(200).json({
    status: "success",
    data: response.output,
  });
});
