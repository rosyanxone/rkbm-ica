const formatDate = require("./index");

function getPoints(result) {
  const pdfSplit = result.text.split(" ");
  // console.log(result);

  // Tanggal RKBM
  const tglRKBM = rkbmDate(pdfSplit);

  // Nama Kapal RKBM
  const kapalRKBM = rkbmShip(pdfSplit);

  // Nomor RKBM
  const nomorRKBM = parseInt(pdfSplit[0].split(".")[3]);

  // Agen Kapal RKBM
  const agentRKBM = rkbmAgent(pdfSplit);

  // Muatan RKBM
  const muatanRKBM = rkbmLoads(pdfSplit);

  // Barang RKBM
  const barangRKBM = rkbmItem(pdfSplit);

  return {
    date: tglRKBM,
    no: nomorRKBM,
    ship: kapalRKBM,
    agent: agentRKBM,
    load: muatanRKBM,
    item: barangRKBM,
  };
}

function rkbmItem(pdfSplit) {
  const point7From = pdfSplit.indexOf(
    pdfSplit.filter((str) => str.includes("KeringBATU"))[0]
  );

  if (point7From != -1) {
    if (
      pdfSplit[point7From].includes("BATUBARA") ||
      pdfSplit[point7From + 1].includes("BARA")
    ) {
      return "BATU BARA";
    } else if (pdfSplit[point7From + 1].includes("PONDASI")) {
      return "BATU PONDASI";
    }
  } else {
    const point7FromAlt = pdfSplit.indexOf(
      pdfSplit.filter((str) => str.includes("CairCPKO"))[0]
    );

    if (pdfSplit[point7FromAlt].includes("CPKO")) {
      return "CPKO";
    }
  }
}

function rkbmDate(pdfSplit) {
  const point6 = [];

  const point6From = pdfSplit.indexOf(
    pdfSplit.filter((str) => str.includes("KEPELABUHANAN\n"))[0]
  );
  const point6To = pdfSplit.indexOf(
    pdfSplit.filter((str) => str.includes("Muat\nPT."))[0]
  );

  for (let n = point6From; n <= point6To - 2; n++) {
    point6.push(pdfSplit[n]);
  }

  // TANGGAL RESULT
  return formatDate(
    point6
      .join(" ")
      .replace("KEPELABUHANAN\nSAMARINDA\nSAMARINDA, ", "")
      .replace("\nPerusahaan", "")
  );
}

function rkbmShip(pdfSplit) {
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
  return point1
    .join(" ")
    .replace("Kapal:", "")
    .replace("\n2.DWT", "")
    .replace(/-/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function rkbmAgent(pdfSplit) {
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
  return point4.join(" ").replace("Laut/Agen:", "").replace("\n5.Tiba", "");
}

function rkbmLoads(pdfSplit) {
  //   console.dir(pdfSplit, { maxArrayLength: null });
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

  if (point5[0] === "1") {
    point5From = pdfSplit.indexOf(
      pdfSplit.filter((str) => str.includes("10.Rencana"))[0]
    );

    const matches = pdfSplit[point5From].replace(/,/g, "").match(/\d+/);
    
    return matches ? parseInt(matches[0]) : "";
  }

  // MUATAN RESULT
  return parseInt(point5.join(" ").replace(",", ""));
}

module.exports = getPoints;
