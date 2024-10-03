
import {AttributeSelector, ValueCheckerRequirement} from "../../types/configTypes";
import {findFirstNumber} from "../../testing/firstPageTest";
import timeConfig, {check_date_against_config_formatted} from "../timeConfig";

export class RightMoveMethods {
	// availability is not listed on rightMove
	private static typeSelector : AttributeSelector = {
		isCustomSelector: true,
		customSelector: ".property-information :nth-child(1)"
	};

	private static descriptionSelector : AttributeSelector = {
		isCustomSelector: true,
		customSelector: "a.propertyCard-link span span"
	};
	public static isNotAParkingSpace : ValueCheckerRequirement<boolean> = {
		name : "Omit parking ads",
		selector: RightMoveMethods.typeSelector,
		valueTest: (input) => {
			const loweredInput = input.toLowerCase();
			return 	!loweredInput.includes("parking") &&
					!loweredInput.includes("garages") &&
					!loweredInput.includes("not specified");
		}
	};
	public static priceLowerThan = (limit : number) : ValueCheckerRequirement<boolean> => {
		return {
			name: `Must no more than £${limit}.`,
			selector: {
				isCustomSelector: false,
				attributeName: "class",
				expectedValue: "propertyCard-priceValue",
				exactMatch: true
			},
			valueTest: (input) => {
				return findFirstNumber(input) <= limit;
			}
		};
	};
	public static includesBills : ValueCheckerRequirement<boolean> = {
		name: "Must include bills.",
		selector: RightMoveMethods.descriptionSelector,
		valueTest: (input) => {
			return input.toLowerCase() === "bills included";
		}
	};

	public static enSuite : ValueCheckerRequirement<boolean> = {
		name: "Room must be en-suite",
		selector: RightMoveMethods.descriptionSelector,
		valueTest: (input) => {
			return input.toLowerCase().includes("ensuite")
                || input.toLowerCase().includes("en-suite");
		}
	};
	public static isNotAHouseShare : ValueCheckerRequirement<boolean> = {
		name: "Must not be a house share",
		selector: RightMoveMethods.typeSelector,
		valueTest: (input) => {
			const loweredInput = input.toLowerCase();
			return !loweredInput.includes("share");
		}
	};
	public static getIsNBedApartment = (numberOfBedrooms : number) : ValueCheckerRequirement<boolean> => {
		return {
			name: `Must be a ${numberOfBedrooms} bed apartment.`,
			selector: {
				isCustomSelector: true,
				customSelector: "div.property-information :nth-child(3)"
			},
			valueTest: (input) => {
				return findFirstNumber(input) === numberOfBedrooms;
			}
		};
	};

	public static isStudio : ValueCheckerRequirement<boolean> = {
		name: "Must be a studio.",
		selector: RightMoveMethods.typeSelector,
		valueTest: (input) => {
			const inputLowered = input.toLowerCase();
			return inputLowered.includes("studio");
		}
	};

	/* deep methods */

	public static mustBeAvailableWithin : ValueCheckerRequirement<number> = {
		name: `Must be available ${timeConfig.formatted_string}`,
		selector: {
			isCustomSelector: true,
			customSelector: "div._2RnXSVJcWbWv4IpBC1Sng6:nth-child(1) > dd:nth-child(2)"
		},
		valueTest: (input) => {
			console.log(input);
			let date_ok;
			if (input.includes("Now")) {
				date_ok = timeConfig.available_now_accept;
			} else if (input.includes("Ask agent")) {
				return -Infinity;
			} else {
				date_ok = check_date_against_config_formatted(input);
			}
			if (date_ok) {return 0;} else {return -Infinity;}
		}
	};
}

export default RightMoveMethods;
