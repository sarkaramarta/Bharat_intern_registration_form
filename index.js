import bodyParser from "body-parser";
import express , { urlencoded } from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const port = 3000;
const db_link = "mongodb+srv://amartarocks3:2tq91NNVocAxVPYW@cluster0.aderzjp.mongodb.net/BharatIntern";

mongoose.connect(db_link);
let database = mongoose.connection;

database.on('connected',()=> {
// to check if db is connected or not 
    console.log("db connected");
})
    app.get("/",(req, res) => {
        res.sendFile(__dirname + "/pages/index.html")
    })
// schema 
    const registrationSchema = new mongoose.Schema({
        name: String,
        email: String,
        password: String,
    });



    const Registration = mongoose.model("Registration", registrationSchema);

    app.use(bodyParser.urlencoded({ extended: true}));
    app.use(bodyParser.json());

    app.post("/register", async(req, res)=> {
        try {
            const {name, email, password} = req.body;
            const existingUser = await Registration.findOne({ email:email });
            if (!existingUser) {
                const registrationData = new Registration({
                    name,
                    email,
                    password
                });
                await registrationData.save();
                res.redirect("/success");
            }
            else {
                console.log("user exist");
                res.redirect("/error");
            }
            
        }
        catch (error) {
            console.log(error);
            res.redirect("/error");
        }
    })

    app.get("/success", (req, res) => {
        res.sendFile(__dirname+"/pages/registered.html");
    })
    
    app.get("/error", (req, res) => {
        res.sendFile(__dirname+"/pages/error.html");
    })

app.listen(port, ()=>{
    console.log(`server running in port ${port}`);
})