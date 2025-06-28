const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const { PORT } = require("./config");

connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" })); // body-parser

app.get("/", (_, res) => res.json({ message: "Ciao Kombucha Locator API 😎" }));

/* Global error handler */
app.use((err, _, res, __) => {
	console.error(err);
	res.status(500).json({ error: err.message || "Server error" });
});

app.listen(PORT, () => console.log(`API up on http://localhost:${PORT}`));
