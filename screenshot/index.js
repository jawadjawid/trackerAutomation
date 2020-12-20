const puppeteer = require("puppeteer");
const mongodb = require('mongodb');

module.exports = async function (context, req) {
    //http://localhost:7071/api/screenshot?url=https://google.com&email=jawadadham98@gmail.com
    const url = req.query.url || "https://google.com/";
    const email = req.query.email || "jawadadham98@gmail.com";

    const browser = await puppeteer.launch({
        args: ["--no-sandbox"]
    });
    const page = await browser.newPage();
    await page.goto(url);
    const screenshotBuffer = await page.screenshot({ fullPage: true });

    const innerText = await page.evaluate(() => document.querySelector('body').innerText);

    await browser.close();

    // const uri = "mongodb+srv://jawad:jawad@cluster0.r6ob1.azure.mongodb.net/test?retryWrites=true&w=majority";
    // const client = new MongoClient(uri, { useNewUrlParser: true });

    var MongoClient = require('mongodb').MongoClient;
    var uri = "mongodb+srv://jawad:jawad@cluster0.r6ob1.azure.mongodb.net/test?retryWrites=true&w=majority";
    
    MongoClient.connect(uri, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      var myobj = { url: url, email: email, text: innerText };
      dbo.collection("customers").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted to mongo");
        db.close();
      });
    });
    context.res = {
        body: innerText,
        headers: {
            // "content-type": "image/png"
        }
    };
};