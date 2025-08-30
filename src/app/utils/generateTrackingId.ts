import moment from "moment";
import { Parcel } from "../modules/parcel/parcel.model";

export const generateTrackingId = async () => {
    let trackingId;
    let isExist = true;

    while (isExist) {
        const date = moment().format('YYYYMMDD');
        const random = Math.floor(100000 + Math.random() * 900000);
        trackingId = `TRK-${date}-${random}`;
        isExist = !!(await Parcel.exists({trackingId}));
    }
    return trackingId;
}