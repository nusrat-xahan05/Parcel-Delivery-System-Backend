import { ParcelStatus } from "../parcel/parcel.interface";
import { Parcel } from "../parcel/parcel.model";
import { UserStatus } from "../user/user.interface";
import { User } from "../user/user.model";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);


const getUserStats = async () => {
    const totalUsersPromise = User.countDocuments()

    const totalActiveUsersPromise = User.countDocuments({ userStatus: UserStatus.ACTIVE })
    const totalBlockedUsersPromise = User.countDocuments({ userStatus: UserStatus.BLOCKED })

    const newUsersInLast7DaysPromise = User.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    })
    const newUsersInLast30DaysPromise = User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    })

    const usersByRolePromise = User.aggregate([
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }
        }
    ])


    const [totalUsers, totalActiveUsers, totalInActiveUsers, newUsersInLast7Days, newUsersInLast30Days, usersByRole] = await Promise.all([
        totalUsersPromise,
        totalActiveUsersPromise,
        totalBlockedUsersPromise,
        newUsersInLast7DaysPromise,
        newUsersInLast30DaysPromise,
        usersByRolePromise
    ])
    return {
        totalUsers,
        totalActiveUsers,
        totalInActiveUsers,
        newUsersInLast7Days,
        newUsersInLast30Days,
        usersByRole
    }
}


const getParcelStats = async () => {
    const totalParcelsPromise = Parcel.countDocuments();

    const pendingParcelsPromise = Parcel.countDocuments({ currentStatus: ParcelStatus.REQUESTED });
    const approvedParcelsPromise = Parcel.countDocuments({ currentStatus: ParcelStatus.APPROVED });
    const dispatchedParcelsPromise = Parcel.countDocuments({ currentStatus: ParcelStatus.DISPATCHED });
    const inTransitParcelsPromise = Parcel.countDocuments({ currentStatus: ParcelStatus.IN_TRANSIT });
    const outForDeliveryParcelsPromise = Parcel.countDocuments({ currentStatus: ParcelStatus.OUT_FOR_DELIVERY });
    const deliveredParcelsPromise = Parcel.countDocuments({ currentStatus: ParcelStatus.DELIVERED });
    const confirmedParcelsPromise = Parcel.countDocuments({ currentStatus: ParcelStatus.CONFIRMED });
    const cancelledParcelsPromise = Parcel.countDocuments({ currentStatus: ParcelStatus.CANCELLED });
    const blockedParcelsPromise = Parcel.countDocuments({ currentStatus: ParcelStatus.BLOCKED });


    const newParcelsLast7DaysPromise = Parcel.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    });
    const newParcelsLast30DaysPromise = Parcel.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    });


    const monthlyParcelsPromise = Parcel.aggregate([
        { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
        { $sort: { "_id": 1 } }
    ]);

    const parcelsByStatusPromise = Parcel.aggregate([
        { $group: { _id: "$currentStatus", count: { $sum: 1 } } }
    ]);

    const parcelsByServiceTypePromise = Parcel.aggregate([
        { $group: { _id: "$serviceType", count: { $sum: 1 } } }
    ]);

    const parcelsByParcelTypePromise = Parcel.aggregate([
        { $group: { _id: "$parcelType", count: { $sum: 1 } } }
    ]);

    const parcelsByDeliveryTypePromise = Parcel.aggregate([
        { $group: { _id: "$deliveryType", count: { $sum: 1 } } }
    ]);

    const [
        totalParcels,
        pendingParcels,
        approvedParcels,
        dispatchedParcels,
        inTransitParcels,
        outForDeliveryParcels,
        deliveredParcels,
        confirmedParcels,
        cancelledParcels,
        blockedParcels,
        newParcelsLast7Days,
        newParcelsLast30Days,
        monthlyParcels,
        parcelsByStatus,
        parcelsByServiceType,
        parcelsByParcelType,
        parcelsByDeliveryType
    ] = await Promise.all([
        totalParcelsPromise,
        pendingParcelsPromise,
        approvedParcelsPromise,
        dispatchedParcelsPromise,
        inTransitParcelsPromise,
        outForDeliveryParcelsPromise,
        deliveredParcelsPromise,
        confirmedParcelsPromise,
        cancelledParcelsPromise,
        blockedParcelsPromise,
        newParcelsLast7DaysPromise,
        newParcelsLast30DaysPromise,
        monthlyParcelsPromise,
        parcelsByStatusPromise,
        parcelsByServiceTypePromise,
        parcelsByParcelTypePromise,
        parcelsByDeliveryTypePromise
    ]);

    return {
        totalParcels,
        pendingParcels,
        approvedParcels,
        dispatchedParcels,
        inTransitParcels,
        outForDeliveryParcels,
        deliveredParcels,
        confirmedParcels,
        cancelledParcels,
        blockedParcels,
        newParcelsLast7Days,
        newParcelsLast30Days,
        monthlyParcels,
        parcelsByStatus,
        parcelsByServiceType,
        parcelsByParcelType,
        parcelsByDeliveryType
    };
};



export const StatsService = {
    getParcelStats,
    getUserStats
}