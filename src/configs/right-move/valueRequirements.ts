
import {AttributeSelector, ValueCheckerRequirement} from "../../types/configTypes";
import {findFirstNumber} from "../../testing/firstPageTest";
import timeConfig, {checkDateAgainstConfigFormatted} from "../timeConfig";

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

	private static listingDescriptionSelector : AttributeSelector = {
		isCustomSelector: true,
		customSelector: ".STw8udCxUaBUMfOOZu0iL"
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
		name: `Must be available ${timeConfig.formattedString}`,
		selector: {
			isCustomSelector: true,
			customSelector: "div._2RnXSVJcWbWv4IpBC1Sng6:nth-child(1) > dd:nth-child(2)"
		},
		valueTest: (input) => {
			let date_ok;
			if (input.includes("Now")) {
				date_ok = timeConfig.availableNowAccept;
			} else if (input.includes("Ask agent")) {
				return -Infinity;
			} else {
				date_ok = checkDateAgainstConfigFormatted(input);
			}
			if (date_ok) {return 0;} else {return -Infinity;}
		}
	};

	public static mustIncludeBills : ValueCheckerRequirement<number> = {
		name: "Must include the Bills.",
		selector: RightMoveMethods.listingDescriptionSelector,
		valueTest: (input) => {
			if (input.toLowerCase().includes("inc") && input.toLowerCase().includes("bills")) {
				return 0;
			} else {
				return -Infinity;
			}
		}
	};

	public static termLookup = (terms: { term: string; value: number }[], initialScore: number):
		ValueCheckerRequirement<number> => {
		return {
			name: `Check for terms and assign values, terms considered: ${
				terms.map(entry => `${entry.term}(${entry.value})`).join(";")}`,
			selector: RightMoveMethods.listingDescriptionSelector,
			valueTest: (input: string) => {
				let score = initialScore;
				input = input.toLowerCase();
				for (const { term, value } of terms) {
					if (input.includes(term.toLowerCase())) {
						score += value;
					}
				}
				return score;
			},
		};
	};
}

export default RightMoveMethods;
