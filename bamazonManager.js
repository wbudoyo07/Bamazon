// dependencies
const mysql = require("mysql");
const Table = require('cli-table');
const inquirer = require("inquirer");

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

    promptQuestions();
  
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

function promptQuestions() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product",
          "EXIT"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "View Products for Sale":
          displayTable();
          break;
  
        case "View Low Inventory":
          viewLowInventory();
          break;
  
        case "Add to Inventory":
          addInventory();
          break;
  
        case "Add New Product":
          addProduct();
          break;

        case "EXIT":
         process.exit();
         break;
        }
      });
  }

function viewLowInventory(){
    // create an table 
    const table = new Table({
        head: ['ID', 'Product Name', 'department_name', 'Price','Quantity']
        , colWidths: [5, 50,50,20,10]
        });

    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(error,results){

        for(let i = 0; i<results.length; i++){

            table.push([results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]);
            }
    
            console.log(table.toString());

            promptQuestions();
    });
}

function addInventory(){

    // displayTable();

    inquirer
        .prompt([
            {
                name:"itemID",
                type: "input",
                message:"What item do you like to ADD (Please enter the ID number)?",
            },
            {
                name: "itemQuantity",
                type: "input",
                message:" How many do you like to ADD ?"
            }
        ])
        .then(function(userInput){

            connection.query("SELECT * FROM products where ?", {item_id: userInput.itemID},function(error, results){

                if(error) throw error;
                
                updateQuantity(userInput,results[0].stock_quantity,results[0].product_name);

            })
        })
}

function updateQuantity(userInput,stock,productName){


    let newItemQuantity =stock + parseInt(userInput.itemQuantity)
    //query the data from mysql and update them  on products table.
     connection.query("UPDATE products SET ? WHERE ?",[ { stock_quantity: newItemQuantity },{ item_id: userInput.itemID } ],function(error, results){

        if(error) throw error;
        // calculate the total price
       
        console.log(`You ADD ${userInput.itemQuantity} units to ${productName}.Current quantity is ${newItemQuantity}` );
        promptQuestions();
        
     });
}

function addProduct(){

    inquirer
        .prompt([
            {
                name:"productName",
                type:"input",
                message:"Enter the product name ?"
            },
            {
                name:"departmentName",
                type:"input",
                message:"Enter the department Name ?"
            },
            {
                name:"price",
                type:"input",
                message:"Enter the price ?"
            },
            {
                name:"stockQuantity",
                type:"input",
                message:"Enter the stock quantity ?" 
            }

        ]).then (function(userInput){
            connection.query("INSERT INTO products SET ?",
            {
                product_name: userInput.productName,
                department_name: userInput.departmentName,
                price : userInput.price,
                stock_quantity: userInput.stockQuantity
            },
            function(error){
                if(error) throw error;
                console.log("You succesfully add a new product");
                promptQuestions();
            }
        );

        })
       
}
