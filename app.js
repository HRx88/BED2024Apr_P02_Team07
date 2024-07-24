const express = require("express");
const app = express();
const AccountController = require("./controllers/AccountController");
const MsgController = require("./controllers/MessageController");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser"); // Import body-parser
//const path = require("path");
//const usersController = require("./controllers/usersController");
const port = 3000; //process.env.PORT || 3000;
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Static Files
//app.set("View engine", "ejs");
//app.set("View", path.join(__dirname, "View"));
app.use(express.static("public"));

app.get("/account/:id", AccountController.getUserById);

app.get("/Msg", MsgController.getAllMsg);
app.get("/Msg/acc", MsgController.getAccountsWithMsg);
app.post("/login", AccountController.login);
app.post("/register",AccountController.registerAccount)

app.post("/contact", MsgController.createMsg);

app.put("/account/:id", AccountController.updateUser);


app.delete("/account/:id",AccountController.deleteUser);

app.listen(port, async () => {
  try {
    // Connect to the database
    await sql.connect(dbConfig);
    console.log("Database connection established successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    // Terminate the application with an error code (optional)
    process.exit(1); // Exit with code 1 indicating an error
  }

  console.log(`Server listening on port ${port}`);
});

// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  // Perform cleanup tasks (e.g., close database connections)
  await sql.close();
  console.log("Database connection closed");
  process.exit(0); // Exit with code 0 indicating successful shutdown
});
