const multer = require("multer");
const { extraCategoryModel } = require("../models/extraCategory");
const { productModel } = require("../models/product");
const { subCategoryModel } = require("../models/subCategory");
const userData = require("../models/user");
const mailer = require("nodemailer");
const fs = require("fs");

const signPage = async (req, res) => {
    res.render("signPage");
}

const loginPage = async (req, res) => {
    res.render("loginPage");
}

const adduser = async (req, res) => {
    const { email, userName, password } = req.body;
    let checkdublicate = await userData.findOne({ email });

    if (checkdublicate) {
        res.redirect("back");
    } else {
        await userData.create({ userName, email, password });
        res.redirect("/loginPage");
    }
}

const home = async (req, res) => {
    try {
        const { categoryname, subcategoryname } = req.query;
        if (categoryname) {
            let findData = await productModel.find({ category: categoryname })
                .populate([{ path: "subCategorySchema" }, { path: "extraCategorySchema" }]);
            res.render("index", { findData });

        } else if (subcategoryname) {
            let subcategory = subcategoryname.toLowerCase();
            let findData = await productModel.find({ subcategory: subcategory })
                .populate([{ path: "subCategorySchema" }, { path: "extraCategorySchema" }]);
            console.log(findData);
            res.render("index", { findData });
        } else {
            let findData = await productModel.find()
                .populate([{ path: "subCategorySchema" }, { path: "extraCategorySchema" }]);
            res.render("index", { findData });
        }
    } catch (error) {
        console.log(error);
    }
}

const category = async (req, res) => {
    try {
        const categoryname = req.query.categoryname;
        let findData = await productModel.find({ category: categoryname })
            .populate([{ path: "subCategorySchema" }, { path: "extraCategorySchema" }]);
        console.log(findData);
        res.render("category", { findData: findData });
    } catch (error) {
        console.log(error);
    }
}

const addProductPage = async (req, res) => {
    res.render("form");
}

const imageMulter = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const imageUpload = multer({ storage: imageMulter }).single("image");

const addProduct = async (req, res) => {
    try {
        const { title, category, subcategory, extracategory, price, discount } = req.body;
        let image = req.file ? req.file.path : "";

        let extraProductData = await extraCategoryModel.create({ title, price, discount, image });
        let subProductData = await subCategoryModel.create({ category, subcategory, extraCategorySchema: extraProductData._id });
        await productModel.create({ category, subcategory, extracategory, subCategorySchema: subProductData._id, extraCategorySchema: extraProductData._id });
        console.log(extraProductData);
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
}


const getcate = async (req, res) => {
    let updateSub = await productModel.find().populate([{ path: "subCategorySchema" }, { path: "extraCategorySchema" }]);
    res.send(updateSub);
}

const forgotPage = async (req, res) => {
    try {
        res.render("forgotPage");
    } catch (error) {
        console.log(error);
    }
}

const emailVerify = async (req, res) => {
    try {
        const { email } = req.body;
        let findemail = await userData.findOne({ email });
        if (findemail) {
            const transporter = await mailer.createTransport({
                service: "gmail",
                auth: { user: "divyang.rnw@gmail.com", pass: "cumw bsee flyn wrmr" }
            });

            const sendMail = {
                from: "divyang.rnw@gmail.com",
                to: email,
                subject: "Reset Password OTP",
                html: `<span>${otp}</span>`,
            };

            transporter.sendMail(sendMail, (err, info) => {
                if (err) console.log(err);
                else console.log(info);
            });

            res.render("otp");
        } else {
            res.redirect("back");
        }
    } catch (error) {
        console.log(error);
    }
}

let otp = Math.floor(100000 + Math.random() * 900000);

const optVerify = async (req, res) => {
    try {
        const { otpB1, otpB2, otpB3, otpB4, otpB5, otpB6 } = req.body;
        let checkotp = otpB1 + otpB2 + otpB3 + otpB4 + otpB5 + otpB6;

        if (checkotp == otp) {
            res.redirect("/resetPassword");
        } else {
            res.redirect("back");
        }
    } catch (error) {
        console.log(error);
    }
}

const emailVerifyPage = async (req, res) => {
    try {
        res.render("forgotPage");
    } catch (error) {
        console.log(error);
    }
}

const otpPage = async (req, res) => {
    try {
        res.render("otp");
    } catch (error) {
        console.log(error);
    }
}

const resetPage = async (req, res) => {
    try {
        res.render("resetPassword");
    } catch (error) {
        console.log(error);
    }
}

const resetPassword = async (req, res) => {
    try {
        const { old, new: newPass, confirm } = req.body;

        let find = await userData.findOne({ password: old });

        if (find) {
            if (find.password === newPass || newPass !== confirm) {
                res.redirect("back");
            } else {
                await userData.findByIdAndUpdate(find._id, { password: newPass });
                res.redirect("/loginPage");
            }
        }
    } catch (error) {
        console.log(error);
    }
}

const deleteData = async (req, res) => {
    try {
        let ids = req.query.id.split(',').map(id => id.trim());
        let findimg = await extraCategoryModel.findById(ids[2]);

        if (findimg.image && fs.existsSync(findimg.image)) {
            fs.unlinkSync(findimg.image);
        }

        await extraCategoryModel.findByIdAndDelete(ids[2]);
        await subCategoryModel.findByIdAndDelete(ids[1]);
        await productModel.findByIdAndDelete(ids[0]);
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
}

const edit = async (req, res) => {
    try {
        // let id = req.query.id;
        let ids = req.query.id.split(',').map(id => id.trim());
        let editData = await extraCategoryModel.findById(ids[2]);
        let subId = await subCategoryModel.findById(ids[1]);
        let CatId = await productModel.findById(ids[0]);
        console.log(editData);
        res.render("edit", { editData, subId, CatId });
    } catch (error) {
        console.log(error);
    }
}

const update = async (req, res) => {
    try {
        let image = req.file ? req.file.path : req.body.old_img;
        let extraid = req.body.extraid;
        let subid = req.body.subid;
        let catid = req.body.catid;

        let updateData = await extraCategoryModel.findByIdAndUpdate(extraid, {
            title: req.body.title,
            price: req.body.price,
            discount: req.body.discount,
            image
        });

        let updateSub = await subCategoryModel.findByIdAndUpdate(subid, {
            category: req.body.category,
            subcategory: req.body.subcategory
        })
        let updateCat = await productModel.findByIdAndUpdate(catid, {
            category: req.body.category,
            subcategory: req.body.subcategory,
            extracategory: req.body.extracategory
        })
        console.log(updateData);

        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
}

module.exports = { home, addProductPage, addProduct, imageUpload, getcate, category, signPage, adduser, loginPage, forgotPage, optVerify, emailVerify, resetPassword, resetPage, otpPage, emailVerifyPage, deleteData, edit, update };
