import mongoose, { Model } from 'mongoose';

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

let Folder: Model<any>;
try {
  Folder = mongoose.model('Folder');
} catch {
  Folder = mongoose.model('Folder', folderSchema);
}

export default Folder;
