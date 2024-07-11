const express = require("express");
const fileUpload = require("express-fileupload");
const pdfParse = require("pdf-parse");
const excelJS = require("exceljs");

const app = express();

app.use("/", express.static("public"));
app.use(fileUpload());

app.get("/download", function (req, res) {
  res.download("./output/rkbm.xlsx");
});

app.post("/extract", (req, res) => {
  if (!req.files && !req.files.pdfFile) {
    res.status(400);
    res.end();
  }

  const rkbms = [];
  const rkbmPdf = req.files.pdfFile;

  for (let i = 0; i < rkbmPdf.length; i++) {
    pdfParse(rkbmPdf[i])
      .then((parsedPdf) => generateRkbm(parsedPdf))
      .then((rkbmResult) => {
        console.log("RKBM Data: " + JSON.stringify(rkbmResult));
        rkbms.push(rkbmResult);
      });
  }

  // Generating Excel
  setTimeout(() => {
    rkbms.sort((a, b) => a.no - b.no);
    
    const result = generateExcel(rkbms);
    return result;
  }, 1000);
});

// Listen
const port = process.env.PORT || 3000;
app.listen(port);
console.log("Listening on port: " + port);

function generateExcel(datas) {
  const workbook = new excelJS.Workbook();
  const worksheet = workbook.addWorksheet("RKBM");
  const path =  process.env.PATH || "./output";

  worksheet.columns = [
    { header: "Nomor", key: "no", width: 10 },
    { header: "Nama Kapal", key: "ship", width: 25 },
    { header: "Agen Kapal", key: "agent", width: 45 },
    { header: "Muatan", key: "ammount", width: 10 },
  ];

  let counter = 1;
  datas.forEach((data) => {
    worksheet.addRow(data);
    counter++;
  });

  let list = ["A", "B", "C", "D"];
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
      console.log("Data Successfully Generated.");
      return "Data Successfully Generated.";
    });
  } catch (error) {
    console.log(error);
    return error;
  }
}

function generateRkbm(result) {
  const pdfSplit = result.text.split(" ");

  // Kapal RKBM
  const point1 = [];

  const point1From = pdfSplit.indexOf(
    pdfSplit.filter((str) => str.includes("Kapal:"))[0]
  );
  const point1To = pdfSplit.indexOf(
    pdfSplit.filter((str) => str.includes("2.DWT"))[0]
  );

  for (let m = point1From; m <= point1To; m++) {
    point1.push(pdfSplit[m]);
  }

  // NAMA KAPAL RESULT
  const kapalRKBM = point1
    .join(" ")
    .replace("Kapal:", "")
    .replace("\n2.DWT", "");

  // Nomor RKBM
  // NOMOR RESULT
  const nomorRKBM = parseInt(pdfSplit[0].split(".")[3]);

  // Agen Kapal RKBM
  const point4 = [];

  const point4From = pdfSplit.indexOf(
    pdfSplit.filter((str) => str.includes("Laut/Agen:"))[0]
  );
  const point4To = pdfSplit.indexOf(
    pdfSplit.filter((str) => str.includes("5.Tiba"))[0]
  );
  for (let j = point4From; j <= point4To; j++) {
    point4.push(pdfSplit[j]);
  }

  // AGEN RESULT
  const agenRKBM = point4
    .join(" ")
    .replace("Laut/Agen:", "")
    .replace("\n5.Tiba", "");

  // Muatan RKBM
  const point5 = [];

  let point5From = pdfSplit.indexOf(
    pdfSplit.filter((str) => str.includes("10.Rencana"))[0]
  );
  let point5To = pdfSplit.indexOf(
    pdfSplit.filter((str) => str.includes("11."))[0]
  );

  for (let k = point5From; k <= point5To; k++) {
    if (pdfSplit[k].includes("/") && pdfSplit[k + 2].includes("/")) {
      point5.push(pdfSplit[k + 1]);
    }
  }

  if (!point5.length > 0) {
    point5From = pdfSplit.indexOf(
      pdfSplit.filter((str) => str.includes("9.Rencana"))[0]
    );
    point5To = pdfSplit.indexOf(
      pdfSplit.filter((str) => str.includes("10.Rencana"))[0]
    );

    for (let l = point5From; l <= point5To; l++) {
      if (pdfSplit[l].includes("/") && pdfSplit[l + 2].includes("/")) {
        point5.push(pdfSplit[l + 1]);
      }
    }
  }

  // MUATAN RESULT
  const muatanRKBM = parseInt(point5.join(" ").replace(",", ""));

  return {
    no: nomorRKBM,
    ship: kapalRKBM,
    agent: agenRKBM,
    ammount: muatanRKBM,
  };
}
