const sql = require("mssql"); // Add this line to import the sql module
const dbConfig = require("../dbConfig");

class Msg {
  constructor(id, userId, message, dateTime) {
    this.id = id;
    this.userId = userId;
    this.message = message;
    this.dateTime = dateTime;
  }
  static async getAllMsg() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = "SELECT * FROM Messages";

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) => new Msg(row.id, row.userId, row.messageText, row.createdAt)
    );
  }

  static async createMsg(newData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery =
      "INSERT INTO Messages (userId,messageText) VALUES (@userId, @Msg); SELECT SCOPE_IDENTITY() AS id";

    const request = connection.request();
    request.input("userId", newData.userId);
    request.input("Msg", newData.messageText);

    const result = await request.query(sqlQuery);

    connection.close();

    return this.getAllMsg(result.recordset[0].id);
  }

  static async getUserwithMsg() {
    try {
      const query = `
       SELECT UM.Id AS MessageId, A.Id AS AccountId, A.name AS UserName, A.contactNumber, A.email, UM.MessageText, UM.CreatedAt
       FROM UserMessages UM
       JOIN Account A ON UM.UserId = A.Id;
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

module.exports = Msg;
