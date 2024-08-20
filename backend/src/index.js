import "dotenv/config";
import connectDB from "./db/index.js";
import app from "./app.js";

const port = process.env.PORT || 3000;

connectDB()
    .then(() => {
        app.on("error", (e) => {
            console.log("ERR: ", e);
            throw e;
        });

        app.listen(port, () => {
            console.log(`⚙  Server is running on port: ${port}`);
        });
    })
    .catch((e) => {
        console.log("MongoDB connection failed !!!", e);
    });
