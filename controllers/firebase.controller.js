const admin = require("../firebase/config");

const firebaseController = {
  sendCloudMessage: async (req, res) => {
    try {
      const { token, title, body } = req.body;

      if (!token) {
        return res.status(400).json({ error: "Token is required" });
      }

      const message = {
        data: {
          title: title || "Thông báo",
          body: body || "Bạn có tin nhắn mới!",
        },
        token,
      };

      const response = await admin.messaging().send(message);

      return res.status(200).json({
        success: true,
        messageId: response,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }
  },
  sendNotification: async (token, title, body) => {
    if (!token) {
      console.error("Token is required");
      return;
    }
    const message = {
      data: {
        title: title || "Thông báo",
        body: body || "Đừng bỏ lỡ việc học hôm nay!",
      },
      token,
    };

    await admin
      .messaging()
      .send(message)
      .then((response) => {
        console.log("Successfully sent message:", response);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  },
};

module.exports = firebaseController;
