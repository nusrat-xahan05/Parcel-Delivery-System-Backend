import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { ParcelControllers } from "./parcel.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createParcelZodSchema, manageParcelZodSchema } from "./parcel.validation";


const router = Router()

// CREATE PARCEL ------ (SENDER, ADMIN ENDPOINT)
router.post('/create-parcel', validateRequest(createParcelZodSchema), checkAuth(Role.ADMIN, Role.SENDER), ParcelControllers.createParcel);

// GET MY PARCELS ------ (SENDER ENDPOINT)
router.get('/me', checkAuth(Role.ADMIN, Role.SENDER), ParcelControllers.getMyParcels);


// GET ALL PARCELS ------ (ADMIN ENDPOINT)
router.get('/all-parcels', checkAuth(Role.ADMIN), ParcelControllers.getAllParcels);

// GET ASSIGNED PARCELS ------ (AGENT ENDPOINT)
router.get('/assigned-parcels', checkAuth(Role.AGENT), ParcelControllers.getAssignedParcels);


// GET INCOMING PARCELS ------ (RECEIVER ENDPOINT)
router.get('/incoming', checkAuth(Role.RECEIVER), ParcelControllers.getIncomingParcels);

// GET DELIVERY HISTORY ------ (RECEIVER ENDPOINT)
router.get('/history', checkAuth(Role.RECEIVER), ParcelControllers.viewHistory);


// GET SINGLE PARCEL ------ (SENDER, ADMIN ENDPOINT)
router.get("/:id", checkAuth(Role.ADMIN, Role.SENDER, Role.RECEIVER), ParcelControllers.getSingleParcel);

// UPDATE PARCEL ------ (ADMIN ENDPOINT)
router.patch('/:id', validateRequest(manageParcelZodSchema), checkAuth(Role.ADMIN), ParcelControllers.manageParcel);


// UPDATE PARCEL-STATUS ------ (AGENT ENDPOINT)
router.patch('/status-update/:id', validateRequest(manageParcelZodSchema), checkAuth(Role.AGENT), ParcelControllers.updateParcelStatus);


// CENCEL PARCEL ------ (SENDER ENDPOINT)
router.patch('/:id/cancel', checkAuth(Role.ADMIN, Role.SENDER), ParcelControllers.cancelParcel);


// CONFIRM PARCEL DELIVERY ------ (RECEIVER ENDPOINT)
router.patch('/:id/confirm-delivery', checkAuth(Role.RECEIVER), ParcelControllers.confirmDelivery);


// TRACK THE PARCEL ------ (PUBLIC ENDPOINT)
router.get('/track-parcel/:id', ParcelControllers.trackParcel);



export const ParcelRoutes = router;