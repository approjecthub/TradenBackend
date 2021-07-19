const express = require('express');
const router = express.Router();
const Item = require('../models/item');
const multer = require('multer')
const path = require('path')
var ObjectID = require('mongodb').ObjectID;

const MIME_type_mp = {
    'image/png':'png',
    'image/jpeg':'jpg',
    'image/jpg':'jpg'
}

const storage = multer.diskStorage({
    destination: (req,file, cb)=>{
        let isValid = MIME_type_mp[file.mimetype]
        let error = new Error('file mime type not valid')
        if (isValid){
            error = null
        }
        cb(error, path.normalize(__dirname + '\\..\\'+'public\\images'))
    },
    filename:(req,file,cb)=>{
        const name= file.originalname.split(' ').join('-')
        const ext = MIME_type_mp[file.mimetype]
        cb(null, name+'-'+Date.now()+'.'+ext)
    },
    limits:{
        fileSize:'10MB'
    }

})

router.get('/', async (req,res)=>{
    
    try{
        const items = await Item.find();
        res.status(200).json(items)
    }
    catch(err){
        res.status(501).json ({msg:err.message})
    }
})

router.get('/:id', async(req,res)=>{
    let item
    try{
        item = await Item.findById(req.params.id)
        if(item==null)
        return res.status(404).json({msg:"Item not found!.."})
    }
    catch(err){
        return res.status(500).json({msg:err.message})
    }
    res.status(200).json(item)
})

router.post('/',multer({storage:storage}).single('image'), async(req,res)=>{
    console.log('post req'); 
    
    const url = req.protocol+'://'+req.get('host')+'/images'
    const item = new Item({
        category:req.body.category,
        creditPrice:req.body.creditPrice,
        cashPrice:req.body.cashPrice,
        description:req.body.description,
        imagePath:url+'/' +req.file.filename,
    })
    
    try{
        const newItem = await item.save()        
        res.status(201).json(newItem)
    }
    catch(err){
        res.status(400).json({msg:err.message})
    }
})

router.put('/:id',multer({storage:storage}).single('image'), async(req,res)=>{
     
    let imgurl
    if(typeof req.file==='undefined'){
        imgurl = req.body.imagePath
    }
    else{
        imgurl = req.protocol+'://'+req.get('host')+'/images'+'/' +req.file.filename
    }

    const item = new Item({
        _id:ObjectID(req.params.id),
        category:req.body.category,
        creditPrice:req.body.creditPrice,
        cashPrice:req.body.cashPrice,
        description:req.body.description,
        imagePath:imgurl,
    })

    Item.updateOne({_id: ObjectID(req.params.id)}, item)
    .then(result =>{
        
        if(result.nModified==0) return res.status(500).json({msg:"upadte was not successfull"})
        res.status(200).json({msg:'updated successfully'})
    })
    .catch(err=>{
        res.status(400).json({msg:err.message})
    })
})

router.delete('/:id', async(req,res)=>{
    let item
    try{
        item = await Item.findById(req.params.id)
        if(item==null)
        return res.status(404).json({msg:"Item not found!.."})
    }
    catch(err){
        return res.status(500).json({msg:err.message})
    }
      
   try{
    await item.remove()
    res.status(200).json({msg:'Deleted item'})
   } 
   catch(err){
    res.status(500).json({msg:err.message})
   }
})

module.exports = router;