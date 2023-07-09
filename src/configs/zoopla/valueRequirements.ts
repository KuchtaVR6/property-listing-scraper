import {ValueCheckerRequirement} from "../../types/configTypes";
import {findFirstNumber} from "../../testing/firstPageTest";

export class ZooplaMethods {
	public static availabilityRequirement : ValueCheckerRequirement = {
		name : "Availability date must be between 25 Aug and 13 Sep",
		selector: {
			attributeName: "class",
			expectedValue: "_18cib8e1",
			isCustomSelector: false,
			exactMatch: true
		},
		booleanTest: (input) => {
			const wordSplit = input.split(" ");
			if(wordSplit[0]==="Available" && wordSplit.length === 5) {
				const day = Number(wordSplit[2].slice(0,-2));
				const month = wordSplit[3];
				if (month === "Aug") {
					return day >= 25;
				} else if (month === "Sep") {
					return day <= 13;
				}
			}
			return false;
		}
	};
	public static parkingNotAllowedRequirement : ValueCheckerRequirement = {
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
	public static priceLowerThan500 : ValueCheckerRequirement = {
		name: "Must no more than £500.",
		selector: {
			isCustomSelector: false,
			attributeName: "data-testid",
			expectedValue: "listing-price",
			exactMatch: true
		},
		booleanTest: (input) => {
			return findFirstNumber(input) <= 500;
		}
	};
	public static priceLowerThan650 : ValueCheckerRequirement = {
		name: "Must no more than £650.",
		selector: {
			isCustomSelector: false,
			attributeName: "data-testid",
			expectedValue: "listing-price",
			exactMatch: true
		},
		booleanTest: (input) => {
			return findFirstNumber(input) <= 650;
		}
	};
	public static includesBills : ValueCheckerRequirement = {
		name: "Must include bills.",
		selector: {
			isCustomSelector: false,
			attributeName: "class",
			expectedValue: "_1ljm00u0",
			exactMatch: false
		},
		booleanTest: (input) => {
			return input.toLowerCase() === "bills included";
		}
	};
}