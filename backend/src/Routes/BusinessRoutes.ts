import { Router } from "express";
import {
  addLocation,
  createBusiness,
  deleteBusiness,
  deleteLocation,
  editLocation,
  getBusiness,
  updateBusiness,
} from "../controller/businessController";
import upload from "../middleware/upload";
const router = Router();

router.get("/", getBusiness);

router.post("/", upload.single("image"), createBusiness);
router.put("/", upload.single("image"), updateBusiness);
router.delete("/", deleteBusiness);

router.post("/location", addLocation);
router.put("/location", editLocation);
router.delete("/location", deleteLocation);

export default router;
