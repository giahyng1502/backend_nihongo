const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
  },
  romaji: {
    type: String,
  },
  meaning_vi: {
    type: String,
  },
  furigana: {
    type: String,
  },
  meaning: {
    type: String,
  },
});

const tokenSchema = new mongoose.Schema(
  {
    tokenId: {
      type: String,
      required: true,
      unique: true, // mỗi device token chỉ lưu 1 lần
    },
    platform: {
      type: String,
      enum: ["android", "ios"],
      default: "android",
    },
    vocabularies: {
      type: [wordSchema],
      default: [], // mặc định là mảng rỗng
    },
    // Thời điểm bắt đầu (ví dụ: 08:00 sáng)
    startedTime: {
      type: Date,
      default: Date.now,
    },

    // Thời điểm kết thúc (tính từ startedTime + số ngày)
    endTime: {
      type: Date,
      default: () => Date.now() + 24 * 60 * 60 * 1000, // mặc định 1 ngày
    },

    // Chu kỳ nhắc lại (số phút giữa các thông báo)
    remindInterval: {
      type: Number,
      min: 1,
      max: 60,
      default: 5, // 5 phút/lần
    },

    // Số ngày hiệu lực (nếu muốn set endTime tự động)
    durationInDays: {
      type: Number,
      min: 1,
      max: 30,
      default: 1, // mặc định 1 ngày
    },

    // Bật/tắt
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", tokenSchema);
