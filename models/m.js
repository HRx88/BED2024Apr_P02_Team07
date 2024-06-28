const sql = require("mssql"); // Add this line to import the sql module
const dbConfig = require("../dbConfig");

class User {
  constructor(id, username, password, contact, email) {
    this.id = id;
    this.username = username;
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
        new User(row.Id, row.name, row.password, row.contactNumber, row.email)
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
          result.recordset[0].username,
          result.recordset[0].email
        )
      : null;
  }

  static async createUser(newUserData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery =
      "INSERT INTO Account (username,email) VALUES (@username, @email); SELECT SCOPE_IDENTITY() AS id";

    const request = connection.request();
    request.input("username", newUserData.username);
    request.input("email", newUserData.email);

    const result = await request.query(sqlQuery);

    connection.close();

    return this.getUserById(result.recordset[0].id);
  }

  static async updateUser(id, newUserData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery =
      "UPDATE Account SET username = @username, email = @email WHERE id = @id"; // Parameterized query

    const request = connection.request();
    request.input("id", id);
    request.input("username", newUserData.username || null);
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
