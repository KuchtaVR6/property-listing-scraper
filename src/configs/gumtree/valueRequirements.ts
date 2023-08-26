import {AttributeSelector, ValueCheckerRequirement} from "../../types/configTypes";
import {findFirstNumber} from "../../testing/firstPageTest";

export class GumtreeMethods {

	private static titleSelector : AttributeSelector = {
		isCustomSelector: false,
		attributeName: "data-q",
		expectedValue: "tile-title",
		exactMatch: true
	};

	public static availabilityRequirement: ValueCheckerRequirement = {
		name: "Availability date must be between 25 Aug and 13 Sep or immediately",
		selector: {
			isCustomSelector: true,
			customSelector: "[data-q=\"tile-description\"] > div:nth-child(1) > span:nth-child(2)"
		},
		booleanTest: (input) => {
			const wordSplit = input.split(" ");
			if (wordSplit.length === 5) {
				const day = Number(wordSplit[2]);
				const month = wordSplit[3];
				if (month === "Sep") {
					return day <= 13;
				}
				return !(["Oct", "Nov", "Dec"].includes(month));
			}
			return true;
		}
	};
	public static getPriceLowerThanArgumentReq = (price: number): ValueCheckerRequirement => {
		return {
			name: `Must be no more than ${price}.`,
			selector: {
				isCustomSelector: false,
				attributeName: "data-testid",
				expectedValue: "price",
				exactMatch: true
			}
			,
			booleanTest: (input) => {
				let adjustPerWeek = true;
				if(input.includes("pm")) {
					adjustPerWeek = false;
				}
				return (findFirstNumber(input) * (adjustPerWeek? 4.3 : 1)) <= price;
			}
		};
	};
	public static getIsNBedApartment = (numberOfBedrooms : number) : ValueCheckerRequirement => {
		return {
			name: `Must be a ${numberOfBedrooms} bed apartment.`,
			selector: GumtreeMethods.titleSelector,
			booleanTest: (input) => {
				const inputLowered = input.toLowerCase();
				if (inputLowered.includes("flat") || inputLowered.includes("apartment")) {
					return findFirstNumber(inputLowered, true) === numberOfBedrooms;
				}
				return false;
			}
		};
	};

	public static isStudio : ValueCheckerRequirement = {
		name: "Must be a studio flat.",
		selector: GumtreeMethods.titleSelector,
		booleanTest: (input) => {
			const inputLowered = input.toLowerCase();
			if (inputLowered.includes("flat") || inputLowered.includes("apartment")) {
				if (findFirstNumber(inputLowered, true) === 1) {
					return true;
				}
			}
			return inputLowered.includes("studio");
		}
	};

	public static includesBills : ValueCheckerRequirement = {
		name: "Must include bills.",
		selector: GumtreeMethods.titleSelector,
		booleanTest: (input) => {
			return input.toLowerCase().includes("bills")
				|| input.toLowerCase().includes("inc") ;
		}
	};
	public static isEnSuite : ValueCheckerRequirement = {
		name: "Room is en-suite",
		selector: GumtreeMethods.titleSelector,
		booleanTest: (input) => {
			return input.toLowerCase().includes("ensuite")
                || input.toLowerCase().includes("en-suite");
		}
	};
}
