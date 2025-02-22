const { formatDate } = require("./index");

function getPoints(parsedPdf, rkbmPdf) {
  const pdfSplit = parsedPdf.text.split(" ");
  // console.log(parsedPdf);

  // Rencana RKBM
  const planRKBM = rkbmPdf.name.split(" ")[0] == "RKBM-B" ? "Bongkar" : "Muat";

  // Tanggal RKBM
  const tglRKBM = rkbmDate(pdfSplit);

  // Nama Kapal RKBM
  const kapalRKBM = rkbmShip(pdfSplit);

  // Nomor RKBM
  const nomorRKBM = pdfSplit[0]
    .split(" ")[0]
    .split("Kepada\n")[0]
    .split("Nomor:")[1];

  // Agen Kapal RKBM
  const agentRKBM = rkbmAgent(pdfSplit);

  // Muatan RKBM
  const { loadBongkar, loadMuat } = rkbmLoads(pdfSplit, planRKBM);

  // Barang RKBM
  const { itemBongkar, itemMuat } = rkbmItem(pdfSplit, planRKBM, rkbmPdf.name);

  // Klasifikasi RKBM
  const classificationRKBM = rkbmClassification(pdfSplit);

  return {
    date: tglRKBM,
    no: nomorRKBM,
    ship: kapalRKBM,
    agent: agentRKBM,
    amountBongkar: loadBongkar,
    amountMuat: loadMuat,
    itemBongkar,
    itemMuat,
    classification: classificationRKBM,
  };
}

function rkbmClassification(pdfSplit) {
  const point8 = pdfSplit.indexOf(
    pdfSplit.filter((str) => str.includes("Curah"))[0]
  );
  const result = pdfSplit[point8 + 1].includes("Kering")
    ? "Curah Kering"
    : "Curah Cair";

  return result;
}

function rkbmItem(pdfSplit, planRKBM, pdfName) {
  const point7From = pdfSplit.indexOf(
    pdfSplit.filter((str) => str.includes("KeringBATU"))[0]
  );

  const result = () => {
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
        pdfSplit.filter((str) => str.includes("Cair"))[0]
      );

      if (pdfSplit[point7FromAlt].includes("CPKO")) {
        return "CPKO";
      } else if (pdfSplit[point7FromAlt].includes("CPO")) {
        return "CPO";
      } else if (pdfSplit[point7FromAlt].includes("CRUDE")) {
        return "CRUDE PALM KERNEL OIL";
      }
    }
  };

  let itemBongkar = null;
  let itemMuat = null;

  switch (planRKBM) {
    case "Bongkar":
      itemBongkar = result();
      break;
    case "Muat":
      itemMuat = result();
      break;
  }

  return { itemBongkar, itemMuat };
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

function rkbmLoads(pdfSplit, planRKBM) {
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

  let muatanRKBM = null;

  if (point5[0] === "1") {
    point5From = pdfSplit.indexOf(
      pdfSplit.filter((str) => str.includes("10.Rencana"))[0]
    );

    const matches = pdfSplit[point5From].replace(/,/g, "").match(/\d+/);

    muatanRKBM = matches ? parseInt(matches[0]) : "";
  } else if (point5[0].includes("Jumlah")) {
    muatanRKBM = parseInt(point5[1].replace(",", ""));
  } else {
    muatanRKBM = parseInt(point5.join(" ").replace(",", ""));
  }

  let loadBongkar = null;
  let loadMuat = null;

  switch (planRKBM) {
    case "Bongkar":
      loadBongkar = muatanRKBM;
      break;
    case "Muat":
      loadMuat = muatanRKBM;
      break;
  }

  // MUATAN RESULT
  return { loadBongkar, loadMuat };
}

module.exports = getPoints;
