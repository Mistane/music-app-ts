import { body } from "express-validator";

const registerValidationRules = [
  body("fullName")
    .notEmpty()
    .trim()
    .withMessage("Username khong duoc de trong"),
  body("email").notEmpty().trim().withMessage("Email khong duoc de trong"),
  body("password")
    .notEmpty()
    .trim()
    .withMessage("password khong duoc de trong"),
];

const loginValidationRules = [
  body("email").notEmpty().trim().withMessage("Email khong duoc de trong"),
  body("password")
    .notEmpty()
    .trim()
    .withMessage("password khong duoc de trong"),
];

export const userMiddleware = {
  registerValidationRules,
  loginValidationRules,
};
