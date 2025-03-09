const express = require("express");
const productController = require("../controllers/Product");
const router = express.Router();

router.post("/", productController.create);
router.get("/", productController.getAll);
router.get("/:id", productController.getById);
router.patch("/:id", productController.updateById);
router.delete("/:id", productController.deleteById);

module.exports = router;
