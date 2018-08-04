// dependencies
const mysql = require("mysql");
const Table = require('cli-table');
const inquirer = require("inquirer");

// create an table 
const table = new Table({
    head: ['ID', 'Product Name', 'department_name', 'Price','Quantity']
  , colWidths: [5, 50,50,20,10]
});
// connect  to the database
const connection = mysql.createConnection({
     
    host:"localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon_db"

}); 
connection.connect( error => {

    if(error) throw error;
   console.log("Connection as id" +connection.threadId);
   main();
  
});


function main(){
    displayTable();
}
// show the results of the items
function displayTable(){
    
    // query the data from products TABLE
    connection.query("SELECT * FROM products", (error,results) => {

        if (error) throw error;

        for(let i = 0; i<results.length; i++){

        table.push([results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]);
        }

        console.log(table.toString());
        promptQuestions();
    
    });
   
};

// Prompt the user asking
function promptQuestions(){

    //The first should ask them the ID of the product they would like to buy.
    inquirer
        .prompt([
            {
                name: "itemID",
                type: 'input',
                message: "What kind of item do you like to buy?/n Please enter the Product ID?"
            },
            {
                name: "itemQuantity",
                type: "input",
                message: "How many do you like to buy ?"
              
            } 
        ])
        .then(function(answer){
            // checkQuantity(answer);
            checkItemID(answer);
            // console.log(answer);


 });

 }

 function checkItemID(userInput){
    
    // query the data from mysql
    connection.query("SELECT * FROM products where ?", {item_id: userInput.itemID}, function(error, results){
        
        if(error) throw error;
        // check user input 
        if(parseInt(userInput.itemQuantity) > results[0].stock_quantity){
             console.log(`We don't have enough stock`);
             
            // purchaseItem(userInput);
            
        }else{
            
            purchaseItem(userInput,results[0].stock_quantity);
            // console.log(results[0].stock_quantity);
        }
        promptQuestions();
        //else your id was wrong please try again
        
    });
   
    
 }

 function purchaseItem(userInput,stock){
     connection.query("UPDATE products SET ? WHERE ?",
     [
         {
             stock_quantity: stock - parseInt(userInput.itemQuantity)
         },
         {
             item_id: userInput.itemID
         }
      ], 
       function(error,){

        if(error) throw error;
        console.log("you success");
        promptQuestions();
     });
 }
