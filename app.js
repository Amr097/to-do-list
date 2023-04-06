const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

const itemSchema = {
  name: String
}


const Item = mongoose.model('Item', itemSchema);


const listSchema = {
  name: String,
  items: [itemSchema]
}

const listItem = mongoose.model('listItem', listSchema);


app.get("/", function(req, res) {
 
 Item.find({}).then(
  ((foundItems)=>{

   res.render("list", {listTitle: "List", newListItems: foundItems, BtnValue: "", date:new Date().getFullYear()});

  }))

});


app.get("/:name",  function(req,res){
  const routeName = req.params.name;
 
  {listItem.findOne({name: routeName}).then(
   list =>{
       if(list){
         res.render("list", {listTitle: `${routeName}`, newListItems: list.items, BtnValue: ""});
       }
       else{
         const newList = new listItem({name: routeName});
         newList.save();
         res.redirect(`/${routeName}`)
       }
   }
  )}
 
  
 })

 app.get("/about", function(req, res){
  res.render("about");
});


app.post("/", function(req, res){
  const item = req.body.newItem;
  const listName = req.body.list;

  let DBitem = new Item({name: item});

  if(listName === 'List'){
    DBitem.save(); 
    res.redirect('/');
  }

  else{
    
    listItem.findOne({name: listName}).then(
      list=>{
        list.items.push(DBitem);
        list.save();
        res.redirect(`/${list.name}`)
      }
    )
  }

});


app.post('/delete', function(req, res){
 
  const itemId = req.body.checkbox;
  const currentList = req.body.ListName;

  Item.findOne({_id: itemId}).then(
     item=>{
      if(currentList === 'List'){
         item.deleteOne({_id : itemId});
         res.redirect(`/`)
     }
     else{
         listItem.findOneAndUpdate({name: currentList}, {$pull:{items:{_id: itemId}}}).then(
          res.redirect(`/${currentList}`)) 
     }
    }
  )
})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});


