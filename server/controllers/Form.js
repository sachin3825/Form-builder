const Form = require("../models/Form");
const User = require("../models/User");
const Question = require("../models/Question");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description } = req.body;
    let thumbnailImage = null;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are mandatory",
      });
    }

    // Check if an image is uploaded
    if (req.files && req.files.thumbnailImage) {
      thumbnailImage = await uploadImageToCloudinary(
        req.files.thumbnailImage,
        process.env.FOLDER_NAME
      );

      if (!thumbnailImage) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload image",
        });
      }
    }

    const userDetail = await User.findById(userId);

    if (!userDetail) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const newForm = await Form.create({
      title,
      description,
      image: thumbnailImage.secure_url,
    });

    await User.findByIdAndUpdate(
      {
        _id: userId,
      },
      {
        $push: {
          formCreated: newForm._id,
        },
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      data: newForm,
      message: "Form created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create form",
      error: error.message,
    });
  }
};

exports.editForm = async (req, res) => {
  try {
    const { formId, title, description } = req.body;
    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }

    if (title) {
      form.title = title;
    }

    if (description) {
      form.description = description;
    }

    if (req.files && req.files.thumbnailImage) {
      const headerImage = req.files.thumbnailImage;
      const thumbnailImage = await uploadImageToCloudinary(
        headerImage,
        process.nextTick.FOLDER_NAME
      );
      form.image = thumbnailImage.secure_url;
    }

    const updatedForm = await form.save();

    res.status(200).json({
      success: true,
      data: updatedForm,
      message: "Form updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update form",
      error: error.message,
    });
  }
};
