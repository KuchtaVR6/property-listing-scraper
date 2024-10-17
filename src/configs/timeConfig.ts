import {getTimestamp, isDateWithinConfigRange, DateConfig, isDateStringWithinConfigRange} from "./dateUtils";

const availableNowAccept = false;

const startDate = { day: 18, month: "Oct" };
const endDate = { day: 4, month: "Nov" };

const config: DateConfig = {
	availableNowAccept,
	startDate,
	endDate,
	startStamp: getTimestamp(startDate.day, startDate.month),
	endStamp: getTimestamp(endDate.day, endDate.month),
	formattedString: `${startDate.day} ${startDate.month} and ${endDate.day} ${endDate.month} ${availableNowAccept ? "or immediately" : ""}`,
};

export const checkDateAgainstConfig = (day: number, month: string, year? : number): boolean => {
	const consideredTimestamp = getTimestamp(day, month, year);
	return isDateWithinConfigRange(consideredTimestamp, config);
};

export const checkDateAgainstConfigFormatted = (dateString: string): boolean => {
	return isDateStringWithinConfigRange(dateString, config);
};

export default config;