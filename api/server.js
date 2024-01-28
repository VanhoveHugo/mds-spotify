const express       = require('express');
const mongoose      = require('mongoose');

const app           = express();
const port          = process.env.API_PORT || 3000;

mongoose.connect(process.env.MONGO_URI)

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const userRoute     = require("./src/routes/userRoute");
userRoute(app);

app.listen(port);