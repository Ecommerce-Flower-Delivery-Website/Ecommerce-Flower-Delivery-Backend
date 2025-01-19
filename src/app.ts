import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import accessoryRouter from "./routes/accessoryRoutes";
import cartRouter from "./routes/cartRoutes";
import categoryRouter from "./routes/categoryRoutes";
import contactRouter from "./routes/contactRoutes";
import giftDiscountRouter from "./routes/giftDiscountRoutes";
import orderRouter from "./routes/orderRoutes";
import passwordResetRouter from "./routes/passwordResetRoutes";
import productRouter from "./routes/productRoutes";
import reminderRouter from "./routes/reminderRoutes";
import reviewRouter from "./routes/reviewRoutes";
import subscribeRouter from "./routes/subscribeRoutes";
import userRouter from "./routes/userRoutes";
import authRouter from "./routes/authRoutes";
import globalErrorHandling from "./controllers/errorController";
import multer from "multer";



const app = express();
//? Middleware
app.use(
  cors({
    origin: "*",
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Set the correct policy here
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "dist")));
app.use("/public", express.static(path.join(__dirname, "./../public")));

// app.use(express.static(path.join(__dirname, "dist")));
// app.use(express.static(path.join(__dirname, "./../public")));





const upload = multer({ dest: "uploads/" });
app.post("/api/upload", upload.single("image"), (req, res) => {
  console.log(req.file);
  res.status(200).json(req.file);
});

app.use("/api/v1/orders", orderRouter);

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/users", userRouter);

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

app.use("/api/v1/giftDiscounts", giftDiscountRouter);

app.use(globalErrorHandling);

export default app;
