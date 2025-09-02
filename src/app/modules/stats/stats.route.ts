import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { StatsController } from "./stats.controller";

const router = express.Router();

router.get(
    "/user",
    checkAuth(Role.ADMIN),
    StatsController.getUserStats
);
router.get(
    "/parcel",
    checkAuth(Role.ADMIN),
    StatsController.getParcelStats
);

export const StatsRoutes = router;