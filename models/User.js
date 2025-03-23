import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: false,
        },
    },
    { timestamps: true }
);

// ✅ Prevent model re-declaration in serverless environments
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
