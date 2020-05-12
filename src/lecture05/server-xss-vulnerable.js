const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { randomBytes } = require("crypto");

const COOKIE_SECRET = "mwIYZwm8EMZeF98JsHzoH2EZnV5TkS5k";
const SESSIONS = {};
const USERSDB = {
  alice: "alice-pwd",
  bob: "bob-pwd",
};
const BALANCES = {
  alice: 500,
  bob: 400,
};

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
  const source = req.query.source;
  if (username) {
    const balance = BALANCES[username];
    res.send(`
      Hi ${username}, your balance is $${balance}
      <form method="POST" action="/transfer">
        Send amount:
        <input name="amount" />
        To user:
        <input name="to" />
        <input type="submit" value="send" />
      </form>
    `);
  } else {
    res.send(`
      ${source ? `Hi ${source} reader` : ""}
      <h1>Login to your bank account:</h1>
      <form method="POST" action="/login">
        <label for="username">User:</label>
        <input name="username" />

        <label for="password">Password:</label>
        <input name="password" type="password" />

        <input type="submit" value="Login" />
      </form>
    `);
  }
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = USERSDB[username];

  if (req.body.password === password) {
    const nextSessonId = randomBytes(16).toString("base64");
    res.cookie("sessionId", nextSessonId, {
      // secure: true,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    SESSIONS[nextSessonId] = username;
    res.redirect("/");
  } else {
    res.send("Fail!");
  }
});

app.get("/logout", (req, res) => {
  const { sessionId } = req.cookies;
  delete SESSIONS[sessionId];
  res.clearCookie("sessionId", {
    // secure: true,
    httpOnly: true,
    sameSite: "lax",
  });

  res.redirect("/");
});

app.post("/transfer", (req, res) => {
  const { sessionId } = req.cookies;
  const username = SESSIONS[sessionId];
  if (!username) {
    res.send("Fail!");
    return;
  }

  const amount = Number(req.body.amount);
  const { to } = req.body;
  BALANCES[username] -= amount;
  BALANCES[to] += amount;

  res.redirect("/");
});

app.listen(3000);
