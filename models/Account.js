const sql = require("mssql"); // Add this line to import the sql module
const dbConfig = require("../dbConfig");
const bcrypt = require("bcryptjs");

class User {
  constructor(id, name, password, contact, email, role) {
    this.id = id;
    this.name = name;
    this.password = password;
    this.contact = contact;
    this.email = email;
    this.role = role;
  }

  static async getAllUsers() {
    try {
      const connection = await sql.connect(dbConfig);
      const sqlQuery = "SELECT * FROM Account";
      const request = connection.request();
      const result = await request.query(sqlQuery);
      connection.close();

      return result.recordset.map(
        (row) =>
          new User(row.id, row.name, row.password, row.contactNumber, row.email, row.role)
      );
    } catch (error) {
      console.error("Error getting all users:", error);
      throw error;
    }
  }

  static async getUserByUsername(username) {
    try {
      const connection = await sql.connect(dbConfig);
      const sqlQuery = "SELECT * FROM Account WHERE name = @username";
      const request = connection.request();
      request.input("username", username);
      const result = await request.query(sqlQuery);
      connection.close();

      return result.recordset[0]
        ? new User(
            result.recordset[0].Id,
            result.recordset[0].name,
            result.recordset[0].password,
            result.recordset[0].contactNumber,
            result.recordset[0].email,
            result.recordset[0].role
          )
        : null;
    } catch (error) {
      console.error("Error getting user by username:", error);
      throw error;
    }
  }

  static async getUserById(id) {
    try {
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
            result.recordset[0].email,
            result.recordset[0].role
          )
        : null;
    } catch (error) {
      console.error("Error getting user by ID:", error);
      throw error;
    }
  }

  static async createUser(name, password, contact, email, role) {
    try {
      //const salt = await bcrypt.genSalt(10);
      //const hashedPassword = await bcrypt.hash(password, salt);
      const connection = await sql.connect(dbConfig);

      const sqlQuery =
        "INSERT INTO Account (name,password,contactNumber,email,role) VALUES (@name,@password, @contactNumber,@email,@role); SELECT SCOPE_IDENTITY() AS id";

      const request = connection.request();
      request.input("name", name);
      request.input("password", password);
      request.input("contactNumber", contact);
      request.input("email", email);
      request.input("role", role || 'member');

      const result = await request.query(sqlQuery);
      connection.close();

      return this.getUserById(result.recordset[0].id);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  static async updateUser(id, newUserData) {
    try {
      const connection = await sql.connect(dbConfig);

      const sqlQuery =`UPDATE Account SET name = CASE WHEN @name IS NOT NULL THEN @name ELSE name END,
       contactNumber = CASE WHEN @contactNumber IS NOT NULL THEN @contactNumber ELSE contactNumber END,
       email = CASE WHEN @email IS NOT NULL THEN @email ELSE email END WHERE id = @id`;

      const request = connection.request();
      request.input("id", id);
      request.input("name", newUserData.name || null);
      request.input("contactNumber", newUserData.contactNumber || null);
      request.input("email", newUserData.email || null);

      await request.query(sqlQuery);
      connection.close();

      return this.getUserById(id);
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  static async deleteUser(id) {
    try {
      const connection = await sql.connect(dbConfig);
      const sqlQuery =  `
      BEGIN TRANSACTION;

      -- Check if the account has messages
      IF EXISTS (SELECT 1 FROM Messages WHERE UserId = @id)
      BEGIN
        -- Delete messages associated with the account
        DELETE FROM Messages WHERE UserId = @id;
        
        -- Delete the account itself
        DELETE FROM Account WHERE Id = @id;
      END
      ELSE
      BEGIN
        -- Delete the account only
        DELETE FROM Account WHERE Id = @id;
      END

      COMMIT TRANSACTION;
  
      
  `;
      const request = connection.request();
      request.input("id", id);
      const result = await request.query(sqlQuery);
      connection.close();

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
}

module.exports = User;
