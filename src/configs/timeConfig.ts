const available_now_accept = false;

const date_start = {
	day: 20,
	month: "Oct"
};

const date_end = {
	day: 5,
	month: "Nov"
};

/* Methods */

const getTimestamp = (day: number, month: string): number => {
	const currentYear = new Date().getFullYear();
	const fullDateStr = `${day} ${month} ${currentYear}`;
	const date = new Date(fullDateStr);

	if (isNaN(date.getTime())) {
		throw new Error("Invalid date format");
	}

	return date.getTime(); // Returns the timestamp in milliseconds
};

export const check_date_against_config = (day: number, month: string): boolean => {
	const considered_timestamp = getTimestamp(day, month);
	if (considered_timestamp < all_dates_config.end_stamp) {
		if (available_now_accept) {
			return true;
		}
		else {
			return considered_timestamp > all_dates_config.start_stamp;
		}
	}
	return false;
};

export const check_date_against_config_formatted = (date_string : string): boolean => {
	// Convert the date_string into a standardized 'YYYY-MM-DD' format
	const considered_timestamp = (new Date(date_string.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1"))).getTime();
	if (considered_timestamp < all_dates_config.end_stamp) {
		if (available_now_accept) {
			return true;
		}
		else {
			return considered_timestamp > all_dates_config.start_stamp;
		}
	}
	return false;
};

const all_dates_config = {
	available_now_accept: available_now_accept,
	date_start: date_start,
	start_stamp: getTimestamp(date_start.day, date_start.month),
	date_end: date_end,
	end_stamp: getTimestamp(date_end.day, date_end.month),
	formatted_string: `${date_start.day} ${date_start.month} and ${date_end.day} ${date_end.month} 
    ${available_now_accept ? "or immediately" : ""}`
};

export default all_dates_config;
