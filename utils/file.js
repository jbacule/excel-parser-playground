const fs = require('fs');

const cleanFiles = async (files) => {
  for (let file of files) {
    if (fs.existsSync(file)) {
      await fs.unlinkSync(file);
    }
  }
  return true;
}

module.exports = { cleanFiles }
