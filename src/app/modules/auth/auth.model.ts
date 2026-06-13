import bcrypt from "bcrypt";
import { model, models, Schema } from "mongoose";

import config from "../../config";
import { IUser } from "./auth.interface";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "manager", "member", "ADMIN", "MANAGER", "MEMBER"],
      default: "member",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    skills: {
      type: [String],
      default: [],
    },
    department: {
      type: String,
    },
    avatar: { type: String, default: null },
    avatarPublicId: { type: String, default: null },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const saltRounds = Number(config.bcrypt_salt_rounds) || 12;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

// Sanitize password after save
userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

// Global query filter --- never return deleted users
userSchema.pre(/^find/, function (this: any, next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const UserModel = models.User || model<IUser>("User", userSchema);
