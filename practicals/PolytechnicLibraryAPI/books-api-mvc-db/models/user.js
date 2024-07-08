const sql = require("mssql"); // Add this line to import the sql module
const dbConfig = require("../dbConfig"); // Adjust the path as necessary

class User {
  constructor(id, username, passwordHash, role) {
    this.id = id;
    this.username = username;
    this.passwordHash = passwordHash;
    this.role = role;
  }

  static async getAllUsers() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = "SELECT * FROM Users";

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) => new User(row.id, row.username, row.passwordHash, row.role)
    );
  }

  static async getUserById(id) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = "SELECT * FROM Users WHERE id = @id";

    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new User(
          result.recordset[0].id,
          result.recordset[0].username,
          result.recordset[0].passwordHash,
          result.recordset[0].role
        )
      : null;
  }

  static async getUserByUsername(username) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = "SELECT * FROM Users WHERE username = @username";

    const request = connection.request();
    request.input("username", username);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new User(
          result.recordset[0].id,
          result.recordset[0].username,
          result.recordset[0].passwordHash,
          result.recordset[0].role
        )
      : null;
  }

  static async createUser(username, passwordHash, role) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery =
      //  "INSERT INTO Users (id,username,passwordHash,role) VALUES ('9',@username, @passwordHash,@role);";
      "INSERT INTO Users (username,passwordHash,role) VALUES (@username, @passwordHash,@role); SELECT SCOPE_IDENTITY() AS id";
    const request = connection.request();
    request.input("username", username);
    request.input("passwordHash", passwordHash);
    request.input("role", role);

    const result = await request.query(sqlQuery);

    connection.close();

    return this.getUserById(result.recordset[0].id);
  }

  static async updateUser(id, newUserData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery =
      "UPDATE Users SET username = @username, passwordHash = @passwordHash role=@role WHERE id = @id"; // Parameterized query

    const request = connection.request();
    request.input("id", id);
    request.input("username", newUserData.username || null);
    request.input("passwordHash", newUserData.passwordHash || null);
    request.input("role", newUserData.role || null);

    await request.query(sqlQuery);

    connection.close();

    return this.getUserById(id);
  }

  static async deleteUser(id) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = "DELETE FROM Users WHERE id = @id";

    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.rowsAffected > 0;
  }

  static async searchUsers(searchTerm) {
    const connection = await sql.connect(dbConfig);

    try {
      const sqlQuery = `SELECT * 
        FROM Users 
        WHERE username LIKE '%${searchTerm}%' 
          OR email LIKE '%${searchTerm}%'`;

      const result = await connection.request().query(sqlQuery);
      return result.recordset;
    } catch (error) {
      console.error(error);
      throw new Error("Error searching users"); // Or handle error differently
    } finally {
      await connection.close(); // Close connection even on errors
    }
  }

  static async getUsersWithBooks() {
    const connection = await sql.connect(dbConfig);

    try {
      const query = `
        SELECT u.id AS user_id, u.username, u.email, b.id AS book_id, b.title, b.author
        FROM Users u
        LEFT JOIN UserBooks ub ON ub.user_id = u.id
        LEFT JOIN Books b ON ub.book_id = b.id
        ORDER BY u.username;
      `;

      const result = await connection.request().query(query);

      // Group users and their books
      const usersWithBooks = {};
      for (const row of result.recordset) {
        const userId = row.user_id;
        if (!usersWithBooks[userId]) {
          usersWithBooks[userId] = {
            id: userId,
            username: row.username,
            email: row.email,
            books: [],
          };
        }
        usersWithBooks[userId].books.push({
          id: row.book_id,
          title: row.title,
          author: row.author,
        });
      }

      return Object.values(usersWithBooks);
    } catch (error) {
      throw new Error("Error fetching users with books");
    } finally {
      await connection.close();
    }
  }
}

module.exports = User;
