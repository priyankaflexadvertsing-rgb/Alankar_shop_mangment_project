import { Response } from "express";


// store the access and refresh token in an httpOnly secure cookie
export const setCookie = (name: string, value: string, res: Response) => {
  res.cookie(name, value, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
