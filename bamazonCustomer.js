// dependencies
const mysql = require("mysql");
const Table = require('cli-table');
const inquirer = require("inquirer");
let totalCost=0;
// var totalCost=0;


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

   displayTable();
  
});



// show the results of the items
function displayTable(){
    
    // create an table 
    const table = new Table({
    head: ['ID', 'Product Name', 'department_name', 'Price','Quantity']
    , colWidths: [5, 50,50,20,10]
    });

    // query the data from products TABLE and push all the data to table NPM
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
            
            purchaseItem(answer);
        });
}

 function purchaseItem(userInput){
    
    // query the data from mysql
    connection.query("SELECT * FROM products where ?", {item_id: userInput.itemID}, function(error, results){
      
        if(error) throw error;
        // check user input 
        if(parseInt(userInput.itemQuantity) > results[0].stock_quantity){
             console.log(`Insufficient quantity!`);
             
            // purchaseItem(userInput);
            promptQuestions();
        }else{
            
            updateQuantity(userInput,results[0].stock_quantity,results[0].price);
            // console.log(results[0].stock_quantity);
        }
       
        //else your id was wrong please try again
        
    });
   
    
 }

 function updateQuantity(userInput,stock,price){

    let newItemQuantity =stock - parseInt(userInput.itemQuantity)
     connection.query("UPDATE products SET ? WHERE ?",
     [
         {
             stock_quantity: newItemQuantity
         },
         {
             item_id: userInput.itemID
         }
      ], 
       function(error, results){

        if(error) throw error;
        console.log(`Thanks for buying with us`);
        totalCost += price * parseInt(userInput.itemQuantity);
        console.log(totalCost)
         
        choicesPrompt();
     });
}

function choicesPrompt(){
    inquirer
        .prompt({
            name:"newTransaction",
            type:"list",
            message:"Do you wish to another stuff ?",
            choices:["YES","NO"]
        })
        .then(function(answer){
            if(answer.newTransaction === "YES"){
                displayTable();
            }
            else{
                console.log("Thanks for having service with BAMAZON");
            }
        });
}
// we need to find the item that customer choices
// get the price of customer of choices
// assign all the price to variable and add them up
// print the customer total price

