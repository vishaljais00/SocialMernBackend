const path = require("path");
const fs = require("fs");

exports.userImageUpload = async(req, res) => {
    try {
        // upload new file
        const file = req.files?.file
        const extName = path.extname(file.name);
        const imgList = [".png", ".PNG", ".jpg", ".jpeg", ".JPG", ".JPEG", ".gif"];
        if (!imgList.includes(extName)) {
            return { status: 400, message: "invalid file format" };
        }
        const image_name = file.name.split(".")[0] + "_" + Date.now() + extName;
        var uploadPath = path.resolve(
            __dirname,
            `../public/images/` + image_name
        );

        file.mv(uploadPath, function(error, result) {
            if (error) {
                return { status: 400, message: error.message };
            }
        });
        return { imageName: image_name, status: 200 };
    } catch (error) {
        console.log("error in upload", error);
        return { status: 400, message: error.message };
    }
};

