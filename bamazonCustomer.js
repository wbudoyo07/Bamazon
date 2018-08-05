// dependencies
const mysql = require("mysql");
const Table = require('cli-table');
const inquirer = require("inquirer");

//var  to hold the purchase
let totalCost=0;

// connect to the database
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



// show the results of the items in the table form
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


function promptQuestions(){

    //The first question should ask user to enter the ID of the product they would like to buy.
    // should ask the user to ask how many unit they wanna buy
    inquirer
        .prompt([
            {
                name: "itemID",
                type: 'input',
                message: "What item do you wish to buy (Please enter the ID number) ?"
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
    
    // query the data from mysql from products table  where we check the id
    connection.query("SELECT * FROM products where ?", {item_id: userInput.itemID}, function(error, results){
      
        if(error) throw error;
        // check if user asking for more than the stock quantity if 
        if(parseInt(userInput.itemQuantity) > results[0].stock_quantity){
             console.log(`Insufficient quantity! We only have ${results[0].stock_quantity} units for ${results[0].product_name}`);
             
            // purchaseItem(userInput);
            promptQuestions();
        }
        else
        {

            updateQuantity(userInput,results[0].stock_quantity,results[0].price);
        }       
    });
   
    
 }

 function updateQuantity(userInput,stock,price){


    let newItemQuantity =stock - parseInt(userInput.itemQuantity)
    //query the data from mysql and update them  on products table.
     connection.query("UPDATE products SET ? WHERE ?",[ { stock_quantity: newItemQuantity },{ item_id: userInput.itemID } ],function(error, results){

        if(error) throw error;
        // calculate the total price
        totalCost += price * parseInt(userInput.itemQuantity);
        console.log(`Your total cost is ${totalCost}`);
         
        choicesPrompt();
     });
}

function choicesPrompt(){
    inquirer
        .prompt({
            name:"newTransaction",
            type:"list",
            message:"Do you wish to buy another stuff ?",
            choices:["YES","NO"]
        })
        .then(function(answer){
            if(answer.newTransaction === "YES"){
                displayTable();
            }
            else{
                
                console.log(`Thanks you for puchasing with Bamazon. Please wait 3-5 business days`);
                process.exit();
            }
        });
}

