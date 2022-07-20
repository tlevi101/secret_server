require("dotenv").config();
const express = require("express");
require("express-async-errors");

const app = express();

app.use(express.json());

//Routers
const authRouter =  require("./routers/auth");
const secretRouter = require("./routers/secret");
//Router bindings
app.use("/", authRouter);
app.use("/", secretRouter);
//Middlewares
const validatationMiddleware = require("./middlewares/validation");
const lastMiddleware = require("./middlewares/last");
app.use(validatationMiddleware);
app.use(lastMiddleware);
//Srart App
(async () => {
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
        console.log(`Express app running on port ${port}`);
    });
})();
