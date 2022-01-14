const express = require('express');
const Excel = require('exceljs');
const fs = require('fs');
const path = require('path');
const { uploadFileToServer } = require('./utils/upload');
const { cleanFiles } = require('./utils/file');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./lib'))

app.get('/api/load-default', (req, res) => {
  let defaultCode = require('./lib/default_code.js')
  
  res.status(200).json({
    code: defaultCode.toString()
  })
})

app.get('/api/load-sample', (req, res) => {
  const sampleCode = require('./lib/sample_code.js');
  res.status(200).json({
    file: 'https://drive.google.com/uc?export=download&id=1T-gHLYl6K0h59-bYElTrHx2m_ZUz8qEL',
    code: sampleCode.toString()
  })
})

app.post('/api/upload', uploadFileToServer.single('file'), async (req, res) => {
  try {
    if(!req.file) throw({ status: 400, message: 'Please upload file!' });

    const fileType = req.file.originalname.split(".").pop();
    if(fileType !== 'xlsx' && fileType !== 'xlsm' && fileType !== 'xls'  && fileType !== 'csv'){
      await cleanFiles([req.file.path])
      throw({ status: 400, message: 'Only accepts excel file format (xlsx, xlsm, xls, csv)!' });
    }

    if(!req.body.code){
      await cleanFiles([req.file.path])
      throw({ status: 400, message: 'Please enter your code!' });
    }

    const fileStream = fs.createReadStream(req.file.path)
    const workbook = new Excel.Workbook();
    const wb = await workbook.xlsx.read(fileStream);

    // let funcString = test.toString()
    let stringToFunction = new Function('return ' + req.body.code)();

    let result = await stringToFunction(wb)
    await cleanFiles([req.file.path])
    res.json(result)
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message } || 'Internal Server Error')
  }
})

//Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/dist'));
  app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
  })
}

const server = app.listen(PORT, () => {
  console.log(`Server running in PORT: ${PORT}`)
})

process.on('unhandledRejection', (error) => {
  console.log(error)
  process.exit(0);
})

module.exports = server;