import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatsService } from "./stats.service";


const getUserStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await StatsService.getUserStats();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User Statistics fetched successfully",
        data: stats,
    });
});

const getParcelStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await StatsService.getParcelStats();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Parcel Statistics fetched successfully",
        data: stats,
    });
});

export const StatsController = {
    getUserStats,
    getParcelStats
};