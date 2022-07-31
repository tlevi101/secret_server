require("dotenv").config();
const express = require("express");
require("express-async-errors");

const app = express();

app.use(express.json());
//Middlewares
const cors = require('cors');
const validatationMiddleware = require("./middlewares/validation");
const lastMiddleware = require("./middlewares/last");
app.use(cors());
app.use(validatationMiddleware);
app.use(lastMiddleware);
//Routers
const authRouter =  require("./routers/auth");
const secretRouter = require("./routers/secret");
//Router bindings
app.use("/", authRouter);
app.use("/", secretRouter);

//Srart App
(async () => {
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
        console.log(`Express app running on port ${port}`);
    });
})();
