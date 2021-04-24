var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;

function preload(){
sadDog=loadImage("Images/sad.png");
happyDog=loadImage("Images/happy.png");
}

function setup() {
  database=firebase.database();
  createCanvas(displayWidth,displayHeight);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(900,200,500,500);
  dog.addImage(sadDog);
  

  
  feed=createButton("Feed the dog");
  feed.position(700,120);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,120);
  addFood.mousePressed(addFoods);
  
  foodStock.scale=1
  dog.scale=1
  sadDog.scale=1
}

function draw() {
  background("pink");
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed % 12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS 
  })
}