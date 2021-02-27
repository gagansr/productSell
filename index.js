const express = require("express");
const { MOGOURI } = require("./config/keys");
const app = express();

const cors = require("cors");

const mongoose = require("mongoose");
app.use(cors());

require("./paytm")(app);
const userRoute = require("./routes/userRoute");
const productRouter = require("./routes/productRoute");
const purchaseRouter = require("./routes/purchaseRoute");
const purchasedRouter = require("./routes/purchasedProduct");

const PORT = process.env.PORT || 5000;

mongoose.connect(MOGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.connection.on("connected", () => {
  console.log("DB is connected !!");
});

mongoose.connection.on("error", () => {
  console.log("DB is not connected !!");
});

app.get("/", (req, res) => {
  res.send("Hello Gagan!!");
});
const authRoute = require("./routes/authRoute");
// const isAdmin = require('./middleware/isAdmin');

app.use(express.json());
app.use(authRoute);
// app.use(isAdmin);
app.use("/user", userRoute);
app.use("/product", productRouter);
app.use("/purchaseproduct", purchaseRouter);
app.use("/purchasedProduct", purchasedRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("Server is Live now on Port ", PORT);
});
