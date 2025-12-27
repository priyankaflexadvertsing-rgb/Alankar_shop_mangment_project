import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel from "../models/user.model.js";
import dotenv from "dotenv";
import { printingRateConfig } from "./rate-cofig.js";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
    },
    async (_, __, profile, done) => {
      try {
        const email = profile.emails?.[0].value;

        let user = await userModel.findOne({ email });

        if (!user) {
          user = await userModel.create({
            name: profile.displayName,
            email,
            image: profile.photos?.[0].value,
            password: Math.random().toString(36), 
            rate : printingRateConfig // Assign default rate config
          });
        }

        done(null, user);
      } catch (err) {
        done(err, false);
      }
    }
  )
);

// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: process.env.GITHUB_CLIENT_ID!,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET!,
//       callbackURL: "/auth/github/callback",
//     },
//     async (_, __, profile, done) => {
//       try {
//         const email = profile.emails?.[0].value;

//         let user = await userModel.findOne({ email });

//         if (!user) {
//           user = await userModel.create({
//             name: profile.username,
//             email,
//             image: profile.photos?.[0].value,
//             password: Math.random().toString(36),
//           });
//         }

//         done(null, user);
//       } catch (err) {
//         done(err, false);
//       }
//     }
//   )
// );
export default passport;

// --- DELETED CODE --- 














// type Size = { width: number; height: number }; // in inches or ft

// interface PriceInput {
//   product: string;
//   type: string;
//   quantity: number;
//   size?: Size; // required for area-based products like flex, LED board, poster
// }

// interface PriceOutput {
//   unitPrice: number;
//   totalPrice: number;
// }

// export const calculatePrice = (
//   rate: any,
//   input: PriceInput
// ): PriceOutput => {
//   const { product, type, quantity, size } = input;

//   if (!rate[product] || !rate[product][type]) {
//     throw new Error(`Rate not found for ${product} -> ${type}`);
//   }

//   const unitPrice = rate[product][type];
//   let totalPrice = 0;

//   /** AREA-BASED PRODUCTS (sq ft) */
//   const areaBasedProducts = [
//     "flex",
//     "led_board",
//     "3D_letter",
//     "eco_solvent_printing",
//     "poster",
//     "one_way_vision",
//     "flex_board",
//   ];

//   if (areaBasedProducts.includes(product)) {
//     if (!size) {
//       throw new Error(`Size required for area-based product: ${product}`);
//     }

//     /** convert inches to feet if needed */
//     const widthFt = size.width / 12;
//     const heightFt = size.height / 12;
//     const area = widthFt * heightFt; // in sq ft

//     totalPrice = area * unitPrice * quantity;
//   } else {
//     /** UNIT-BASED PRODUCTS */
//     totalPrice = unitPrice * quantity;
//   }

//   return {
//     unitPrice,
//     totalPrice,
//   };
// };
