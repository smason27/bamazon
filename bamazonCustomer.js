require("dotenv").config();
const mysql = require("mysql");
const table = require("console.table");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: process.env.password,
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
    displayItems();
    //   connectionend();
});

let userQuantity;
let userItem;
let userProduct;

function CreateItem(itemId, name, price) {
    this.itemId = itemId;
    this.name = name;
    this.price = price;
}

function CreateReceipt(name, price, quantity, total) {
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.total = total;
}

// Then create a Node application called `bamazonCustomer.js`. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

function displayItems() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw (err);
        // console.log(res);
        const items = res;
        let newItem = [];

        for (i = 0; i < items.length; i++) {
            newItem[i] = new CreateItem(items[i].id, items[i].product, items[i].price)
        }
        console.table(newItem);
        promptBuyer();
    })
}
//6. The app should then prompt users with two messages.
// * The first should ask them the ID of the product they would like to buy.
// * The second message should ask how many units of the product they would like to buy.
function promptBuyer() {
    inquirer.prompt([
        {
            type: "input",
            name: "product_id",
            message: "What product number would you like to buy?"
        },
        {
            type: "input",
            name: "quantity",
            message: "How many would you like to buy?"
        }
    ]).then(function (answers) {
        userItem = answers.product_id;
        userQuantity = answers.quantity;
        let query = `SELECT product FROM products WHERE id = ${userItem}`
        connection.query(query, userItem, function (err, res) {
            // console.log(res);
            userProduct = res[0].product
        })
        checkProduct(userItem, userQuantity);
    })
}
// 7. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

function checkProduct(userItem, userQuantity) {
    // console.log(userItem)
    // console.log(userQuantity)
    let query = `SELECT stock FROM products WHERE id= ${userItem}`
    connection.query(query, userItem, function (err, res) {
        // console.log(res)
        let currentStock = res[0].stock;
        // console.log(currentStock)

        // currentStock >= userQuantity ? console.log("Thanks for buying our stuff!") : console.log("We don't have enough product right now!")

        if (currentStock >= userQuantity) {
            console.log("Thanks for buying our stuff!")
            let newStock = currentStock -= userQuantity;
            fulfillOrder(newStock, userItem);
        } else {
            console.log("We don't have enough product right now!")
            promptBuyer();
            newShipment();
        }
    })
}
// * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.
// 8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
// * This means updating the SQL database to reflect the remaining quantity.

function fulfillOrder(newStock, userItem) {
    // console.log(newStock, userItem);
    let query = `UPDATE products SET stock = ${newStock}  WHERE id = ${userItem}`
    connection.query(query, [{ newStock }, { userItem }], function (err, res) {
        // console.log(res.affectedRows);
        // userReceipt();
        completePurchase();
    })
    // displayItems();
}

// * Once the update goes through, show the customer the total cost of their purchase.

function userReceipt() {
    // console.log(userQuantity);
    let query = `select price FROM products WHERE id = ${userItem}`
    connection.query(query, userItem, function (err, res) {
        // console.log(res);
        itemPrice = res[0].price;
        userTotal = itemPrice * userQuantity;
        // console.log(userTotal)
        receipt = new CreateReceipt(userProduct, itemPrice, userQuantity, userTotal);
        console.table(receipt);
    
    })
}

function completePurchase() {
    console.log(`\n--------------\n\nThanks for your purchase!\n`);
    
    inquirer.prompt([
        {
        type: "confirm",    
        name: "purchase",
        message: "Would you like to make another purchase?\n\n\n"
        }
    ]).then(function(answers) {
        if(answers.purchase) {
        userReceipt();

            displayItems();
        } else {
        userReceipt();
            connection.end();
        }
    })
}

function newShipment() {
    let query = `SELECT stock FROM products WHERE *`
    connection.query(query, function (err, res) {
        console.log(res)        

    })
}