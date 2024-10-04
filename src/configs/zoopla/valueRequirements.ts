import {AttributeSelector, ValueCheckerRequirement} from "../../types/configTypes";
import {findFirstNumber} from "../../testing/firstPageTest";
import timeConfig, {checkDateAgainstConfig} from "../timeConfig";

export class ZooplaMethods {

	private static listingDescriptionAndFeaturesSelector : AttributeSelector = {
		isCustomSelector: false,
		attributeName: "aria-labelledby",
		expectedValue: "listing-features-heading",
		exactMatch: true
	};

	public static availabilityRequirement : ValueCheckerRequirement<boolean> = {
		name : `Availability date must be between ${timeConfig.formattedString}`,
		selector: {
			attributeName: "class",
			expectedValue: "jlg7241",
			isCustomSelector: false,
			exactMatch: true
		},
		valueTest: (input: string) => {
			const wordSplit = input.split(" ");
			if(wordSplit[0]==="Available" && wordSplit.length === 5) {
				const day = Number(wordSplit[2].slice(0,-2));
				const month = wordSplit[3];
				return checkDateAgainstConfig(day, month);
			}
			return timeConfig.availableNowAccept;
		}
	};
	public static isNotAParkingSpace : ValueCheckerRequirement<boolean> = {
		name : "Omit parking ads",
		selector: {
			attributeName: "data-testid",
			expectedValue: "listing-title",
			isCustomSelector: false,
			exactMatch: true
		},
		valueTest: (input: string) => {
			return !input.toLowerCase().includes("parking");
		}
	};
	public static priceLowerThan = (limit : number) : ValueCheckerRequirement<boolean> => {
		return {
			name: `Must no more than £${limit}.`,
			selector: {
				isCustomSelector: false,
				attributeName: "data-testid",
				expectedValue: "listing-price",
				exactMatch: true
			},
			valueTest: (input: string) => {
				return findFirstNumber(input) <= limit;
			}
		};
	};

	public static enSuite : ValueCheckerRequirement<boolean> = {
		name: "Room must be en-suite",
		selector: {
			isCustomSelector: false,
			attributeName: "class",
			expectedValue: "_1vvnr3j3",
			exactMatch: false
		},
		valueTest: (input: string) => {
			return input.toLowerCase().includes("ensuite")
				|| input.toLowerCase().includes("en-suite");
		}
	};

	public static getIsNBedApartment = (numberOfBedrooms : number) : ValueCheckerRequirement<boolean> => {
		return {
			name: `Must be a ${numberOfBedrooms} bed apartment.`,
			selector: {
				isCustomSelector: false,
				attributeName: "data-testid",
				expectedValue: "listing-title",
				exactMatch: true
			},
			valueTest: (input: string) => {
				const inputLowered = input.toLowerCase();
				if (inputLowered.includes("flat")) {
					return findFirstNumber(inputLowered, true) === numberOfBedrooms;
				}
				return false;
			}
		};
	};

	public static isStudio : ValueCheckerRequirement<boolean> = {
		name: "Must be a studio.",
		selector: {
			isCustomSelector: false,
			attributeName: "data-testid",
			expectedValue: "listing-title",
			exactMatch: true
		},
		valueTest: (input: string) => {
			const inputLowered = input.toLowerCase();
			if (inputLowered.includes("flat")) {
				return findFirstNumber(inputLowered) === 1;
			}
			return inputLowered.includes("studio");
		}
	};

	/* deep methods */

	public static mustIncludeBills : ValueCheckerRequirement<number> = {
		name: "Must include bills.",
		selector: ZooplaMethods.listingDescriptionAndFeaturesSelector,
		valueTest: (input) => {
			if (input.toLowerCase().includes("inc") && input.toLowerCase().includes("bills")) {
				return 0;
			} else {
				return -Infinity;
			}
		}
	};
}
