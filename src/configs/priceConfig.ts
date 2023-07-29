const billsAdjustment = 150;

const maxStudioPrice = 800;
const maxEnSuitePriceWithBills = 700;
const maxRoomPriceWithBills = 600;


const priceConfig = {

	studioPriceWithBills: maxStudioPrice,
	studioPriceWithoutBills: maxStudioPrice - billsAdjustment,

	enSuiteWithBills: maxEnSuitePriceWithBills,
	enSuiteWithoutBills: maxEnSuitePriceWithBills - billsAdjustment,

	roomWithBills: maxRoomPriceWithBills,
	roomWithoutBills: maxRoomPriceWithBills - billsAdjustment,

	twoBedFlat: (maxEnSuitePriceWithBills - billsAdjustment) * 0,
	threeBedFlat: (maxEnSuitePriceWithBills - billsAdjustment) * 0
};

export default priceConfig;