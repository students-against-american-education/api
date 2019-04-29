const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const tjdb = require('tjdb');
const nodemailer = require("nodemailer");

const PORT = process.env.PORT || 8080;
let db = new tjdb("./database/members.tjdb");

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.status(200).send(db.getTable("members"));
});

app.post("/newUser", (req, res) => {
    let newUserData = {
        name: req.body.name,
        schoolName: req.body.schoolName,
        activeStatus: false
    }
    


});

app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);
});