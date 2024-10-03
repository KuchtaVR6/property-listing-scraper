import {ValueCheckerRequirement} from "../../types/configTypes";
import {findFirstNumber} from "../../testing/firstPageTest";
import timeConfig, {check_date_against_config} from "../timeConfig";

export class ZooplaMethods {
	public static availabilityRequirement : ValueCheckerRequirement = {
		name : `Availability date must be between ${timeConfig.formatted_string}`,
		selector: {
			attributeName: "class",
			expectedValue: "jlg7241",
			isCustomSelector: false,
			exactMatch: true
		},
		booleanTest: (input) => {
			const wordSplit = input.split(" ");
			if(wordSplit[0]==="Available" && wordSplit.length === 5) {
				const day = Number(wordSplit[2].slice(0,-2));
				const month = wordSplit[3];
				return check_date_against_config(day, month);
			}
			return timeConfig.available_now_accept;
		}
	};
	public static isNotAParkingSpace : ValueCheckerRequirement = {
		name : "Omit parking ads",
		selector: {
			attributeName: "data-testid",
			expectedValue: "listing-title",
			isCustomSelector: false,
			exactMatch: true
		},
		booleanTest: (input) => {
			return !input.toLowerCase().includes("parking");
		}
	};
	public static priceLowerThan = (limit : number) : ValueCheckerRequirement => {
		return {
			name: `Must no more than £${limit}.`,
			selector: {
				isCustomSelector: false,
				attributeName: "data-testid",
				expectedValue: "listing-price",
				exactMatch: true
			},
			booleanTest: (input) => {
				return findFirstNumber(input) <= limit;
			}
		};
	};
	public static includesBills : ValueCheckerRequirement = {
		name: "Must include bills.",
		selector: {
			isCustomSelector: false,
			attributeName: "class",
			expectedValue: "_1p8nftv0",
			exactMatch: false
		},
		booleanTest: (input) => {
			return input.toLowerCase() === "bills included";
		}
	};

	public static enSuite : ValueCheckerRequirement = {
		name: "Room must be en-suite",
		selector: {
			isCustomSelector: false,
			attributeName: "class",
			expectedValue: "_1vvnr3j3",
			exactMatch: false
		},
		booleanTest: (input) => {
			return input.toLowerCase().includes("ensuite")
				|| input.toLowerCase().includes("en-suite");
		}
	};

	public static getIsNBedApartment = (numberOfBedrooms : number) : ValueCheckerRequirement => {
		return {
			name: `Must be a ${numberOfBedrooms} bed apartment.`,
			selector: {
				isCustomSelector: false,
				attributeName: "data-testid",
				expectedValue: "listing-title",
				exactMatch: true
			},
			booleanTest: (input) => {
				const inputLowered = input.toLowerCase();
				if (inputLowered.includes("flat")) {
					return findFirstNumber(inputLowered, true) === numberOfBedrooms;
				}
				return false;
			}
		};
	};

	public static isStudio : ValueCheckerRequirement = {
		name: "Must be a studio.",
		selector: {
			isCustomSelector: false,
			attributeName: "data-testid",
			expectedValue: "listing-title",
			exactMatch: true
		},
		booleanTest: (input) => {
			const inputLowered = input.toLowerCase();
			if (inputLowered.includes("flat")) {
				return findFirstNumber(inputLowered) === 1;
			}
			return inputLowered.includes("studio");
		}
	};
}
