const express = require("express");
const fileUpload = require("express-fileupload");
const pdfParse = require("pdf-parse");
const { exec } = require("child_process");

const exportExcel = require("./utils/generate-excels");
const getPoints = require("./utils/rkbm-points");
const { sortRKBM } = require("./utils");

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

  // Collects RKBM
  for (let i = 0; i < rkbmPdf.length; i++) {
    pdfParse(rkbmPdf[i])
      .then((parsedPdf) => getPoints(parsedPdf, rkbmPdf[i]))
      .then((rkbmResult) => {
        console.log("RKBM Data: " + JSON.stringify(rkbmResult));
        rkbms.push(rkbmResult);
      });
  }

  // Generating Excel
  setTimeout(() => {
    const sortedRKBM = sortRKBM(rkbms);

    try {
      exportExcel(sortedRKBM);
    } catch (e) {
      return e;
    }
  }, 1000);
});

// Listen
app.listen(5000);
console.log("Listening on port: http://localhost:5000");

exec("start http://localhost:5000", (err) => {
  if (err) {
      console.error('Failed to open browser:', err);
  }
});
