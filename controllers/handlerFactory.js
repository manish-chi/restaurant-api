getAll = async (req, res, next) => {
  let results = await Model.find();
  return res.status(200).json({
    status: "success",
    data: {
      results,
    },
  });
};
