const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const tjdb = require('tjdb');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "",
        pass: ""
    }
});

const PORT = process.env.PORT || 8080;
let db = new tjdb("./database/members.tjdb");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
    res.status(200).send(db.getTable("members"));
});

app.post("/newUser", (req, res) => {
    let newUserData = {
        name: req.body.name,
        schoolName: req.body.school,
        email: req.body.email,
        activeStatus: false
    }

    console.log(newUserData);

    //TODO: Make sure email addresses, when sent, have all whitespace removed
    let existingEmails = db.getColumn("member_emails", "email");

    for (let i = 0;i < existingEmails.length;i++) {
        if (existingEmails[i] === newUserData.email) {
            res.status(500).send({ errCode: 1, errMsg: "Email address already in use" });
            return;
        }
    }
    
    db.insertSingle("members", [newUserData.name, newUserData.schoolName, newUserData.activeStatus]);
    db.insertSingle("member_emails", [newUserData.email]);

    let newUserEmail = {
        from: "",
        to: newUserData.email,
        subject: "Welcome to Students Against American Education",
        html: "<h1></h1>" //TODO: Create email html structure
    }

    transporter.sendMail(newUserEmail, (err, info) => {
        if (err) {
            console.log(err);
            res.status(500).send({ errCode: 2, errMsg: "Error sending email"});
        } else {
            console.log(info);
            res.status(200).send();
        }
    });
});

app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);
});