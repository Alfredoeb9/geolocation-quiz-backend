const mongoose = require("mongoose");

const app = require("./api/index")

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
