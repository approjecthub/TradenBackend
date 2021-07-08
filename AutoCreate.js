// const path = require('path')
// console.log((__dirname).split(path.sep));
// console.log(path.normalize(__dirname + '\\..\\'+'public\\images'));
require('dotenv').config()

const mongoose = require('mongoose');

mongoose.connect(process.env.DB_url,
  { useNewUrlParser: true, useUnifiedTopology: true })

const csv = require('csv-parser');
const fs = require('fs');
const Item = require('./models/item')

datas = []
fs.createReadStream('./AllGameDataDownloaded.csv')
  .pipe(csv())
  .on('data', (row) => {
    // console.log(row);
    const url = 'http://127.0.0.1:3000/images'

    let CreditPrice = row.CreditPrice.replace("Rs. ", "")
    CreditPrice = CreditPrice.replace(",", "")
    let CashPrice = row.CashPrice.replace("Rs. ", "")
    CashPrice = CashPrice.replace(",", "")

    const item = new Item({
      category: row.Category,
      creditPrice: CreditPrice,
      cashPrice: CashPrice,
      description: row.Details,
      imagePath: url + '/' + row.ImgLink,
    })

    datas.push(item)

  })
  .on('end', async() => {
    console.log('CSV file successfully processed');

    let idx = 0
    for (let data of datas) {
      
      try {
        await data.save()
        console.log(`Save item no: ${++idx}/${datas.length}`);
      }
      catch (err) {
        console.log(err);
      }
    }

  });