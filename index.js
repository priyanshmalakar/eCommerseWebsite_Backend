const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
// const productRoutes = require("./routes/productRoutes");
// const orderRoutes = require("./routes/orderRoutes");
// const paymentRoutes = require("./routes/paymentRoutes");
// const categoryRoutes = require("./routes/categoryRoutes");

dotenv.config();
const connectDB = require("./conn/db");
connectDB();
const app = express();
app.use(cors());

app.use(express.json());
app.use("/api/users", userRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/payments", paymentRoutes);
// app.use("/api/categories", categoryRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server is up and running", PORT);
});
