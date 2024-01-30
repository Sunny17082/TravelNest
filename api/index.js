const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");
const User = require("./models/user");
const app = express();

const PORT = process.env.PORT;

const bcryptSalt = bcrypt.genSaltSync(10);

app.use(express.json());

app.use(
	cors({
		credentials: true,
		origin: "http://localhost:5173",
	})
);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connection successful..."))
    .catch((err) => console.log(err));

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt)
        });
        res.json(userDoc);
    } catch (err) {
        res.json(err);
    }
});

app.listen(PORT, () => {
    console.log("Server started on port 5000...");
});