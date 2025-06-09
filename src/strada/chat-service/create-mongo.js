db.createCollection("chat", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["roomName", "members"],
      properties: {
        roomName: { bsonType: "string" },
        imgUrl: { bsonType: "string" },
        description: { bsonType: "string" },
        latestMessage: { bsonType: "string" },
        latestActivity: { bsonType: "date" },
        members: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["id", "name", "nickname"],
            properties: {
              id: { bsonType: "string" },
              name: { bsonType: "string" },
              nickname: { bsonType: "string" },
              imgUrl: { bsonType: "string" }
            }
          }
        }
      }
    }
  }
});

db.createCollection("message", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["sender", "content", "instant", "status", "chat"],
      properties: {
        sender: {
          bsonType: "object",
          required: ["id", "name", "nickname"],
          properties: {
            id: { bsonType: "string" },
            name: { bsonType: "string" },
            nickname: { bsonType: "string" },
            imgUrl: { bsonType: "string" }
          }
        },
        content: { bsonType: "string" },
        instant: { bsonType: "date" },
        status: { enum: ["RECEIVED", "SENT", "READ"] },
        chat: { bsonType: "objectId" }
      }
    }
  }
});
