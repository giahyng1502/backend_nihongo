var express = require("express");
var router = express.Router();
const remindController = require("../controllers/remind.controller");
const firebaseController = require("../controllers/firebase.controller");
/* GET users listing. */
router.post("/save-remind", remindController.saveRemind);
router.post("/send-notifee", firebaseController.sendCloudMessage);
router.post("/turn-off", remindController.turnOffRemind);

module.exports = router;
