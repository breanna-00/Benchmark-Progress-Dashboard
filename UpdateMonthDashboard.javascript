function updateAnahiemMonthDashboard() {
  // Get the active spreadsheet
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Select the specific sheet where the operation will happen
  const sheet = ss.getSheetByName("AnaheimMonthDashboard");

  /**
   * Array mapping MONTH → COLUMN INDEX
   * Format: [monthNumber, columnNumber, monthNumber, columnNumber, ...]
   *
   * Example:
   *   8,5   → If month = 8 (August), use column 5 (E)
   *   9,6   → If month = 9 (September), use column 6 (F)
   *   ...
   *   6,16  → If month = 6 (June), use column 16 (P)
   */
  const colSchoolYear = [8,5,9,6,10,7,11,8,12,9,1,10,2,11,3,12,4,13,5,15,6,16];

  // Get the last month as a number (1 = Jan, 12 = Dec)
      // Because you update the month once the month is over, so you're updating last month's data
  const lastMonth = new Date().getMonth();

  // Will hold the string for the range (e.g., "E2:E15")
  let rangeString = null;

  // Loop through colSchoolYear in pairs (month, column)
  for (let i = 0; i < colSchoolYear.length; i += 2) {
    // If the current month matches one of the month numbers
    if (lastMonth === colSchoolYear[i]) {
      // Convert the column number to a column letter (e.g., 5 → "E")
      let colLetter = columnToLetter(colSchoolYear[i+1]);

      // Build the full range string (rows 2 to 15 in that column)
      rangeString = colLetter + "2:" + colLetter + "15";

      // Stop the loop once we’ve found the matching month
      break;
    }
  }

  // If a valid range was found
  if (rangeString) {
    // Get that range on the sheet
    let range = sheet.getRange(rangeString);

    // Copy all values into memory
    let values = range.getValues();

    // Clear the range contents (but keep formatting/validation)
    range.clearContent();

    // Paste the values back into the same range
    range.setValues(values);
  } else {
    // If no matching month exists, log a message
    Logger.log("No matching month found.");
  }
}


/**
 * Converts a column number to a column letter.
 * Example:
 *   1 → "A"
 *   5 → "E"
 *   27 → "AA"
 */
function columnToLetter(column) {
  let letter = "";
  while (column > 0) {
    let mod = (column - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    column = Math.floor((column - mod) / 26);
  }
  return letter;
}
