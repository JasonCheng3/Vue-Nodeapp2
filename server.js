const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();

// 引入 users.js
const users = require('./routes/api/users');
const profiles = require('./routes/api/profiles');

// DB config
const db = require('./config/keys').mongoURI;
mongoose.set('useFindAndModify', false);
// 使用body-parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

mongoose
	.connect(db ,{useNewUrlParser: true})
	.then(() => console.log('MongoDB connected'))
	.catch(err => console.log(err))

// passport 初始化
app.use(passport.initialize());
require('./config/passport')(passport);
// app.get('/', (req, res) => {
// 	res.send('Hello World!');
// });

// 使用 routes
app.use('/api/users', users);
app.use('/api/profiles', profiles);

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
})