const path = require("path");
const { randomBytes } = require("crypto");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { createReadStream } = require("fs");

const COOKIE_SECRET = "mwIYZwm8EMZeF98JsHzoH2EZnV5TkS5k";

const USERSDB = {
  alice: "alice-pwd",
  bob: "bob-pwd",
};
const BALANCES = {
  alice: 500,
  bob: 400,
};
const SESSIONS = {};

const app = express();

app.use(cookieParser(COOKIE_SECRET));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  const { sessionId } = req.cookies;
  const username = SESSIONS[sessionId];
  if (username) {
    const balance = BALANCES[username];
    res.send(`Hi ${username}, your balance is $${balance}`);
  } else {
    createReadStream(path.join(__dirname, "index.html")).pipe(res);
  }
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = USERSDB[username];

  if (req.body.password === password) {
    const nextSessonId = randomBytes(16).toString("base64");
    res.cookie("sessionId", nextSessonId);
    SESSIONS[nextSessonId] = username;
    res.redirect("/");
  } else {
    res.send("Fail!");
  }
});

app.get("/logout", (req, res) => {
  const { sessionId } = req.cookies;
  delete SESSIONS[sessionId];
  res.clearCookie("sessionId");
  res.redirect("/");
});
app.listen(3000);
