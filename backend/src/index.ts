import express from "express";
import cors from "cors";
import "dotenv/config";
import "./db";

import {
  addItem,
  checkItem,
  clearItems,
  deleteItem,
  editItem,
  getItems,
} from "./controller/todoController";
import cookieParser from "cookie-parser";
import { check, logout, signin, signup } from "./controller/userController";
import { authMiddlewere } from "./middleware/authMiddleware";
import businessRouter from "./Routes/BusinessRoutes";
import path from "path";

const app = express();

app.use(
  "/public/image",
  express.static(path.join(__dirname, "../public/image"))
);

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("This sever is for Todo app");
});

app.get("/getuser", authMiddlewere, check);
app.post("/logout", logout);
app.post("/signup", signup);
app.post("/signin", signin);

app.get("/getitems", authMiddlewere, getItems);
app.post("/additem", authMiddlewere, addItem);
app.put("/checkitem", authMiddlewere, checkItem);

app.put("/edititem", authMiddlewere, editItem);

app.delete("/deleteitem", authMiddlewere, deleteItem);

app.delete("/clearitems", authMiddlewere, clearItems);

// --------------------------- Business ------------------------------- //

app.use("/business", authMiddlewere, businessRouter);

// --------------------------- Business ------------------------------- //

app.listen(process.env.PORT, () => {
  console.log(`app is running on http://localhost:${process.env.PORT}/`);
});
