import {AttributeSelector, ValueCheckerRequirement} from "../../types/configTypes";
import {findFirstNumber} from "../../testing/firstPageTest";
import timeConfig, {check_date_against_config} from "../timeConfig";

export class GumtreeMethods {

	private static titleSelector : AttributeSelector = {
		isCustomSelector: false,
		attributeName: "data-q",
		expectedValue: "tile-title",
		exactMatch: true
	};

	public static availabilityRequirement: ValueCheckerRequirement<boolean> = {
		name: `Availability date must be between ${timeConfig.formatted_string}`,
		selector: {
			isCustomSelector: true,
			customSelector: "[data-q=\"tile-description\"] > div:nth-child(1) > span:nth-child(2)"
		},
		valueTest: (input : string) => {
			const wordSplit = input.split(" ");
			if (wordSplit.length === 5) {
				const day = Number(wordSplit[2]);
				const month = wordSplit[3];
				return check_date_against_config(day, month);
			}
			return timeConfig.available_now_accept;
		}
	};
	public static getPriceLowerThanArgumentReq = (price: number): ValueCheckerRequirement<boolean> => {
		return {
			name: `Must be no more than ${price}.`,
			selector: {
				isCustomSelector: false,
				attributeName: "data-testid",
				expectedValue: "price",
				exactMatch: true
			}
			,
			valueTest: (input) => {
				let adjustPerWeek = true;
				if(input.includes("pm")) {
					adjustPerWeek = false;
				}
				return (findFirstNumber(input) * (adjustPerWeek? 4.3 : 1)) <= price;
			}
		};
	};
	public static getIsNBedApartment = (numberOfBedrooms : number) : ValueCheckerRequirement<boolean> => {
		return {
			name: `Must be a ${numberOfBedrooms} bed apartment.`,
			selector: GumtreeMethods.titleSelector,
			valueTest: (input) => {
				const inputLowered = input.toLowerCase();
				if (inputLowered.includes("flat") || inputLowered.includes("apartment")) {
					return findFirstNumber(inputLowered, true) === numberOfBedrooms;
				}
				return false;
			}
		};
	};

	public static isStudio : ValueCheckerRequirement<boolean> = {
		name: "Must be a studio flat.",
		selector: GumtreeMethods.titleSelector,
		valueTest: (input) => {
			const inputLowered = input.toLowerCase();
			if (inputLowered.includes("flat") || inputLowered.includes("apartment")) {
				if (findFirstNumber(inputLowered, true) === 1) {
					return true;
				}
			}
			return inputLowered.includes("studio");
		}
	};

	public static includesBills : ValueCheckerRequirement<boolean> = {
		name: "Must include bills.",
		selector: GumtreeMethods.titleSelector,
		valueTest: (input) => {
			return input.toLowerCase().includes("bills")
				|| input.toLowerCase().includes("inc") ;
		}
	};
	public static isEnSuite : ValueCheckerRequirement<boolean> = {
		name: "Room is en-suite",
		selector: GumtreeMethods.titleSelector,
		valueTest: (input) => {
			return input.toLowerCase().includes("ensuite")
                || input.toLowerCase().includes("en-suite");
		}
	};
}
