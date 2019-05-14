// @login & register
const express = require("express");
const router = express.Router();

const User = require("../../models/User");

// $route GET api/users/test
// @desc 返回的請求的json 數據
// @access public
router.get("/test", (req,res) => {
    res.json({msg:"login works"})
})

// $route POST api/users/test
// @desc 返回的請求的json 數據
// @access public
router.post("/register", (req,res)=> {
    console.log(req.body);

    // 查詢數據庫中是否擁有郵箱
    User.findOne({email: req.body.email})
        .then((user)=> {
            if(user) {
                return res.status(400).json({email:"郵箱已被註冊!"})
            }else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                })
            }
        })
})

module.exports = router;