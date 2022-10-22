const router = require('express').Router();
const User = require('../models/form');

router.post('/adduser', async (req, res) => {
    try {
        const { name, email, mobileno, country, state, city, password } = req.body;

        const userExist = await User.findOne({ "$or": [{ email }, { mobileno }] });
        if (userExist) {
            return res
                .status(422)
                .json({ error: "Email or Phone number already exists" });
        }

        const user = new User({
            name, email, mobileno, country, state, city, password
        })
        const saveduser = await user.save()
        console.log(saveduser)
        res.status(200).json(saveduser)
    } catch (error) {
        console.log("Error from Post Catch", error)
        res.status(500).json(error)
    }
})

// router.get('/getuser', async (req, res) => {
//     try {
//         const lists = await User.find();
//         res.status(200).json(lists)
//     } catch (error) {
//         console.log("Error from get catch", error);
//         res.status(500).json(error)
//     }
// })

// router.put("/edit/:id", async (req, res) => {
//     try {
//         const { name, color } = req.body;
//         const newList = {};
//         if (name) { newList.name = name };
//         if (color) { newList.color = color };
//         let list = await User.findById(req.params.id);
//         list = await User.findByIdAndUpdate(req.params.id, { $set: newList }, { new: true })
//         res.status(200).json({ list })
//     } catch (error) {
//         console.log("Error", error)
//         res.status(500).json(error)
//     }
// })

// router.delete('/delete/:id', async (req, res) => {
//     try {
//         let color = await User.findById(req.params.id);
//         color = await User.findByIdAndDelete(req.params.id)
//         res.status(200).json({ "success": "updated successfully", color })
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send("Internal Server Error");
//     }
// })

module.exports = router