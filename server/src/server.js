import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./db/db.js";

import  app  from "./app.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Express App error", error);
      throw error;
    });
    app.listen(process.env.PORT || 5000, () => {
      console.log(
        `Express app is listening on port ${process.env.PORT}`
      );
    });
  })
  .catch((error) => {
    console.log("Mongo DB connection FAILED", error);
  });