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

module.exports = formatDate;
