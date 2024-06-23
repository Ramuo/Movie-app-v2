import asyncHandler from "../middleware/asyncHandler.js";
import Actor from "../models/actorModel.js";
import {upload_file, delete_file} from "../utils/cloudinary.js"



//@desc     Create Actor
//@route    POST /api/actors
//@access   Private/admin
const createActor = asyncHandler(async (req, res) => {
    const {name, about, gender} = req.body; 

    const actor = await Actor.create({
        name,
        about, 
        gender
    });
    res.status(201).json(actor)
});

// @desc    Update Actor
// @route   PUT /api/actors/:id
// @access  Private
const updateActor = asyncHandler(async (req, res) => {
    let actor = await Actor.findById(req.params.id);

    if(!actor){
        res.status(404);
        throw new Error("Aucun acteur trouvé")
    }

    actor = await Actor.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });

    res.status(200).json(actor);
});

//@desc     Upload actor avatar
//@route    PUT /api/actors/uploadavatar
//@access   Private/admin
const updloadAvatar = asyncHandler(async(req, res) => {
    const avatarResponse = await upload_file(req.body.avatar, "movieapp/actors");

    if(req?.actor?.avatar?.url){
        await delete_file(req?.actor?.avatar?.public_id)
    }

    const actor = await Actor.findByIdAndUpdate(req?.actor?._id, {
        avatar: avatarResponse,
    });
    
    res.status(200).json({actor});
});



//@desc     delete Actor
//@route    POST /api/actors/:id
//@access   Private/admin
const deleteActor = asyncHandler(async (req, res) => {
    const actor = await Actor.findById(req.params.id);

    if(!actor){
        res.status(404);
        throw new Error(" Aucun Produit trouvé")
    }

    await actor.deleteOne();

    res.status(200).json({
        message: 'Produit supprimé'
    });
});



export {
    createActor,
    updloadAvatar,
    updateActor,
    deleteActor,
}