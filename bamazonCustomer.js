//  npm install
const mysql = require("mysql");
const Table = require('cli-table');
const inquirer = require("inquirer");

// create table
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
   afterConnection();
});
// show the results of the items
function afterConnection(){
    
    // query the data from products TABLE
    connection.query("SELECT * FROM products", (error,results) => {

        if (error) throw error;

        for(let i = 0; i<results.length; i++){
            table.push(
                [results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]);
           
            // console.log(`\n |${results[i].item_id}|${results[i].product_name} | ${results[i].department_name }  | ${results[i].price} | ${results[i].stock_quantity} `);
            // console.log(`=====================================================================================================================`);
            
        }
        // console.log(results);
        console.log(table.toString());
        // console.log(JSON.stringify(results,null,2))
        connection.end();
    });
}


// Prompt the user asking 
//  * The first should ask them the ID of the product they would like to buy.
// * The second message should ask how many units of the product they would like to buy.

// update the quantity  if it empty tell the user is empty

