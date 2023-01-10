function formatDate(dateAsUnix, i18n, type) {

  /**
   * type of date to display *[ excluded ]
   * search -  asked Jan 01 '19 *[ by user ]
   * question - asked Jan 01 '19 at 18:00
   * answer - answered Jan 01 '19 at 18:00
   * generic - *[ user ] Jan 01 '19 at 18:00
   */
  const unixDateConverted = new Date(dateAsUnix * 1000);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let prefix = "";
  let suffix = "";

  if (["search", "question"].includes(type)) {
    prefix = `${i18n.text.asked} `;
  } else if (type === "answer") {
    prefix = `${i18n.text.answered} `;
  }

  let year = `'${unixDateConverted.getFullYear().toString().substring(2, 4)}`;
  let month = unixDateConverted.getUTCMonth();
  let day = unixDateConverted.getUTCDate();
  day < 10 && (day = `0${day}`);

  if (type !== "generic") {
    const uctMinutes = unixDateConverted.getUTCMinutes();
    const minutes = uctMinutes < 10 ? `0${uctMinutes}` : uctMinutes;
    suffix = ` ${i18n.text.at} ${unixDateConverted.getUTCHours()}:${minutes}`;
  }

  return `${prefix}${monthNames[month]} ${day} ${year}${suffix}`;

}

function timeAgo(date, i18n) {
  const SECOND = 1000;
  const MINUTE = 60 * SECOND;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const MONTH = 30 * DAY;
  const YEAR = 365 * DAY;
  
  const nowDate = new Date(Date.now());

  const now = typeof nowDate === 'object' ? nowDate.getTime() : new Date(nowDate).getTime();
  const diff = now - (typeof date === 'object' ? date : new Date(date * 1000)).getTime();
  const diffInDays = Math.round(Math.abs(diff) / DAY);
  const diffInMonths = Math.round(Math.abs(diff) / MONTH);
  const diffInYears = Math.round(Math.abs(diff) / YEAR);
  let timeAgoFormatted;

  if (diffInYears > 1) {
    const months = Math.floor(diffInMonths / 12);
    switch (months) {
      case 0:
        timeAgoFormatted = `${diffInYears} ${i18n.text.years_ago}`
        break;
      case 1:
        timeAgoFormatted = `${diffInYears} ${i18n.text.years} ${months} ${i18n.text.month_ago}`
        break;
      default: timeAgoFormatted = `${diffInYears} ${i18n.text.years} ${months} ${i18n.text.months_ago}`
        break;
    }
  } 
  else if (diffInMonths < 12 && diffInMonths > 1) {
    timeAgoFormatted = `${diffInMonths} ${i18n.text.months_ago}`
  } 
  else if (diffInMonths === 1) {
    timeAgoFormatted = `${diffInMonths} ${i18n.text.month_ago}`
  } 
  else if (diffInDays < 30 && diffInDays > 1) {
    timeAgoFormatted = `${diffInDays} ${i18n.text.days_ago}`
  } 
  else if (diffInDays === 1) {
    timeAgoFormatted = `${i18n.text.yesterday}`
  } 
  else {
    timeAgoFormatted = `${i18n.text.today}`
  }

  return timeAgoFormatted;
}

export { formatDate, timeAgo };