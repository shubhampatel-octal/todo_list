import mongoose, { Schema, model } from "mongoose";

interface ITodoList {
  title: string;
  chacked: boolean;
  userId: mongoose.Types.ObjectId;
}

const TodoListSchema = new Schema<ITodoList>({
  title: { type: String, required: true },
  chacked: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});

export const TodoList = model<ITodoList>("TodoList", TodoListSchema);
