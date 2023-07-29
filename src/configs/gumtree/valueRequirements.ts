import {AttributeSelector, ValueCheckerRequirement} from "../../types/configTypes";
import {findFirstNumber} from "../../testing/firstPageTest";

export class GumtreeMethods {

	private static titleSelector : AttributeSelector = {
		isCustomSelector: true,
		customSelector: "h2.listing-title"
	};

	public static availabilityRequirement: ValueCheckerRequirement = {
		name: "Availability date must be between 25 Aug and 13 Sep",
		selector: {
			isCustomSelector: true,
			customSelector: ".listing-attributes > li:nth-child(1) > span:nth-child(2)"
		},
		booleanTest: (input) => {
			const wordSplit = input.split(" ");
			if (wordSplit.length === 5) {
				const day = Number(wordSplit[2]);
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
	public static getPriceLowerThanArgumentReq = (price: number): ValueCheckerRequirement => {
		return {
			name: `Must be no more than ${price}.`,
			selector: {
				isCustomSelector: true,
				customSelector: ".listing-price > strong:nth-child(1)",
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
