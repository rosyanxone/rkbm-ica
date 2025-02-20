const express = require("express");
const fileUpload = require("express-fileupload");
const pdfParse = require("pdf-parse");

const exportExcel = require("./utils/generate-excels");
const getPoints = require("./utils/rkbm-points");

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
      .then((parsedPdf) => getPoints(parsedPdf))
      .then((rkbmResult) => {
        // console.log("RKBM Data: " + JSON.stringify(rkbmResult));
        rkbms.push(rkbmResult);
      });
  }

  // Generating Excel
  setTimeout(() => {
    rkbms.sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split("-");
      const [dayB, monthB, yearB] = b.date.split("-");

      // Create Date objects for comparison
      const dateA = new Date(`${monthA} ${dayA} 20${yearA}`);
      const dateB = new Date(`${monthB} ${dayB} 20${yearB}`);

      return dateA - dateB;
    });
    try {
      exportExcel(rkbms);
    } catch (e) {
      return e;
    }
  }, 1000);
});

// Listen
app.listen(3000);
console.log("Listening on port: http://localhost:3000");
