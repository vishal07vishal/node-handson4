const router = require("express").Router()
const bcrypt = require('bcrypt')
const users = [] //storing data and also accessing data
const jwtToken = require('jsonwebtoken')
const { check, validationResult } = require('express-validator') //validate email,password
router.post('/signup', [
    check("email", "please provide a valid mail")
        .isEmail(),
    check("password", "please provide a valid password greater than 6 character")
        .isLength({
            min: 6
        })
], async (req, res) => {
    const { email, password } = req.body
    // taking email and password from user

    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(400).json({
            error: error.array()
        });
    }
    // validating wether is existed or not
    let user = users.find((user) => { //finding user from req.body
        return user.email == email;
    })
    if (user) {
        res.status(400).json({
            "err": [
                {
                    "massege": "this user is already existed"
                }
            ]
        })
    }
    else if (!user) {
        res.status(400).json({
            "err": [
                {
                    "massege": "Registration successful"
                }
            ]
        })
    }
    const hashPassword = await bcrypt.hash(password, 10)//hashing the password given by user
    users.push({
        email,
        password: hashPassword
    })
    // console.log(users)
    // console.log(email,password)
   // res.send("Auth is working")
})
router.post('/login', async (req, res) => {
    const { password, email } = req.body
    let user = users.find((user) => {   //validating if user is present or not
        return user.email === email;
    })

    if (!user) {
        return res.status(400).json({
            "err": [
                {
                    "massege": "invalid Credentill, Please Register first"
                }
            ]
        })
    }

    let match = await bcrypt.compare(password, user.password)//if user is present then we compare the password entered by user with the password stored in users array
    if (!match) {
        return res.status(400).json({
            "err": [
                {
                    "massege": "invalid Credentill"
                }
            ]
        })
    }

    const token = await jwtToken.sign({
        email
    }, "lkjasdf", {
        expiresIn: 36000
    })
    res.json({
        token
    })
})
router.get('/api', (req, res) => {
    res.json(users)
})
module.exports = router;