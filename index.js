import express, { response } from 'express';
import mongoose from 'mongoose'
import multer from 'multer'
import csv from 'csvtojson'
import ExcelData from './excel.js'
import ExcelJs from 'exceljs'
const app = express();
app.use(express.json())

const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
            cb(null, './uploads')
    },
    filename:(req,file, cb)=>{
            cb(null, file.originalname)
    }
})
var upload = multer({storage})




app.post('/uploadfile',upload.single('file'), (req, res)=>{
    console.log('upload file called');
    try {
        var userData = []
        csv().fromFile(req.file.path).then(async (response)=>{
            console.log(response);
            for (let i = 0; i < response.length; i++) {
                    userData.push({
                        name:response[i].name,
                        age:response[i].age,
                        email:response[i].email,
                        mobilenumber:response[i].mobile
                    })                
            }
            // console.log(userData);
            await ExcelData.insertMany(userData);
        })
        res.send('file uploaded') 
        
    } catch (error) {
        console.log(error.message);
        res.send(error.message)
    }
})

app.get('/download',async(req,res)=>{
    try {
        var alldata = await ExcelData.find({});
        // console.log(alldata);
        const workbook = new ExcelJs.Workbook();
        const worksheet = workbook.addWorksheet('data')
        worksheet.columns = [
            {header:'no', key:'sno', width:10},
            {header:'name', key:'name', width:10},
            {header:'age', key:'age', width:10},
            {header:'email', key:'email', width:15},
            {header:'mobilenumber', key:'mobilenumber', width:15},
        ];
        let count = 1;
        alldata.forEach((data)=>{
            // console.log('count ', count);
            data.sno = count;
            // console.log('data ', data);
            worksheet.addRow(data);
            count++;
        })
        // worksheet.getRow().eachCell((cell)=>{})
        const file = await workbook.xlsx.writeFile('./download/dwnldName.xlsx')
        res.download('./download/dwnldName.xlsx', 'abcd.xlsx');

    } catch (error) {
        console.log(error.message);
        res.send(error.message)
        
    }
})






const db = 'mongodb://localhost:27017/excel'
async function connectToMongoDB() {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(4000,()=>{
        console.log('Connected to MongoDB, listen-4000');

    })
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToMongoDB();
