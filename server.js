require("doetenv").config();
const express = require("express");
const cors = require("cors");

// express app
const app = express();

// enable CORS
app.use(cors());

app.use(express.json());

// middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.listen(process.env.PORT, () => {
  console.log("Listening on port", process.env.PORT);
});
