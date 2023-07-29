
import {AttributeSelector, ValueCheckerRequirement} from "../../types/configTypes";
import {findFirstNumber} from "../../testing/firstPageTest";

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
	public static isNotAParkingSpace : ValueCheckerRequirement = {
		name : "Omit parking ads",
		selector: RightMoveMethods.typeSelector,
		booleanTest: (input) => {
			const loweredInput = input.toLowerCase();
			return !loweredInput.includes("parking") && !loweredInput.includes("garages");
		}
	};
	public static priceLowerThan = (limit : number) : ValueCheckerRequirement => {
		return {
			name: `Must no more than £${limit}.`,
			selector: {
				isCustomSelector: false,
				attributeName: "class",
				expectedValue: "propertyCard-priceValue",
				exactMatch: true
			},
			booleanTest: (input) => {
				return findFirstNumber(input) <= limit;
			}
		};
	};
	public static includesBills : ValueCheckerRequirement = {
		name: "Must include bills.",
		selector: RightMoveMethods.descriptionSelector,
		booleanTest: (input) => {
			return input.toLowerCase() === "bills included";
		}
	};

	public static enSuite : ValueCheckerRequirement = {
		name: "Room must be en-suite",
		selector: RightMoveMethods.descriptionSelector,
		booleanTest: (input) => {
			return input.toLowerCase().includes("ensuite")
                || input.toLowerCase().includes("en-suite");
		}
	};
	public static isNotAHouseShare : ValueCheckerRequirement = {
		name: "Must not be a house share",
		selector: RightMoveMethods.typeSelector,
		booleanTest: (input) => {
			const loweredInput = input.toLowerCase();
			return !loweredInput.includes("share");
		}
	};
	public static getIsNBedApartment = (numberOfBedrooms : number) : ValueCheckerRequirement => {
		return {
			name: `Must be a ${numberOfBedrooms} bed apartment.`,
			selector: {
				isCustomSelector: true,
				customSelector: "div.property-information :nth-child(3)"
			},
			booleanTest: (input) => {
				return findFirstNumber(input) === numberOfBedrooms;
			}
		};
	};

	public static isStudio : ValueCheckerRequirement = {
		name: "Must be a studio.",
		selector: RightMoveMethods.typeSelector,
		booleanTest: (input) => {
			const inputLowered = input.toLowerCase();
			return inputLowered.includes("studio");
		}
	};
}

export default RightMoveMethods;
