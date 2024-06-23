import express from "express";
import {
    createActor,
    updloadAvatar,
    updateActor,
    deleteActor,
} from "../controllers/actorController.js";
import {protect, admin} from "../middleware/authMiddleware.js"
import checkObjectId from "../middleware/checkObjectId.js"



const router = express.Router();

router.route('/create').post(createActor);
router.route('/uploadavatar').put(updloadAvatar);
router.route('/:id')
    // .get(checkObjectId, getProductDetails)
    .put(protect, checkObjectId, updateActor)
    .delete(protect, checkObjectId, deleteActor)



export default router;