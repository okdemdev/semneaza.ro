import mongoose, { Model } from 'mongoose';

const documentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  previewImageUrl: {
    type: String,
    required: true,
  },
  signaturePlaceholder: {
    type: {
      pageNumber: Number,
      x: Number,
      y: Number,
      width: Number,
      height: Number,
    },
    required: true,
  },
  signature: {
    type: {
      dataUrl: String,
      date: Date,
    },
    default: null,
  },
  status: {
    type: String,
    enum: ['pending', 'signed'],
    default: 'pending',
  },
  signedFileUrl: {
    type: String,
    default: null,
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

let Document: Model<any>;
try {
  Document = mongoose.model('Document');
} catch {
  Document = mongoose.model('Document', documentSchema);
}

export default Document;
