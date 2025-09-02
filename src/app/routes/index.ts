import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { OtpRoutes } from "../modules/otp/otp.route";
import { ParcelRoutes } from "../modules/parcel/parcel.route";
import { StatsRoutes } from "../modules/stats/stats.route";

export const router = Router();

const moduleRoutes = [
    {
        path: '/user',
        route: UserRoutes
    },
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/otp',
        route: OtpRoutes
    },
    {
        path: '/parcel',
        route: ParcelRoutes
    },
    {
        path: "/stats",
        route: StatsRoutes
    },
]

moduleRoutes.forEach(route => {
    router.use(route.path, route.route)
})