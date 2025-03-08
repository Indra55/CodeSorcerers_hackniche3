const logUserActivity = require("../utils/logActivity");

router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });

        if (req.user) {
            await logUserActivity(req.user.id, "VIEW_PRODUCT", product.id);
        }

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
