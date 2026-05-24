import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";

import config from "../config";
import CustomAppError from "../errors/AppError";

const authorizationGuard = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new CustomAppError(httpStatus.UNAUTHORIZED, "you are not authorized");
      }

      // checking the token, valid or invalid
      jwt.verify(token, config.jwt_access_token_secret_key as string, function (err, decoded) {
        // if the token is invalid then it will send error to global error handler
        if (err) {
          return next(new CustomAppError(httpStatus.UNAUTHORIZED, "you are not authorized"));
        }

        const decodedPayload = decoded as JwtPayload;
        // storing the role from the decoded payload
        const role = decodedPayload.role;

        // Perform case-insensitive checks to unify lowercase/uppercase differences
        const upperRole = role ? String(role).toUpperCase() : "";
        const upperRequiredRoles = requiredRoles.map((r) => r.toUpperCase());

        // checking if the role is included in the requiredRoles
        if (requiredRoles.length > 0 && !upperRequiredRoles.includes(upperRole)) {
          return next(new CustomAppError(httpStatus.UNAUTHORIZED, "you are not authorized"));
        }

        // Ensure _id exists even for old tokens using userId
        if (!decodedPayload._id && decodedPayload.userId) {
          decodedPayload._id = decodedPayload.userId;
        }

        // setting user in req
        req.user = decodedPayload;
        // call the next middleware/handler
        next();
      });
    } catch (error) {
      // if any error occurs, it will send to the global error handler
      next(error);
    }
  };
};

export default authorizationGuard;
