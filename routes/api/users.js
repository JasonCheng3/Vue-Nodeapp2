// @login & register
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt"); // 加密檔
const jwt = require('jsonwebtoken'); // 資訊鑰匙
const gravatar = require("gravatar");  // 頭像套件
const keys = require("../../config/keys"); // 第9回
const passport = require("passport");
const User = require("../../models/User");

// $route GET api/users/test
// @desc 返回的請求的json 數據
// @access public
router.get("/test", (req,res) => {
    res.json({msg:"login works"})
})

// $route POST api/users/register
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
                const avatar = gravatar.url(req.body.email , {s: '200', r: 'pg', d: 'mm'});

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                })

                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newUser.password , salt, function(err, hash) {
                        // Store hash in your password DB.
                        if(err) throw err;
                        newUser.password = hash;
                        
                        newUser.save()
                                .then(user => res.json(user))
                                .catch(err => console.log(err));
                    });
                });
            }
        })
})

// $route POST api/users/login
// @desc 返回token jwt passport
// @access public

router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    // 查詢數據庫
    User.findOne({email})
        .then(user =>{
            if(!user){
                return res.status(404).json({email:'用戶不存在'})
            }
            // 密碼匹配
            // Load hash from your password DB.
            bcrypt.compare(password, user.password)
            .then( isMatch => {
                if(isMatch) {
                    const rule = {id:user.id,name:user.name};
                    // jwt.sign(rule, "secret","過期時間", "箭頭函數")
                    jwt.sign(rule, keys.secretOrKey, {expiresIn:600}, (err,token)=>{
                        if(err) throw err;
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    })
                    // res.json({msg: "success"});
                }else {
                    return res.status(404).json({password: "密碼錯誤!"});
                }
            });
        });
})

// $route GET api/users/current
// @desc return current user
// @access Private
// router.get("/current", "驗證token", (req,res) => {
router.get("/current", passport.authenticate("jwt", {session:false}) , (req,res) => {
    // res.json(req.user); 
    res.json({
        id: req.user.id,
        name: req.user.name,
        email:req.user.email
    })
})

module.exports = router;