import mongoose from 'mongoose';

const folderSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },

  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  user: {
    // Reference to the User model
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Folder = mongoose.models.Folder || mongoose.model('Folder', folderSchema);

export default Folder;
