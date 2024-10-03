const billsAdjustment = 150;

const maxStudioPrice = 900;
const maxEnSuitePriceWithBills = 600;
const maxRoomPriceWithBills = 500;

const multiRoomHustleMultiplier = 150;


const priceConfig = {

	studioPriceWithBills: maxStudioPrice,
	studioPriceWithoutBills: maxStudioPrice - billsAdjustment,

	enSuiteWithBills: maxEnSuitePriceWithBills,
	enSuiteWithoutBills: maxEnSuitePriceWithBills - billsAdjustment,

	roomWithBills: maxRoomPriceWithBills,
	roomWithoutBills: maxRoomPriceWithBills - billsAdjustment,

	twoBedFlat: (maxEnSuitePriceWithBills - billsAdjustment) + 2 * multiRoomHustleMultiplier,
	threeBedFlat: (maxEnSuitePriceWithBills - billsAdjustment) + 3 * multiRoomHustleMultiplier
};

export const absolute_max = maxStudioPrice + 3 * multiRoomHustleMultiplier;

export default priceConfig;