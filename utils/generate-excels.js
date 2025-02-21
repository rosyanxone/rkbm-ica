const excelJS = require("exceljs");

function exportExcel(datas) {
  const workbook = new excelJS.Workbook();
  const worksheet = workbook.addWorksheet("RKBM Curah Kering");
  const worksheetCair = workbook.addWorksheet("RKBM Curah Cair");
  const path = "./output";

  const format = [
    { header: "Tanggal", key: "date", width: 10 },
    { header: "Nomor RKBM", key: "no", width: 25 },
    { header: "Nama Kapal", key: "ship", width: 25 },
    { header: "Agen Kapal", key: "agent", width: 45 },
    { header: "Jenis Bongkar", key: "itemBongkar", width: 18 },
    { header: "Jenis Muat", key: "itemMuat", width: 18 },
    { header: "Jumlah Bongkar", key: "amountBongkar", width: 10 },
    { header: "Jumlah Muat", key: "amountMuat", width: 10 },
  ];

  worksheet.columns = format;
  worksheetCair.columns = format;

  let counter = 1;
  let counterCair = 1;
  datas.forEach((data) => {
    if (data.classification == "Curah Kering") {
      worksheet.addRow(data);
      counter++;
    } else {
      worksheetCair.addRow(data);
      counterCair++;
    }
  });

  let list = ["A", "B", "C", "D", "E", "F", "G", "H"];
  // Curah Kering Sheet
  for (let i = 0; i <= counter; i++) {
    list.forEach((item) => {
      worksheet.getCell(item + i).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  }
  // Curah Cair Sheet
  for (let j = 0; j <= counterCair; j++) {
    list.forEach((item) => {
      worksheetCair.getCell(item + j).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  }

  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
  });
  worksheetCair.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
  });

  try {
    workbook.xlsx.writeFile(`${path}/rkbm.xlsx`).then(function () {
      console.log("\nData Successfully Generated.");
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = exportExcel;
