const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dvdedegqp",
  api_key: "557648415236723",
  api_secret: "DgR5jTCDzgyrls6zHDl6ACnoe0k"
});

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg', 'png'],
  params: {
    folder: 'cuahangdientu'
  }
});

// Set up Multer with Cloudinary storage
const uploadCloud = multer({ storage });

module.exports = uploadCloud;
