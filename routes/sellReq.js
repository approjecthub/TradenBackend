const express = require('express');
const router = express.Router();
const SellReq = require('../models/sell-request')
const Item = require('../models/item');

router.post('/', (req, res) => {
    let totalPrice = 0

    Item.findById(req.body.productID)
        .then(item => {

            let totalPrice = (item.creditPrice) * (+req.body.productQty)
            
            let sellReq
            if (req.body.paymentType === "credit") {

                sellReq = {

                    allItems: {
                        itemID: req.body.productID,
                        qty: req.body.productQty
                    },
                    userName: req.body.userName,
                    userMail: req.body.userMail,
                    userAddress: {
                        address: req.body.address,
                        state: req.body.state,
                        city: req.body.city,
                        zip: req.body.zip
                    },
                    paymentType: req.body.paymentType,
                    totalPrice,
                }
            }

            else if (req.body.paymentType === "cash") {
                sellReq = {

                    allItems: {
                        itemID: req.body.productID,
                        qty: req.body.productQty
                    },
                    userName: req.body.userName,
                    userMail: req.body.userMail,
                    userAddress: {
                        address: req.body.address,
                        state: req.body.state,
                        city: req.body.city,
                        zip: req.body.zip
                    },
                    paymentType: req.body.paymentType,
                    accountDetails:{
                        accountNo:req.body.accountNo,
                        ifsc:req.body.ifsc
                    },
                    totalPrice,
                }
            }
            else {
                throw new Error("incorrect payment type! payment type should be either 'credit' or 'cash'")
            }
            let newSellReq = new SellReq(sellReq)
            // console.log(newSellReq);
           
            return newSellReq.save()
        })
        .then(result => {
            // console.log(result);
            res.status(201).json({ result })
        })
        .catch(err => {
            console.log(err);
            return res.status(400).json({ err })
        })

})

router.get('/', (req, res)=>{
    
    SellReq.find()
    .then(result=>{
        
        res.status(200).json(result)
    })
    .catch(err=>{
        
        res.status(500).json({err})
    })
})

router.get('/:id', (req, res)=>{
    SellReq.findById(req.params.id)
    .then(result=>{
        res.status(200).json(result)
    })
    .catch(err=>{
        res.status(404).json({err})
    })
})


module.exports = router;