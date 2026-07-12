import express from "express";

import {

getNotifications,

markRead

}

from "../controllers/notificationController.js";

const router=express.Router();

router.get(

"/:userId",

getNotifications

);

router.post(

"/read/:id",

markRead

);

export default router;