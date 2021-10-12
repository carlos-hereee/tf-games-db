const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    res
      .status(200)
      .json({ status: "success", message: "made it to users router" });
  } catch {
    res
      .status(400)
      .json({ status: "failure", message: "route could not be found" });
  }
});

module.exports = router;
