const express = require("express")
const path = require("path")
const app = express()
const PORT = 8000

app.use(express.static(path.join(__dirname, "clientes", "build")))

app.listen(PORT, ()=>{
    console.log("server in port: " + PORT)
})