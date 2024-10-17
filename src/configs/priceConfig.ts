const billsAdjustment = 150;

const maxStudioPrice = 1000;
const maxEnSuitePriceWithBills = 650;
const maxRoomPriceWithBills = 550;

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