require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const geolocationRoutes = require("./routes/geolocationRoutes");
// const userRoutes = require("./routes/userRoutes");

// express app
const app = express();

// enable CORS
app.use(cors());

app.use(express.json());

app.use("/api/geolocation", geolocationRoutes);
// app.use("/api/user", userRoutes);

// middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    //listen to request
    app.listen(process.env.PORT, () => {
      console.log("We are flying on port ✈️ ", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
