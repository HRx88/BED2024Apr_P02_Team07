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

  static async getUserWithMessages() {
    try {
      const query = `
      SELECT UM.Id AS MessageId, A.Id AS AccountId, A.name AS UserName, A.contactNumber, A.email, UM.MessageText, UM.CreatedAt
      FROM UserMessages UM
      JOIN Account A ON UM.UserId = A.Id;
    `;

      const result = await connection.request().query(query);

      // Group users and their messages
      const usersWithMessages = {};
      for (const row of result.recordset) {
        const userId = row.AccountId; // Corrected to use AccountId
        if (!usersWithMessages[userId]) {
          usersWithMessages[userId] = {
            id: userId,
            username: row.UserName,
            contactNumber: row.contactNumber,
            email: row.email,
            messages: [], // Corrected to use messages instead of books
          };
        }
        usersWithMessages[userId].messages.push({
          id: row.MessageId,
          text: row.MessageText,
          createdAt: row.CreatedAt,
        });
      }

      return Object.values(usersWithMessages);
    } catch (error) {
      throw new Error("Error fetching users with messages");
    } finally {
      await connection.close();
    }
  }
}

module.exports = Msg;
