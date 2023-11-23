import nodemailer from 'nodemailer';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

const { users } = require('../../models');

dotenv.config();

export const tokenVarify = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const secretKey: any = process.env.SECRET_KEY;
    const token: any = req.cookies.access_token;
    if (!token) {
      return res.status(400).json({
        message: 'A token is required for authentication',
        status: 400,
        success: false,
      });
    }
    // const authHeader: any = req.headers.authorization;
    // const bearerToken: any = authHeader.split(" ");
    // let myToken: any = bearerToken[1];
    await jwt.verify(token, secretKey, async (error: any, payload: any) => {
      if (payload) {
        req.id = payload.id;
        next();
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid token',
          data: error.message,
        });
      }
      return true;
    });
  } catch (e: any) {
    return res.json({
      success: false,
      statusCode: 400,
      message: e.message,
    });
  }
  return true;
};

export const sendMail = async (req: Request, res: Response, html: any) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MY_MAIL,
        pass: process.env.MY_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.MY_MAIL,
      to: req.body.email,
      subject: 'Verify your mail',
      html,
    };
    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.log('>>>>>>>>>>error', error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });
  } catch (e: any) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
  return true;
};

export const userVerifiedEmail = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const emailTrim = email.trim();
    const otpTrim = otp.trim();
    const otpNumber = Number(otpTrim);
    const findData = await users.findOne({
      where: {
        email: emailTrim,
      },
    });
    if (!findData) {
      return res.render('verifyemail', {
        msg: 'user not found',
      });
    }
    const finalResult = findData.dataValues.otp;
    const { otpExpTime } = findData.dataValues;
    if (finalResult !== otpNumber) {
      return res.render('verifyemail', {
        msg: 'otp are not match',
      });
    }
    const values = findData.dataValues.isVerified;
    // const jwtToken = await jwt.sign({ id }, secretKey, {
    //   expiresIn: '24h',
    // });
    //  const date:any = new Date()
    if (values === true) {
      return res.redirect('http://localhost:8000/api/auth/user/login');
    }

    if (otpExpTime < Date.now()) {
      return res.render('verifyemail', {
        msg: 'your otp will be expire',
      });
    }

    if (values === false) {
      await users.update(
        { isVerified: true },
        {
          where: {
            otp: otpNumber,
          },
        },
      );

      return res.redirect('http://localhost:8000/api/auth/user/login');
    }
  } catch (e: any) {
    return res.json({
      success: false,
      statusCode: 400,
      message: e.message,
    });
  }
  return true;
};

export const pageNotFound = async (req: Request, res: Response) => {
  try {
    console.log('sfdsfdsafdasdafaffd');
    res.render('404');
  } catch (e: any) {
    return res.json({
      statusCode: 500,
      message: e.message,
    });
  }
  return true;
};

export const searchFriendForFrontend = async (req, res, userId: any) => {
  const userData = await users.findAll({
    where: {
      id: {
        [Op.ne]: [userId],
      },
    },
    attributes: ['email', 'fullName', 'id'],
  });

  return userData;
};
