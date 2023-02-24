const getTest = async (req, res) => {
  try {
    return res.status(200).json({ msg: "testing" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getTest,
};
