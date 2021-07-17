const express = require('express');
const mongoose=require('mongoose');
const ShortUrl=require('./models/shortUrl');
require('dotenv').config();
const app = express();
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});
app.use(express.urlencoded({extended:false}));

app.set('view engine', 'ejs');
app.get('/', async (req, res) => {
  try{
    const shortUrls = await ShortUrl.find();
    res.render('index', { shortUrls: shortUrls });
  } catch(e){
    console.log(e);
  }
  });
  
  app.post('/shortUrls', async (req, res) => {
    try{
      await ShortUrl.create({ full: req.body.fullUrl });
      res.redirect('/');
    }
    catch(e){
      console.log(e);
    }
  })
  
  app.get('/:shortUrl', async (req, res) => {
    try{
      const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
      if (shortUrl == null) return res.sendStatus(404);
    
      shortUrl.clicks++
      shortUrl.save();
    
      res.redirect(shortUrl.full);
    } catch(e){
      console.log(e);
    }
  });
  
  app.listen(process.env.PORT || 5000);