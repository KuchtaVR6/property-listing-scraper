const billsAdjustment = 150;

const maxStudioPrice = 900;
const maxEnSuitePriceWithBills = 700;
const maxRoomPriceWithBills = 600;

const multiRoomHustleMultiplier = 0.8;


const priceConfig = {

	studioPriceWithBills: maxStudioPrice,
	studioPriceWithoutBills: maxStudioPrice - billsAdjustment,

	enSuiteWithBills: maxEnSuitePriceWithBills,
	enSuiteWithoutBills: maxEnSuitePriceWithBills - billsAdjustment,

	roomWithBills: maxRoomPriceWithBills,
	roomWithoutBills: maxRoomPriceWithBills - billsAdjustment,

	twoBedFlat: (maxEnSuitePriceWithBills - billsAdjustment) * 2 * multiRoomHustleMultiplier,
	threeBedFlat: (maxEnSuitePriceWithBills - billsAdjustment) * 2 * multiRoomHustleMultiplier
};

export default priceConfig;