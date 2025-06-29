const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const { PORT } = require("./config");

const storeRoutes = require("./routes/store.js");
const reportRoutes = require("./routes/report.js");

connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" })); // body-parser

app.get("/", (_, res) => res.json({ message: "Ciao Kombucha Locator API 😎" }));
app.use("/stores", storeRoutes);
app.use("/reports", reportRoutes);

/* Global error handler */
app.use((err, _, res, __) => {
	console.error(err);
	res.status(500).json({ error: err.message || "Server error" });
});

app.listen(PORT, () => console.log(`API up on http://localhost:${PORT}`));
