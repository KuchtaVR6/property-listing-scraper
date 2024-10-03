import {EndOfPagesIndicator, SearchConfig} from "../../types/configTypes";
import {findFirstNumber} from "../../testing/firstPageTest";
import {ZooplaMethods} from "./valueRequirements";
import priceConfig, {absolute_max} from "../priceConfig";
import {locationConfig} from "../locationConfig";

const zooplaSearchConfig : SearchConfig = {
	name: "zoopla-for-rent",
	url: "https://www.zoopla.co.uk",
	subDirectory : "/to-rent/property/manchester/hilton-street-m1/m1-2eh",
	getParams : [
		{
			parameter : "price_frequency",
			value : "per_month"
		},
		{
			parameter: "price_max",
			value: `${absolute_max}`
		},
		{
			parameter: "radius",
			value: `${locationConfig.distance}`
		}
	],
	page_param : "pn",
	requireToEstablishAsLoaded : {
		isCustomSelector: false,
		attributeName : "class",
		expectedValue : "portalLight",
		exactMatch : true
	},
	selectElementsOfInterest : {
		isCustomSelector: false,
		attributeName : "id",
		expectedValue : "listing_",
		exactMatch : false
	},
	identifierOfElementOfInterest: {
		extractor: (element) => {
			const idAttribute = element.getAttribute("id");
			if(idAttribute) return findFirstNumber(idAttribute).toString();
			else throw new Error("Id cannot be established!");
		},
		getURIBasedOnID : (id) => {
			return "https://www.zoopla.co.uk/to-rent/details/" + id + "/";
		}
	},
	endOfPagesIndicator : EndOfPagesIndicator.NoPointsOfInterestPresent,
	optional_tests : {
		expectedNumberOfElementsOfInterest : {
			isCustomSelector: false,
			attributeName: "data-testid",
			expectedValue: "total-results",
			exactMatch: true
		}
	},
	categories: [
		{
			name: "Room Bills Included",
			shallowRequirements: [
				ZooplaMethods.availabilityRequirement,
				ZooplaMethods.isNotAParkingSpace,
				ZooplaMethods.priceLowerThan(priceConfig.roomWithBills),
			],
			deepScoreMethods: [] // todo check for bills.
		},
		{
			name: "Room w/o Bills Included",
			shallowRequirements: [
				ZooplaMethods.availabilityRequirement,
				ZooplaMethods.isNotAParkingSpace,
				ZooplaMethods.priceLowerThan(priceConfig.roomWithoutBills)
			],
			deepScoreMethods: []
		},
		{
			name: "EnSuite Room Bills Included",
			shallowRequirements: [
				ZooplaMethods.availabilityRequirement,
				ZooplaMethods.isNotAParkingSpace,
				ZooplaMethods.priceLowerThan(priceConfig.enSuiteWithBills),
				ZooplaMethods.enSuite,
			],
			deepScoreMethods: [] // todo check for bills.
		},
		{
			name: "EnSuite Room w/o Bills Included",
			shallowRequirements: [
				ZooplaMethods.availabilityRequirement,
				ZooplaMethods.isNotAParkingSpace,
				ZooplaMethods.priceLowerThan(priceConfig.enSuiteWithoutBills),
				ZooplaMethods.enSuite,
			],
			deepScoreMethods: []
		},
		{
			name: "Studio flat Bills Included",
			shallowRequirements: [
				ZooplaMethods.availabilityRequirement,
				ZooplaMethods.isNotAParkingSpace,
				ZooplaMethods.priceLowerThan(priceConfig.studioPriceWithBills),
				ZooplaMethods.isStudio,
			],
			deepScoreMethods: [] // todo check for bills.
		},
		{
			name: "Studio flat w/o Bills Included",
			shallowRequirements: [
				ZooplaMethods.availabilityRequirement,
				ZooplaMethods.isNotAParkingSpace,
				ZooplaMethods.priceLowerThan(priceConfig.studioPriceWithoutBills),
				ZooplaMethods.isStudio,
			],
			deepScoreMethods: []
		},
		{
			name: "Two bed flat",
			shallowRequirements: [
				ZooplaMethods.availabilityRequirement,
				ZooplaMethods.isNotAParkingSpace,
				ZooplaMethods.priceLowerThan(priceConfig.twoBedFlat),
				ZooplaMethods.getIsNBedApartment(2)
			],
			deepScoreMethods: []
		},
		{
			name: "Three bed flat",
			shallowRequirements: [
				ZooplaMethods.availabilityRequirement,
				ZooplaMethods.isNotAParkingSpace,
				ZooplaMethods.priceLowerThan(priceConfig.threeBedFlat),
				ZooplaMethods.getIsNBedApartment(3)
			],
			deepScoreMethods: []
		},
	]

};

export default zooplaSearchConfig;