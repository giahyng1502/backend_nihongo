const User = require("../models/user.model");

const remindController = {
  saveRemind: async (req, res) => {
    try {
      const {
        tokenId,
        startedTime,
        remindInterval,
        durationInDays,
        enabled,
        platform,
        vocabularies,
      } = req.body;

      if (!tokenId) {
        return res.status(400).json({ error: "tokenId is required" });
      }

      // Nếu user tắt remind
      if (enabled === false) {
        await agenda.cancel({ "data.tokenId": tokenId });
        const updated = await User.findOneAndUpdate(
          { tokenId },
          { enabled: false },
          { new: true }
        );
        return res.status(200).json({
          success: true,
          data: updated,
          message: "Remind disabled & job cancelled",
        });
      }

      // Nếu bật remind
      const start = startedTime ? new Date(startedTime) : new Date();
      const end = new Date(
        start.getTime() + (durationInDays || 1) * 24 * 60 * 60 * 1000
      );

      const record = await User.findOneAndUpdate(
        { tokenId },
        {
          startedTime: start,
          remindInterval,
          durationInDays,
          endTime: end,
          enabled: true,
          platform: platform || "android",
          vocabularies: Array.isArray(vocabularies) ? vocabularies : [],
        },
        { new: true, upsert: true }
      );

      return res.status(200).json({
        success: true,
        data: record,
        message: "Remind enabled & job scheduled",
      });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ error: err.message });
    }
  },
};

module.exports = remindController;
