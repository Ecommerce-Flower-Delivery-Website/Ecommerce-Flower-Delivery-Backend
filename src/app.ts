import express from "express";
import path from "path";

import userRouter from "./routes/userRoutes";
import cartRouter from "./routes/cartRoutes";
import orderRouter from "./routes/orderRoutes";
import categoryRouter from "./routes/categoryRoutes";
import productRouter from "./routes/productRoutes";
import accessoryRouter from "./routes/accessoryRoutes";
import subscribeRouter from "./routes/subscribeRoutes";
import contactRouter from "./routes/contactRoutes";
import passwordResetRouter from "./routes/passwordResetRoutes";
import reminderRouter from "./routes/reminderRoutes";
import reviewRouter from "./routes/reminderRoutes";
import discountRouter from "./routes/discountRoutes";

const app = express();

app.use(express.static(path.resolve("./public")));

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
