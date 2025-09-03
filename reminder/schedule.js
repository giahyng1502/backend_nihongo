const cron = require("node-cron");
const User = require("../models/user.model");
const FilebaseController = require("../controllers/firebase.controller");
cron.schedule("* * * * *", async () => {
  const now = new Date();
  console.log(`⏰ Checking reminders at ${now.toISOString()}`);
  // Tìm user còn hiệu lực
  const users = await User.find({ enabled: true, endTime: { $gte: now } });
  console.log(users);
  for (const user of users) {
    if (!user.vocabularies.length) continue;

    // Tính số phút đã trôi qua kể từ giờ bắt đầu
    // Hàm cắt Date về phút (set giây + ms = 0)
    const truncateToMinute = (date) => {
      const d = new Date(date);
      d.setSeconds(0, 0);
      return d;
    };

    const nowTrunc = truncateToMinute(now);
    const startTrunc = truncateToMinute(user.startedTime);

    const diffMinutes =
      (nowTrunc.getTime() - startTrunc.getTime()) /
      (user.remindInterval * 60 * 1000);

    console.log(diffMinutes);

    if (
      diffMinutes < 0 ||
      diffMinutes >= user.vocabularies.length ||
      diffMinutes % 1 !== 0
    )
      continue; // chưa tới giờ bắt đầu

    const index = diffMinutes;

    const word = user.vocabularies[index];
    if (word === undefined) continue;
    const title = `
  ${word.word} ${word.word ? " - " : ""} ${
      word.furigana ? `${word.furigana}` : ""
    } ${word.furigana ? " - " : ""} ${word.romaji ? `${word.romaji}` : ""}
`;
    const body = `${word.meaning ? `${word.meaning}` : ""} 
        ${word.meaning ? " - " : ""}
      ${word.meaning_vi ? `${word.meaning_vi}` : ""}`;

    console.log(`🔔 ${user.tokenId} → ${word.word} (${word.meaning_vi})`);

    await FilebaseController.sendNotification(
      user.tokenId,
      title.trim(),
      body.trim()
    );
  }
});
