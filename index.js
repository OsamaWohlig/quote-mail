const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const ejs = require('ejs')
const nodemailer = require('nodemailer')
const cron = require('node-cron')
const path = require('path')

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: 'osamap4026@gmail.com',
      pass: 'zvvhpdgghbroyozl'
    }
  });

cron.schedule('*/4 * * * * *',()=>{
    fetch('https://api.api-ninjas.com/v1/quotes?category=morning',{
        method:'GET',
        headers:{
            'X-Api-Key': '4j23X6k/RruQXsjCfaM1zA==HI4L1Qc9FjibwLyp'
        }
    })
        .then((res)=>res.json())
        .then((data)=>{
            console.log(path.join(__dirname,'/welcomeMail.ejs'))
            ejs.renderFile(path.join(__dirname,'/welcomeMail.ejs'), {data})
            .then((result)=>{
                transporter.sendMail({
                    from: 'osamap4026@gmail.com',
                    to: 'vaishnavi2512@gmail.com',
                    subject: "Welcome",
                    text: "Hello", 
                    html: result,
                })
                .then(()=>console.log('sent'))
                .catch((err)=>console.log(err))
            })
        })
        .catch(err=>console.log(err))
})


app.post('/create', async(req, res) => {
    try {
        const {userName,email,password} = req.body
        const hashedPassword = await bcrypt.hash(password,10)
        const userData = new User({userName,email,password:hashedPassword})
        const response = await userData.save()
        if(!response)return res.send('try again')
        return res.send('User created successfully')
     } catch (error) {
        res.send(error.message)
     }
})

app.get('/confirm',async(req,res)=>{
    try {
        const inDb = await User.findOne({email:req.params.email})
        if(!inDb)return res.json({message:'user not found'})
        const response = await User.findOneAndUpdate({email:req.params.email},{$set:{isVerified:true}},{new:true})
        if(!response)return res.json({message:'Some error occured'})
        return res.json({message:'Account Verified Succcessfully'})
    } catch (error) {
        return res.json({error})
    }
})

app.listen(3000,()=>console.log('listening on port 3000'))