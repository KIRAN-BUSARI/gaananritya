import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import { join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

import { app } from "./app.js";
import connectDB from "./db/index.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8001, () => {
      console.log(`Server running on port http://localhost:${process.env.PORT || 8001}`);
    });
  })
  .catch((error) => {
    console.log("Server failed to start due to error: ", error);
  });