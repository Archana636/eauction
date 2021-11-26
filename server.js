const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const keys = require("./config/keys");
const users = require("./routes/api/users");

const app = express();
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());



// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

var dbcon = mongoose.connection;

//store session in Mongo DB
  app.use(
    session({
      name: keys.SESS_NAME,
      secret: keys.SESS_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV == "production",
        maxAge: keys.SESS_LIFETIME
      },
      store: new MongoStore({
        mongooseConnection: dbcon
      })
    })
  );
  app.set('trust proxy', 1);

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
