const router = require("express").Router();
const moment = require("moment");
const { getAuthUser }= require("../config/authorizer");
const EMI = require("../models/emi_schema");
const User = require("../models/user_schema");
const Device = require("../models/device_schema");

router.get("/", getAuthUser, async (req, res) => {
    const { user } = req;
    try {
        let allEMI;
        if(user.role === "admin") {
            allEMI = await EMI.find();
            return res.json(allEMI);
        }
        else if(user.role === "user") {
            allEMI = await EMI.findById(user.active_emi);
        }else if(user.role === "seller") {
            allEMI = await EMI.findById({
                seller_id: user._id,
            });
        }else {
            return res.status(400).json({
                message: "Invalid user role",
            });
        }
        return res.json(allEMI);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
});


// create new emi 
router.post("/", getAuthUser, async (req, res) => {
    const { user } = req;
    if(user.role !== "seller") {
        return res.status(400).json({
            message: "Only seller can start emi.",
        });
    }

    // req body 
    const { down_payment, time_period, interest_rate, device_id } = req.body;

    // device data 
    const devicedata = await Device.findById(device_id);

    // total amount by device price
    const total_amount = Number(devicedata.device_price);

  
    try {
        const time_period_int = Number(time_period);
        const interest_rate_int = Number(interest_rate);

        let monthly_emi = (Number(total_amount) - Number(down_payment))/time_period_int;
        monthly_emi += interest_rate_int;
        // round monthly emi to 2 decimal places
        monthly_emi = Math.round(monthly_emi * 100) / 100;

        const remaining_amount = total_amount - down_payment + (interest_rate * time_period_int);

        const newEMI = new EMI({
            seller_id: devicedata.seller,
            user_id: devicedata.user,
            interest_rate: interest_rate_int,
            time_period: time_period_int,
            total_amount,
            down_payment,
            monthly_emi,
            device_id,
            remaining_amount,
            history: [{
                paid_amount: down_payment,
                paid_date: new Date().toISOString(),
                payment_type: req.body?.payment_mode || "cash",
            }],
            next_emidate: moment().add(1, "month").toISOString(),
        });

        const savedEMI = await newEMI.save();

        const updateUser = await User.findByIdAndUpdate(devicedata.user, {
            active_emi: savedEMI._id,
        }, {
            new: true,
        });

        await updateUser.save();

        return res.json({
            emi: savedEMI,
            message: "EMI created successfully."
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
});

// pay installment
router.patch("/installment", getAuthUser, async (req, res) => {
    const { user } = req;
    const { emi_id  } = req.body;
    try {
        
        if(user.role !== "user" && user.role !== "seller") {
            return res.status(400).json({
                message: "Not authorized to pay installment.",
            });
        }
        
        const emi = await EMI.findById(emi_id);

        if(!emi) {
            return res.status(400).json({
                message: "Invalid emi id.",
            });
        }

        if(emi.completed) {
            return res.status(400).json({
                message: "You have already paid all the installments.",
            });
        }

        if(emi.time_period === emi.paid_installment) {
            emi.completed = true;
            await emi.save();
            return res.status(400).json({
                message: "You have already paid all the installments.",
            });
        }


        
        emi.history.push({
            paid_amount: emi.monthly_emi,
            paid_date: new Date().toISOString(),
            payment_type: req.body?.payment_mode || "cash",
        });

        emi.payment_type = "emi";
        emi.paid_installment += 1;
        emi.remaining_amount -= emi.monthly_emi;
        emi.next_emidate = moment(emi.next_emidate).add(1, "month").toISOString();

        await emi.save();
        return res.json({
            emi,
            message: "EMI paid successfully.",
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }

});

 


router.get("/my",getAuthUser, async (req, res) => {
    try {
        const {user} = req;
        if(user.role !== "user") {
            return res.status(400).json({
                message: "Only user can have emi.",
            });
        }

        if(user.active_emi === null) {
            return res.status(200).json({
                have_emis: false,
                message: "You don't have any active emi.",
            });
        }
        
        const emi = await EMI.findById(req.user.active_emi).populate("device_id");

        
        if(!emi) {
            return res.status(200).json({
                have_emis: false,
                message: "You don't have any active emi.",
            });
        }
        
        var emipending = false;
        if(moment(emi.next_emidate).isBefore(new Date().toISOString())) {
            emipending = true;
        }
            


        return res.json({
            have_emis: true,
            emi,
            emipending,
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });        
    }
})










module.exports = router;