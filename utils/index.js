function formatDate(dateStr) {
  // Parse the date string
  const [day, month, year] = dateStr.split(" ");

  // Create a Date object (using 2000 + year to ensure proper century)
  const date = new Date(`${month} ${day} ${year}`);

  // Get day and pad with leading zero if needed
  const formattedDay = date.getDate().toString();

  // Get month abbreviation
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const formattedMonth = months[date.getMonth()];

  // Get last two digits of year
  const formattedYear = year.slice(-2);

  // Return formatted date (dd-Mmm-YY)
  return `${formattedDay}-${formattedMonth}-${formattedYear}`;
}

function sortRKBM(rkbms) {
  return rkbms.sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split("-");
    const [dayB, monthB, yearB] = b.date.split("-");

    // Create Date objects for comparison
    const dateA = new Date(`${monthA} ${dayA} 20${yearA}`);
    const dateB = new Date(`${monthB} ${dayB} 20${yearB}`);

    return dateA - dateB;
  });
}

module.exports = { formatDate, sortRKBM };
