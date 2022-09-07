import app from "./app";
import { connectDB } from "./db";

(async () => {
  try {
    await connectDB();
    app.listen(3000);
    console.log("http://localhost:3000");
  } catch (error) {
    console.error(error);
  }
})();
