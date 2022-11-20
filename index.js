const express = require("express");
const auth = require("./route/auth")
const app = express();
app.use(express.json());
app.use('/auth',auth)

app.get('/',(req,res)=>{
    res.send("The backend logIn i process is completed");
})

app.listen(5000,()=>{
    console.log("server started ");
})