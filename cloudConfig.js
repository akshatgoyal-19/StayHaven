const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// console.log("Cloudinary Config:");
// console.log("Name:", process.env.CLOUDINARY_NAME);
// console.log("Key:", process.env.CLOUDINARY_API_KEY);
// console.log("Secret:", process.env.CLOUDINARY_API_SECRET ? "Loaded ✅" : "Missing ❌");



const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowedFormats: ["png","jpeg","jpg"]
  },
});

module.exports={
    cloudinary,
    storage
}
