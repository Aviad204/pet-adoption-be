const express = require("express");
const app = express();
const port = 5500;
const cors = require("cors");
const { postgrator } = require("./lib/db");
const path = require("path");
const cookieParser = require("cookie-parser");
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use(cookieParser());
app.use(express.json());
app.use("/pets", require("./routes/pets"));
app.use("/users", require("./routes/users"));

postgrator
  .migrate()
  .then((result) => {
    console.log("success " + result);
    app.listen(port, async () => {
      console.log(`Server is listening at http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));
