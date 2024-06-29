const express = require("express");
const app = express();
const Controller = require("./controllers/AccountController");
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

app.get("/login", Controller.getAllUsers);

app.get("/user/:id", Controller.getUserById);

app.post("/", (req, res) => {
  res.send("Got a POST request");
});

app.put("/user/:id", Controller.updateUser);

app.patch("/user/:id", Controller.updateUser);

app.delete("/user", (req, res) => {
  res.send("Got a DELETE request at /user");
});

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
