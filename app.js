const express = require("express");
const session = require('express-session');
const cors = require('cors');
const mongoose = require("mongoose");
const app = express();
const port = 3000;


const url = "mongodb+srv://cing16339:1234@db-eccomerce.qts16aa.mongodb.net/?retryWrites=true&w=majority&appName=DB-eccomerce";
app.use(express.json());

app.use(cors({
    credentials: true,
    origin: "http://127.0.0.1:5500"
}));

app.use(session({
    secret: "your_key",
    resave: false,
    saveUninitialized: false,
}))

const schemaUser = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    password: String,
    image: String
});

const user = mongoose.model("User", schemaUser);

 

mongoose.connect(url)
    .then(() => {
        const checkLogin = (req, res, next) => {
            if (!req.session.userId) {
                return res.status(401).json("Login First!");
            }
            next();
        }

        app.get("/", checkLogin, async (req, res) => {
            const userFind = await user.findById(req.session.userId);
            res.json({ message: "Welcome user!", userdata: userFind});
        })

        const multer = require("multer");
        const path = require("path");

        // Multer storage config
        const storage = multer.diskStorage({
            destination: (req, file, cb) => cb(null, "uploads/"),  
            filename: (req, file, cb) =>
                cb(null, Date.now() + path.extname(file.originalname)),
        });

        const upload = multer({ storage });

        // Update profile route
        app.post("/updateProfile", upload.single("image"), async (req, res) => {
            try {
                const userId = req.session.userId;
                if (!userId) {
                    return res.status(401).json({ message: "Not logged in!" });
                }

                // file info from multer
                const file = req.file;
                if (!file) {
                    return res.status(400).json({ message: "No image uploaded!" });
                }

                // update user profile in MongoDB
                const findUser = await user.findByIdAndUpdate(
                    userId,
                    { image: `uploads/${file.filename}` }, // store file path (or full URL)
                    { new: true }
                );

                res.status(200).json({
                    message: "Profile updated successfully!",
                    data: findUser,
                });
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        app.post("/login", async (req, res) => {
            try {
                const { email, password } = req.body;
                const findUser = await user.findOne({ email: email, password: password });
                if (findUser) {
                    req.session.userId = findUser._id;
                    req.session.userEmail = findUser.email;
                    res.status(200).json("Login successfully!");
                    console.log(req.session)
                } else {
                    res.status(404).json("Invalid email or password!");
                }
            } catch (err) {
                res.status(500).json({ err: err.message });
            }
        })

        app.post("/register", async (req, res) => {
            try {
                const { name, email, phone, password } = req.body;
                const finuser = await user.findOne({ email: email });
                if (finuser) {
                    return res.json("Email already exist!");
                }
                const newUser = new user({ name: name, email: email, phone: phone, password: password});
                await newUser.save();
                res.status(200).json({ message: "Register successfully!", user: newUser });
            } catch (err) {
                res.status(500).json({ err: err.message });
            }
        })

        app.post("/logout", async (req, res) => {
            try {
                req.session.destroy(() => {
                    res.clearCookie("connecct.sid");
                    res.status(200).json("Logout successfully!");
                })
            } catch (err) {
                res.status(500).json({ err: err.message });
            }
        })

        app.listen(port, () => {
            console.log(`MongoDb Connected! : http://127.0.0.1:${port}`);
        })

    })
    .catch(err => {
        console.error(err.message);
    })