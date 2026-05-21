import bcrypt from "bcrypt";
import httpStatus from "http-status";
import config from "../../config";
import CustomAppError from "../../errors/CustomAppError";
import {
  ILoginPayload,
  IRegisterPayload,
  ITokenPayload,
} from "./auth.interface";
import { UserModel } from "./auth.model";
import { createToken, verifyToken } from "./auth.utils";

//  helpers

const buildTokenPair = (payload: ITokenPayload) => {
  const accessToken = createToken(
    payload,
    config.jwt_access_token_secret_key as string,
    config.jwt_access_token_expires_in as string
  );

  const refreshToken = createToken(
    payload,
    config.jwt_refresh_token_secret_key as string,
    config.jwt_refresh_token_expires_in as string
  );

  return { accessToken, refreshToken };
};

const assertUserExists = async (email: string) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new CustomAppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!user.isActive) {
    throw new CustomAppError(httpStatus.FORBIDDEN, "User account is inactive");
  }

  if (user.isDeleted) {
    throw new CustomAppError(httpStatus.FORBIDDEN, "User account is deleted");
  }

  return user;
};

//service methods

const registerUser = async (
  payload: IRegisterPayload,
  isInvite = false
) => {
  // Prevent role escalation on public register
  if (!isInvite) {
    payload.role = "member";
  }

  const existing = await UserModel.findOne({ email: payload.email });

  if (existing) {
    throw new CustomAppError(
      httpStatus.CONFLICT,
      "A user with this email already exists"
    );
  }

  const user = await UserModel.create({
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role: payload.role ?? "member",
    isActive: true,
    isDeleted: false,
  });

  const jwtPayload: ITokenPayload = {
    userId: String(user._id),
    email: user.email,
    role: user.role,
  };

  const { accessToken, refreshToken } = buildTokenPair(jwtPayload);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const loginUser = async (payload: ILoginPayload) => {
  const user = await UserModel.findOne({ email: payload.email }).select(
    "+password"
  );

  if (!user) {
    throw new CustomAppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  if (!user.isActive) {
    throw new CustomAppError(httpStatus.FORBIDDEN, "User account is inactive");
  }

  if (user.isDeleted) {
    throw new CustomAppError(httpStatus.FORBIDDEN, "User account is deleted");
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password
  );

  // Same error message for wrong email or wrong password
  // -- prevents user enumeration attacks
  if (!isPasswordMatched) {
    throw new CustomAppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  const jwtPayload: ITokenPayload = {
    userId: String(user._id),
    email: user.email,
    role: user.role,
  };

  const { accessToken, refreshToken } = buildTokenPair(jwtPayload);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const refreshToken = async (token: string) => {
  const decoded = verifyToken(
    token,
    config.jwt_refresh_token_secret_key as string
  );

  const user = await UserModel.findById(decoded.userId);

  if (!user) {
    throw new CustomAppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!user.isActive) {
    throw new CustomAppError(httpStatus.FORBIDDEN, "User account is inactive");
  }

  if (user.isDeleted) {
    throw new CustomAppError(httpStatus.FORBIDDEN, "User account is deleted");
  }

  const jwtPayload: ITokenPayload = {
    userId: String(user._id),
    email: user.email,
    role: user.role,
  };

  const { accessToken } = buildTokenPair(jwtPayload);

  return { accessToken };
};

const getMe = async (userId: string) => {
  const user = await UserModel.findById(userId).select(
    "-password -isDeleted"
  );

  if (!user) {
    throw new CustomAppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await UserModel.findById(userId).select("+password");

  if (!user) {
    throw new CustomAppError(httpStatus.NOT_FOUND, "User not found");
  }

  const isMatched = await bcrypt.compare(oldPassword, user.password);

  if (!isMatched) {
    throw new CustomAppError(
      httpStatus.UNAUTHORIZED,
      "Old password is incorrect"
    );
  }

  // Assign and save -- pre-save hook will hash it
  user.password = newPassword;
  await user.save();

  return { message: "Password changed successfully" };
};

export const AuthService = {
  registerUser,
  loginUser,
  refreshToken,
  getMe,
  changePassword,
};