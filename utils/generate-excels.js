const excelJS = require("exceljs");

function exportExcel(datas) {
  const workbook = new excelJS.Workbook();
  const worksheet = workbook.addWorksheet("RKBM");
  const path = "./output";

  worksheet.columns = [
    { header: "Tanggal", key: "date", width: 10 },
    { header: "Nomor RKBM", key: "no", width: 10 },
    { header: "Nama Kapal", key: "ship", width: 25 },
    { header: "Agen Kapal", key: "agent", width: 45 },
    { header: "Muatan", key: "load", width: 10 },
    { header: "Jenis Muatan", key: "item", width: 10 },
  ];

  let counter = 1;
  datas.forEach((data) => {
    worksheet.addRow(data);
    counter++;
  });

  let list = ["A", "B", "C", "D", "E", "F"];
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

  worksheet.getRow(1).eachCell((cell) => {
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
