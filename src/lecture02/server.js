const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const { createReadStream } = require("fs");

const USERSDB = {
  alice: "alice-pwd",
  bob: "bob-pwd",
};

const app = express();
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  const { username } = req.cookies;
  if (username) {
    res.send(`Hi ${username}`);
  } else {
    createReadStream(path.join(__dirname, "index.html")).pipe(res);
  }
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = USERSDB[username];

  if (req.body.password === password) {
    res.cookie("username", username);
    res.send("Nice!");
  } else {
    res.send("Fail!");
  }
});

app.listen(3000);
