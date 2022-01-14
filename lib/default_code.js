async function parse(workbook){
  //========== Dont update this part if you dont have knowledge in ExcelJs ===============
  let result = [];
  const worksheet = await workbook.getWorksheet(1); //get the first sheet in your workbook
  const rows = worksheet.getSheetValues(); //get all row values
  //=======================================================================================
  
  //If you want to have a header, follow the format below; Delete if not needed;
  let defaultHeader = { itemNumber: 'Item Number', size: 'Size', quantity: 'Quantity', itemCost: 'Item Cost', totalCost: 'Total Cost' }
  result.push(defaultHeader);

  for (let x in rows) {
    let row = rows[x];

    //start coding here :)
  }
  
  return result; //Dont delete this line
}

module.exports = parse