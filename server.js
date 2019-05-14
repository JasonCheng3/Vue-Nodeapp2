const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const app = express();

// 引入 users.js
const users = require("./routes/api/users");

// DB config
const db = require("./config/key").mongoURI;

// 使用body-parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

mongoose
	.connect(db ,{useNewUrlParser: true})
	.then(() => console.log('MongoDB connected'))
	.catch(err => console.log(err))

app.get('/', (req, res) => {
	res.send('Hello World!');
});

// 使用 routes
app.use("/api/users", users);


const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
})