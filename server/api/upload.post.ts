import Excel from 'exceljs'

export default defineEventHandler(async (event) => {
  const body = await readMultipartFormData(event)

  const fileBuffer =  body ? body[0].data : null;
  const code = body ? body[1].data.toString() : ""

  if(!fileBuffer){
    throw new Error("No file uploaded")
  }

  if(!code){
    throw new Error("please insert code")
  }

  const workbook = new Excel.Workbook();
  const wb = await workbook.xlsx.load(fileBuffer);

  const stringToFunction = new Function('return ' + code)();
  const result = await stringToFunction(wb)

  return result
});
