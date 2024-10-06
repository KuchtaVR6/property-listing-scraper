export interface DateConfig {
    availableNowAccept: boolean;
    startDate: { day: number; month: string };
    endDate: { day: number; month: string };
    startStamp: number;
    endStamp: number;
    formattedString: string;
}

export const getTimestamp = (day: number, month: string, year? : number): number => {
	const year_final : number = year ? year : new Date().getFullYear();

	const dateStr = `${day} ${month} ${year_final}`;
	const date = new Date(dateStr);

	if (isNaN(date.getTime())) {
		throw new Error("Invalid date format");
	}

	return date.getTime();
};

export const isDateWithinConfigRange = (consideredTimestamp: number, config: DateConfig): boolean => {
	return consideredTimestamp < config.endStamp && (
		config.availableNowAccept || consideredTimestamp > config.startStamp
	);
};

export const isDateStringWithinConfigRange = (dateString: string, config: DateConfig): boolean => {
	const consideredTimestamp = new Date(dateString.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1")).getTime();
	return isDateWithinConfigRange(consideredTimestamp, config);
};