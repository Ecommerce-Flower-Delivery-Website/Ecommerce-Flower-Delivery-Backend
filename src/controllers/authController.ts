import { Request, Response, NextFunction } from "express";
import { createToken } from "../lib/jwt";
import { validateForgetPasswordSchema, validateSchemas, validateVerifyCodeSchema } from "../validation/userValidation";
import { User, UserType } from "../models/userModel";
import { sendResponse } from "@/utils/helpers";
import { sendEmail } from "../utils/sendEmail";
import CryptoJS from "crypto-js";
import cartModel from "@/models/cartModel";

/*
1- create user
2- send verification
3- send info of user + token
So after register have to to verfiy to be the user?.isAccountVerified=true

*/
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await validateSchemas.signup.parseAsync(req.body);

    const user = await User.create({ ...data, isAdmin: false });

    //Creating Verification Token of email and save it to DataBase :
    const verifyCode = Math.floor(Math.random() * 90000) + 10000;

    user.emailConfirmToken = verifyCode.toString();
    await user.save();



    // HTML template 
    const templateHTML = `
    <h1> Verfiy Your Email </h1>
    <p> The Verification Code is <span style="color: green; font-weight: bold;"> ${verifyCode} </span> </p>
    `
    //sending email to user
    sendEmail(data.email,"Verfiy You Email",templateHTML);
    //response 

    // const token = createToken({
    //   id: user._id,
    //   email: user.email,
    // });


    await cartModel.create({
      userId: user._id,
    })

    sendResponse(res, 200, {
      status: "success",
      data: {
        user: await user.toFrontend(),
        // token,
      },
    });
  } catch (error) {
    next(error);
  }
};


//at login will resend the verification as long as the user?.isAccountVerified=false
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await validateSchemas.login.parseAsync(req.body);

    const user = await User.findOne({ email: data.email });
    if (!user) {
      return sendResponse(res, 404, {
        status: "fail",
        message: `User doesn't exists`,
      });
    }


    const isAuth = await user.comparePassword(data.password);
    if (!isAuth) {
      return sendResponse(res, 401, {
        status: "fail",
        message: `invalid user name or password`,
      });
    }

    if (!user?.isAccountVerified) {
      
      if(!user?.emailConfirmToken){
        
        //Creating Verification Token of email and save it to DataBase :
         const verifyCode = Math.floor(Math.random() * 90000) + 10000;

          user.emailConfirmToken = verifyCode.toString();
          await user.save();

          
        // HTML template 
        const templateHTML = `
        <h1> Verfiy Your Email </h1>
        <p> The Verification Code is <span style="color: green; font-weight: bold;"> ${verifyCode} </span> </p>
        `
        //sending email to user
        sendEmail(data.email,"Verfiy You Email",templateHTML);
        //response 

        //just info of user because still need verification ( without token )
        return sendResponse(res, 400, {
          status: "success",
          data: {
            user: await user.toFrontend(),
          },

        });

      }
                
        // HTML template 
        const templateHTML = `
        <h1> Verfiy Your Email </h1>
        <p> The Verification Code is <span style="color: green; font-weight: bold;"> ${user.emailConfirmToken} </span> </p>
        `
        //sending email to user
        sendEmail(data.email,"Verfiy You Email",templateHTML);
        //response 

        //just info of user because still need verification ( without token )
        return sendResponse(res, 400, {
          status: "success",
          data: {
            user: await user.toFrontend(),
          },

        });


    }

    const token = createToken({
      id: user._id,
      email: user.email,
    });

    sendResponse(res, 200, {
      status: "success",
      data: {
        user: await user.toFrontend(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

//at login will resend the verification as long as the user?.isAccountVerified=false
export const login_admin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await validateSchemas.login.parseAsync(req.body);

    const user = await User.findOne({
      email: data.email,
      isAdmin: true,
    });
    if (!user) {
      return sendResponse(res, 404, {
        status: "fail",
        message: `User doesn't exists`,
      });
    }
    const isAuth = await user.comparePassword(data.password);
    if (!isAuth) {
      return sendResponse(res, 401, {
        status: "fail",
        message: `invalid credential`,
      });
    }

    if (!user?.isAccountVerified) {
      
      if(!user?.emailConfirmToken){
        
        //Creating Verification Token of email and save it to DataBase :
         const verifyCode = Math.floor(Math.random() * 90000) + 10000;

          user.emailConfirmToken = verifyCode.toString();
          await user.save();

          
        // HTML template 
        const templateHTML = `
        <h1> Verfiy Your Email </h1>
        <p> The Verification Code is <span style="color: green; font-weight: bold;"> ${verifyCode} </span> </p>
        `
        //sending email to user
        sendEmail(data.email,"Verfiy You Email",templateHTML);
        //response 

        sendResponse(res, 200, {
          status: "success",
          data: {
            user: await user.toFrontend(),
          },
        });
      }
                
        // HTML template 
        const templateHTML = `
        <h1> Verfiy Your Email </h1>
        <p> The Verification Code is <span style="color: green; font-weight: bold;"> ${user.emailConfirmToken} </span> </p>
        `
        //sending email to user
        sendEmail(data.email,"Verfiy You Email",templateHTML);
        //response 

    sendResponse(res, 200, {
      status: "success",
      data: {
        user: await user.toFrontend(),
      },
    });


    }
    
    const token = createToken({
      id: user._id,
      email: user.email,
    });

    sendResponse(res, 200, {
      status: "success",
      data: {
        user: await user.toFrontend(),
        token,
      },
    });
  } catch (error) {
    console.log(error, "error");
    next(error);
  }
};


//by this :  user?.isAccountVerified should be true or false by comapring 
//So if success that mean user got all steps of login or register completed
export const compareVerificationCode = async (
  req: Request & { user?: UserType },
  res: Response,
  next: NextFunction
)=>{

  try{
    
    const data = await validateVerifyCodeSchema.parseAsync(
            req.body
          );
    
    const user = await User.findOne({ email: data.email });
    if (!user) {
      return sendResponse(res, 404, {
        status: "fail",
        message: `User doesn't exists`,
      });
    }

        if(!data?.emailConfirmToken){
          return sendResponse(res, 404, {
            status: "fail",
            message: `User does not have verification code to compare!`,
          });
        }

        if(user?.emailConfirmToken===data?.emailConfirmToken){
         user.isAccountVerified=true;
        await user.save();
        }

        const token = createToken({
          id: user._id,
          email: user.email,
        });
        
        return sendResponse(res, 200, {
          status: "success",
          data: {
            user: await user.toFrontend(),
            token
          },
        });
      }

  catch (error) {
    console.log(error,"error")
    next(error);
  }

}

//resend new verfiy
export const resendCode = async (
  req: Request ,
  res: Response,
  next: NextFunction
)=>{
try{

  const data = await validateForgetPasswordSchema.parseAsync(req.body);

  const user = await User.findOne({ email: data.email });

  if (!user) {
    return sendResponse(res, 404, {
      status: "fail",
      message: `User doesn't exists`,
    });
  }


//Creating Verification Token of email and save it to DataBase :
    const verifyCode = Math.floor(Math.random() * 90000) + 10000;

    user.emailConfirmToken = verifyCode.toString();
    await user.save();

    const {name,emailConfirmToken,isReminder,isAdmin,email,isAccountVerified} = user;



    // HTML template 
    const templateHTML = `
    <h1> New Verfiy Your Email </h1>
    <p> The New Verification Code is <span style="color: green; font-weight: bold;"> ${verifyCode} </span> </p>
    `
    //sending email to user
    sendEmail(user.email,"New Verfiy You Email",templateHTML);


    sendResponse(res, 200, {
      status: "success",
      data: {user:{name,email,emailConfirmToken,isReminder,isAdmin,isAccountVerified}}
    });
}  
catch (error) {
  console.log(error,"error")
  next(error);}


}

//will recive the real password if user forgot 
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
)=>{
try{
  const data = await validateForgetPasswordSchema.parseAsync(req.body);

  const user = await User.findOne({ email: data.email });

  if (!user) {
    return sendResponse(res, 404, {
      status: "fail",
      message: `User doesn't exists`,
    });
  }

  const realPassword= CryptoJS.AES.decrypt(user.password.toString(), process.env.JWT_SECRET!).toString(CryptoJS.enc.Utf8)

  // HTML template 
        const templateHTML = `
        <h1>Your Password </h1>
        <p> The Password is <span style="color: green; font-weight: bold;"> ${realPassword} </span> </p>
        `  
        //sending email to user
        sendEmail(data.email,"Forgot Password",templateHTML);
        //response 
    sendResponse(res, 200, {
      status: "success",
      data: {user} ,
    });


}  
catch (error) {
  console.log(error,"error")
  next(error);}


}