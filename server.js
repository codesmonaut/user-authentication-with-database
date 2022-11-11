require(`dotenv`).config();
const express = require(`express`);
const mongoose = require(`mongoose`);
const bcrypt = require(`bcryptjs`);
const User = require(`./models/userModel`);

// App config
const app = express();
const port = process.env.PORT || 3030;
const databaseURI = process.env.MONGODB_URI;

// Middlewares
app.use(express.json());

// DB config
mongoose.connect(databaseURI).then(console.log(`Connected to database`));

// API endpoints
app.post(`/users/register`, async (req, res) => {
    
    try {
        const email = req.body.email;
        const password = req.body.password;

        const salt = await bcrypt.genSalt(16);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            email: email,
            password: hashedPassword
        }

        User.create(newUser, (err, data) => {

            if (err) {
                res.status(500).send({error: err});
            }

            if (!err) {
                res.status(201).send();
            }
        })

    } catch (err) {
        res.status(500).send({error: err});
    }
})

app.post(`/users/login`, async (req, res) => {

    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({email: email});

        const passwordCheck = await bcrypt.compare(password, user.password);

        if (passwordCheck) {
            res.status(200).send(`Logged in successfully.`);
        }

        if (!passwordCheck) {
            res.status(400).send(`Not allowed`);
        }

    } catch (err) {
        res.status(500).send({error: err});
    }
})

// Listener
app.listen(
    port,
    console.log(`Server is running on port http://localhost:${port}`)
)