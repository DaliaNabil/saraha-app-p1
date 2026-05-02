import mongoose from "mongoose";
import { BadRequstException, decodeToken } from "../../Common/index.js";
import userRepository from "../../DB/Repositories/user.repository.js";
import { Message } from "../../DB/Models/index.js";

export const getProfileService = (req) => {
  return req.user;
};

export const updateUserProfile = async ({ user, body }) => {
  const { _id } = user;
  const { firstName, lastName, age, gender, email } = body;

  if (email) {
    const existingUser = await userRepository.findOne({
      email,
      _id: { $ne: _id },
    });

    if (existingUser) {
      throw new Error("Email is already in use by another account", {
        cause: { status: 409 },
      });
    }
  }

  console.log("Updating profile for:", _id);

  const updatedUser = await userRepository.findByIdAndUpdate(
    _id,
    { firstName, lastName, age, gender, email },
    { new: true, runValidators: true },
  );

  if (!updatedUser) {
    throw new Error("User not found", { cause: { status: 404 } });
  }

  return updatedUser;
};

export const getAllUsers = async () => {
  return await userRepository.find({});
};

export const UploadProfilePicture = async (user, file) => {
  if (!file || !file.path) throw new BadRequstException("file is required");
  return await userRepository.findByIdAndUpdate(
    user._id,
    { profilePicture: file.path },
    { new: true },
  );
};
export const deleteUserAccount = async (user) => {
  const { _id } = user;
  const sessions = await mongoose.startSession();
  sessions.startTransaction();

  try {
    await Message.deleteMany({ receverId: _id }, { session: sessions });

    await userRepository.findByIdAndDelete(_id, { session: sessions });

    await sessions.commitTransaction();
    console.log("✅ Transaction is committed");
    return true;
  } catch (error) {
    console.log("❌ Transaction aborted due to:", error.message);
    await sessions.abortTransaction();
    throw error;
  } finally {
    console.log(" Transaction is ended");
    sessions.endSession();
  }
};
