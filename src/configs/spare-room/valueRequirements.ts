import {AttributeSelector, mustNotBePresentRequirement, ValueCheckerRequirement} from "../../types/configTypes";
import {findFirstNumber} from "../../testing/firstPageTest";

export class SpareRoomMethods {

	private static titleSelector : AttributeSelector = {
		isCustomSelector: true,
		customSelector: "h2"
	};

	public static monFriSelector : mustNotBePresentRequirement = {
		name: "Is not Monday to Friday let",
		isCustomSelector: false,
		attributeName: "class",
		exactMatch: true,
		expectedValue: "mon-fri",
	};

	public static availabilityRequirement: ValueCheckerRequirement = {
		name: "Availability date must be between 25 Aug and 13 Sep",
		selector: {
			isCustomSelector: true,
			customSelector: ".advertDescription strong"
		},
		booleanTest: (input) => {
			const wordSplit = input.split(" ");
			if (wordSplit[0] === "Available" && wordSplit.length === 3) {
				const day = Number(wordSplit[1]);
				const month = wordSplit[2];
				if (month === "Aug") {
					return day >= 25;
				} else if (month === "Sep") {
					return day <= 13;
				}
			}
			return false;
		}
	};
	public static getPriceLowerThanArgumentReq = (price: number, adjustPerWeek : boolean): ValueCheckerRequirement => {
		return {
			name: `Must be no more than ${price}.`,
			selector: {
				isCustomSelector: false,
				attributeName: "class",
				expectedValue: "listingPrice",
				exactMatch: true
			}
			,
			booleanTest: (input) => {
				return (findFirstNumber(input) * (adjustPerWeek? 4.3 : 1)) <= price;
			}
		};
	};
	public static includesBills : ValueCheckerRequirement = {
		name: "Must include bills.",
		selector: {
			isCustomSelector: false,
			attributeName: "class",
			expectedValue: "listingPriceDetails",
			exactMatch: true
		},
		booleanTest: (input) => {
			return input.toLowerCase() === "bills inc.";
		}
	};
	public static priceMeasuredMonthly : ValueCheckerRequirement = {
		name: "Price is measured monthly.",
		selector: {
			isCustomSelector: true,
			customSelector: ".listingPrice abbr"
		},
		booleanTest: (input) => {
			return input === "pcm";
		}
	};
	public static priceMeasuredWeekly : ValueCheckerRequirement = {
		name: "Price is measured weekly.",
		selector: {
			isCustomSelector: true,
			customSelector: ".listingPrice abbr"
		},
		booleanTest: (input) => {
			return input === "pw";
		}
	};
	public static getIsNBedApartment = (numberOfBedrooms : number) : ValueCheckerRequirement => {
		return {
			name: `Must be a ${numberOfBedrooms} bed apartment.`,
			selector: {
				isCustomSelector: false,
				attributeName: "class",
				expectedValue: "shortDescription",
				exactMatch: true
			},
			booleanTest: (input) => {
				const inputLowered = input.toLowerCase();
				if (inputLowered.includes("flat")) {
					return findFirstNumber(inputLowered) === numberOfBedrooms;
				}
				return false;
			}
		};
	};
	public static isEnSuite : ValueCheckerRequirement = {
		name: "Room is en-suite",
		selector: SpareRoomMethods.titleSelector,
		booleanTest: (input) => {
			return input.toLowerCase().includes("ensuite")
                || input.toLowerCase().includes("en-suite");
		}
	};
}
