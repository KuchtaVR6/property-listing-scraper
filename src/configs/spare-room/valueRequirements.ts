import {AttributeSelector, MustNotBePresentRequirement, ValueCheckerRequirement} from "../../types/configTypes";
import {findFirstNumber} from "../../testing/firstPageTest";
import timeConfig, {checkDateAgainstConfig} from "../timeConfig";

export class SpareRoomMethods {

	/* Selectors */

	private static titleSelector : AttributeSelector = {
		isCustomSelector: true,
		customSelector: "h2"
	};

	/* Omit Listings */

	public static monFriSelector : MustNotBePresentRequirement = {
		name: "Is not Monday to Friday let",
		isCustomSelector: false,
		attributeName: "class",
		exactMatch: true,
		expectedValue: "mon-fri",
	};



	public static availabilityRequirement: ValueCheckerRequirement<boolean> = {
		name: `Availability date must be between ${timeConfig.formattedString}`,
		selector: {
			isCustomSelector: true,
			customSelector: ".advertDescription strong"
		},
		valueTest: (input) => {
			const wordSplit = input.split(" ");
			if (wordSplit[0] === "Available" && wordSplit.length === 3) {
				const day = Number(wordSplit[1]);
				const month = wordSplit[2];
				return checkDateAgainstConfig(day, month);
			}
			return timeConfig.availableNowAccept;
		}
	};
	public static getPriceLowerThanArgumentReq = (price: number, adjustPerWeek : boolean): ValueCheckerRequirement<boolean> => {
		return {
			name: `Must be no more than ${price}.`,
			selector: {
				isCustomSelector: false,
				attributeName: "class",
				expectedValue: "listingPrice",
				exactMatch: true
			}
			,
			valueTest: (input) => {
				return (findFirstNumber(input) * (adjustPerWeek? 4.3 : 1)) <= price;
			}
		};
	};
	public static includesBills : ValueCheckerRequirement<boolean> = {
		name: "Must include bills.",
		selector: {
			isCustomSelector: false,
			attributeName: "class",
			expectedValue: "listingPriceDetails",
			exactMatch: true
		},
		valueTest: (input) => {
			return input.toLowerCase() === "bills inc.";
		}
	};
	public static priceMeasuredMonthly : ValueCheckerRequirement<boolean> = {
		name: "Price is measured monthly.",
		selector: {
			isCustomSelector: true,
			customSelector: ".listingPrice abbr"
		},
		valueTest: (input) => {
			return input.replace(" ", "") === "pcm";
		}
	};
	public static priceMeasuredWeekly : ValueCheckerRequirement<boolean> = {
		name: "Price is measured weekly.",
		selector: {
			isCustomSelector: true,
			customSelector: ".listingPrice abbr"
		},
		valueTest: (input) => {
			return input.replace(" ", "") === "pw";
		}
	};
	public static getIsNBedApartment = (numberOfBedrooms : number) : ValueCheckerRequirement<boolean> => {
		return {
			name: `Must be a ${numberOfBedrooms} bed apartment.`,
			selector: {
				isCustomSelector: false,
				attributeName: "class",
				expectedValue: "shortDescription",
				exactMatch: true
			},
			valueTest: (input) => {
				const inputLowered = input.toLowerCase();
				if (inputLowered.includes("flat")) {
					return findFirstNumber(inputLowered, true) === numberOfBedrooms;
				}
				return false;
			}
		};
	};
	public static isEnSuite : ValueCheckerRequirement<boolean> = {
		name: "Room is en-suite",
		selector: SpareRoomMethods.titleSelector,
		valueTest: (input) => {
			return input.toLowerCase().includes("ensuite")
                || input.toLowerCase().includes("en-suite");
		}
	};

	/* Deep Methods */
}
