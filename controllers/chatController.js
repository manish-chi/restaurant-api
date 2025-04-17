import { callAgent } from "../utils/gptConnector.js";
import catchAsync from "../utils/catchAsync.js";

export const getChatResponse = catchAsync(async (req, res, next) => {
  const input = req.body.query;

  const response = await callAgent(
    input,
    "66cc240c2b0664128bf63752",
    req.sessionId
  );

  console.log(response);

  return res.status(200).json({
    status: "success",
    data: response.output,
  });
});
