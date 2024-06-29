const sql = require("mssql"); // Add this line to import the sql module
const dbConfig = require("../dbConfig");
const bcrypt = require("bcryptjs");

class User {
  constructor(id, name, password, contact, email) {
    this.id = id;
    this.name = name;
    this.password = password;
    this.contact = contact;
    this.email = email;
  }

  static async getAllUsers() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = "SELECT * FROM Account";

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) =>
        new User(row.id, row.name, row.password, row.contactNumber, row.email)
    );
  }

  static async getUserById(id) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = "SELECT * FROM Account WHERE id = @id";

    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new User(
          result.recordset[0].id,
          result.recordset[0].name,
          result.recordset[0].password,
          result.recordset[0].contactNumber,
          result.recordset[0].email
        )
      : null;
  }

  static async createUser(newUserData) {
    //const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);
    //const connection = await sql.connect(dbConfig);

    const sqlQuery =
      "INSERT INTO Account (name,email) VALUES (@name, @email); SELECT SCOPE_IDENTITY() AS id";

    const request = connection.request();
    request.input("name", newUserData.name);
    request.input("email", newUserData.email);

    const result = await request.query(sqlQuery);

    connection.close();

    return this.getUserById(result.recordset[0].id);
  }

  static async updateUser(id, newUserData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery =
      "UPDATE Account SET name = @name, password= @passowrd, contactNumber= @contactNumber, email = @email WHERE id = @id"; // Parameterized query

    const request = connection.request();
    request.input("id", id);
    request.input("name", newUserData.name || null);
    request.input("passowrd", newUserData.password || null);
    request.input("contactNumber", newUserData.contactNumber || null);
    request.input("email", newUserData.email || null);

    await request.query(sqlQuery);

    connection.close();

    return this.getUserById(id);
  }

  static async deleteUser(id) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = "DELETE FROM Account WHERE id = @id";

    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.rowsAffected > 0;
  }
}
module.exports = User;
