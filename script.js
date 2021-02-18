const express=require('express');
const bodyParser=require('body-parser');
const bcrypt = require("bcrypt-nodejs");
const cors=require('cors');
const app=express();
const knex=require('knex')
const db=knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'nilmani18@',
      database : 'test'
    }
  });

  db.select('*').from('users').then(data=>{
      console.log(data);
  });
  app.use(bodyParser.json());
app.use(cors())
// const database={
//     users:[
//         {
//             id:'123',
//             name:'john',
//             email:'john@gmail.com',
//             password:'cookies',
//             entries:0,
//             joined:new Date()
//         },
//         {
//             id:'124',
//             name:'sally',
//             email:'sally@gmail.com',
//             password:'banana',
//             entries:0,
//             joined:new Date()
//         }
//     ]
// }
app.get('/',(req,res)=>{
   //res.send("response is working");
   res.send(database.users);
})
app.post('/signin',(req,res)=>{

    bcrypt.compare("apple",'$2a$10$VnorI4o45vyNGbzqVmhdCuzZuctlaHIUDVk1.CK0/Jhqp19DSenES' , function(err, res) {
        // res == true
        console.log("first",res);
    });
    bcrypt.compare("veggies", '$2a$10$VnorI4o45vyNGbzqVmhdCuzZuctlaHIUDVk1.CK0/Jhqp19DSenES', function(err, res) {
        // res = false
        console.log('second',res);
    });
    if(req.body.email===database.users[0].email && 
        req.body.password===database.users[0].password){
            res.json("success");
        }
        else{
            res.status(400).json("error");
        }
// res.json('signing');
})

app.post('/register',(req,res)=>{
    const{email,name,password}=req.body;
    // bcrypt.hash(password, null, null, function(err, hash) {
    //     // Store hash in your password DB.
    //     console.log(hash);
    // });
    db('users')
    .returning('*')
    .insert({
        email:email,
        name:name,
        joined:new Date()
    })
   // .then(console.log)
    .then(user=>{
      //  res.json(database.users[database.users.length-1]);
      res.json(user[0]);
    })
    .catch(err=>res.status(400).json('unable to register'))
    // database.users.push({
    //     id:'123',
    //     name:name,
    //     email:email,
    //    // password:password,
    //     entries:0,
    //     joined:new Date()
    // })
    
})

app.get('/profile/:id',(req,res)=>{ ///profile/:123
        const {id}=req.params;
        let found=false;
        database.users.forEach(user=>{
            if(user.id==id){
                found=true;
                res.json(user);
            }
           
        })
        if(!found){
                res.status(404).json("no such error");
        }
})


app.post('/image',(req,res)=>{
    const { id }=req.body;
        let found=false;
        database.users.forEach(user=>{
            if(user.id===id){
                found=true;
                user.entries++
                return res.json(user.entries);
            }
           
        })
        if(!found){
                res.status(400).json('not found');
        }
})
app.listen(3000,()=>{
    console.log('app is running');
})