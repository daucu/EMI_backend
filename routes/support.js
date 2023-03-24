const router = require('express').Router();
const { getAuthUser } = require('../config/authorizer');
const { Support, SupportChat } = require('../models/support_schema');

// get all tickets
router.get('/', getAuthUser, async (req, res) => {
    try {
        var support;
        switch (req.user.role) {
            case 'admin':
                support = await Support.find({type: "seller-admin"}).populate([
                    {
                        path: 'user',
                        select: 'name email',
                    },
                    {
                        path: 'seller',
                        select: 'name email',
                    }
                ])
                return res.json({
                    message: 'All tickets',
                    support,
                });
            case 'seller':
                support = await Support.find({ seller: req.user._id }).populate([
                    {
                        path: 'user',
                        select: 'name email',
                    },
                    {
                        path: 'seller',
                        select: 'name email',
                    }
                ])
                return res.json({
                    message: 'All tickets',
                    support,
                });
            case 'user':
                support = await Support.find({ user: req.user._id }).populate([
                    {
                        path: 'user',
                        select: 'name email',
                    },
                    {
                        path: 'seller',
                        select: 'name email',
                    }
                ])
                return res.json({
                    message: 'All tickets',
                    support,
                });
            default:
                return res.json({
                    message: 'No tickets found',
                    support: [],
                });
        }
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
});


// create new ticket
router.post('/', getAuthUser, async (req, res) => {
    try {
        const { title, description, status, type, isMain } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                message: 'Please fill all the fields'
            });
        }

        var support;
        if (req.user.role === 'user') {
            support = new Support({
                user: req.user._id,
                title,
                description,
                type: type || 'seller-user',
                status: status || 'pending',
            });
        } else if (req.user.role === 'seller') {
            support = new Support({
                seller: req.user._id,
                title,
                description,
                isMain: isMain || false,
                type: type || 'seller-admin',
                status: status || 'pending',
            });

        }

        await support.save();

        return res.status(201).json({
            message: 'Ticket created successfully',
            support,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
});

// get all chats of a ticket
router.get('/chat/:id', getAuthUser, async (req, res) => {
    try {
        const { id } = req.params;
        const support = await Support.findById(id);

        if (!support) {
            return res.status(404).json({
                message: 'No ticket found'

            });
        }
        const supportChat = await SupportChat.find({ ticket: id });
        return res.json({
            message: 'All chats',
            supportChat,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
});





// create new chat
router.post('/chat', getAuthUser, async (req, res) => {
    try {
        const { ticket, message } = req.body;
        const user = req.user;

        const newchat = new SupportChat({
            ticket,
            message,
            sent_by: user._id,
        });
        await newchat.save();

        return res.status(201).json({
            message: 'New chat Added',
            chat: newchat,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
});


// update ticket status
router.put('/status/:id', getAuthUser, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const support = await Support.findById(id);

        if (!support) {
            return res.status(404).json({
                message: 'No ticket found'
            });
        }

        support.status = status;

        await support.save();

        return res.json({
            message: 'Ticket status updated successfully',
            support,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
});

// delete ticket

router.delete('/:id', getAuthUser, async (req, res) => {
    try {
        const { id } = req.params;

        const support = await Support.findById(id);

        if (!support) {
            return res.status(404).json({
                message: 'No ticket found'
            });
        }

        await support.remove();

        return res.json({
            message: 'Ticket deleted successfully',
            support,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
});




module.exports = router;