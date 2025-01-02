import express from "express";
import path from "path";

import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import accessoryRouter from "./routes/accessoryRoutes";
import cartRouter from "./routes/cartRoutes";
import categoryRouter from "./routes/categoryRoutes";
import contactRouter from "./routes/contactRoutes";
import discountRouter from "./routes/discountRoutes";
import orderRouter from "./routes/orderRoutes";
import passwordResetRouter from "./routes/passwordResetRoutes";
import productRouter from "./routes/productRoutes";
import {
  default as reminderRouter,
  default as reviewRouter,
} from "./routes/reminderRoutes";
import subscribeRouter from "./routes/subscribeRoutes";
import userRouter from "./routes/userRoutes";
import authRouter from "./routes/authRoutes";
const app = express();
//? Middleware
const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, 
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static('public'));
app.use(express.static(path.join(__dirname, "dist")));
app.use('/public', express.static(path.join(__dirname, './../public')));


// app.use(express.static(path.join(__dirname, "dist")));
// app.use("/upload", express.static(path.join(__dirname, "./../public")));
// app.use(express.static(path.resolve("./public")));
app.use("/api/v1/auth", authRouter);

app.use("/api/v1/user", userRouter);

app.use("/api/v1/cart", cartRouter);

app.use("/api/v1/order", orderRouter);

app.use("/api/v1/category", categoryRouter);

app.use("/api/v1/product", productRouter);

app.use("/api/v1/accessory", accessoryRouter);

app.use("/api/v1/subscribe", subscribeRouter);

app.use("/api/v1/contact", contactRouter);

app.use("/api/v1/passwordReset", passwordResetRouter);

app.use("/api/v1/reminder", reminderRouter);

app.use("/api/v1/review", reviewRouter);

app.use("/api/v1/discount", discountRouter);

export default app;
