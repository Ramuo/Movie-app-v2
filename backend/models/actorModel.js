import mongoose from "mongoose";

const actorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    about: {
      type: String,
      trim: true,
      required: true,
    },
    gender: {
      type: String,
      trim: true,
      required: true,
    },
    // avatar: {
    //   type: Object,
    //   url: String,
    //   public_id: String,
    // },
    avatar: {
      public_id: String,
      url: String,
  },
  },
  { timestamps: true }
);

// actorSchema.index({ name: "text" });
const Actor = mongoose.model('Actor', actorSchema);
export default Actor;