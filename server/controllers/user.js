// Utils
const makeValidation = require('@withvoid/make-validation');

// Models
const { User } = require('../models/user');

module.exports = {
    onGetAllUsers: async (req, res) => {
        try {
            const users = await User.scan().exec();
            return res.status(200).json({
                success: true,
                users
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error
            })
        }
    },
    onCreateUser: async (req, res) => {
        try {
            const validation = makeValidation(types => ({
                payload: req.body,
                checks: {
                    username: { type: types.string },
                    name: { type: types.string },
                }
            }));

            if (!validation.success) return res.status(400).json({ ...validation });
            const {username, name, mobileNo} = req.body;
            const { ...data } = req.body
            
            const user = await User.create({
                id: uuidv4(),
                username,
                name,
                mobileNo,
    
            }, {...data});
            return res.status(200).json({ success: true, user });

        } catch (error) {
            return res.status(500).json({ success: false, error: error })
        }
    },
    onGetUserById: async (req, res) => {
        try {
            const { id } = req.params;    
            const user = await User.get({ id });
            return res.status(200).json({ success: true, user });

        } catch (error) {
            return res.status(500).json({ success: false, error: error })
        }
    },
    onUpdateUserById: async (req, res) => {
        try {
            
            const { ...data } = req.body;
            const { id } = req.params;
            const user = await User.update({ id }, { ...data });
            return res.status(200).json({ success: true, user });
        } catch (error) {
            return res.status(500).json({ success: false, error: error })
        }
    },
    onDeleteUserById: async (req, res) => {
        try {
            const { id } = req.params;    
            const user = await User.delete({ id });
            return res.status(200).json({ success: true, user });
        } catch (error) {
            return res.status(500).json({ success: false, error: error })
        }
    }

}