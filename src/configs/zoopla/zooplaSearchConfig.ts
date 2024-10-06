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
		},
		{
			parameter: "is_retirement_home=false",
			value: "false"
		},
		{
			parameter: "is_student_accommodation",
			value: "false"
		}
	],
	page_param : "pn",
	requireToEstablishAsLoaded : {
		isCustomSelector: false,
		attributeName : "class",
		expectedValue : "portalLight",
		exactMatch : true
	},
	requireToEstablishListingAsLoaded: {
		isCustomSelector: false,
		attributeName : "aria-labelledby",
		expectedValue: "listing-gallery-heading",
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
			deepScoreMethods: [
				ZooplaMethods.mustIncludeBills
			],
			mustNotBePresentRequirements: [ZooplaMethods.mustNotHavePlaceholderPictures]
		},
		{
			name: "Room w/o Bills Included",
			shallowRequirements: [
				ZooplaMethods.availabilityRequirement,
				ZooplaMethods.isNotAParkingSpace,
				ZooplaMethods.priceLowerThan(priceConfig.roomWithoutBills)
			],
			deepScoreMethods: [],
			mustNotBePresentRequirements: [ZooplaMethods.mustNotHavePlaceholderPictures]
		},
		{
			name: "EnSuite Room Bills Included",
			shallowRequirements: [
				ZooplaMethods.availabilityRequirement,
				ZooplaMethods.isNotAParkingSpace,
				ZooplaMethods.priceLowerThan(priceConfig.enSuiteWithBills),
				ZooplaMethods.enSuite,
			],
			deepScoreMethods: [
				ZooplaMethods.mustIncludeBills
			],
			mustNotBePresentRequirements: [ZooplaMethods.mustNotHavePlaceholderPictures]
		},
		{
			name: "EnSuite Room w/o Bills Included",
			shallowRequirements: [
				ZooplaMethods.availabilityRequirement,
				ZooplaMethods.isNotAParkingSpace,
				ZooplaMethods.priceLowerThan(priceConfig.enSuiteWithoutBills),
				ZooplaMethods.enSuite,
			],
			deepScoreMethods: [],
			mustNotBePresentRequirements: [ZooplaMethods.mustNotHavePlaceholderPictures]
		},
		{
			name: "Studio flat Bills Included",
			shallowRequirements: [
				ZooplaMethods.availabilityRequirement,
				ZooplaMethods.isNotAParkingSpace,
				ZooplaMethods.priceLowerThan(priceConfig.studioPriceWithBills),
				ZooplaMethods.isStudio,
			],
			deepScoreMethods: [
				ZooplaMethods.mustIncludeBills
			],
			mustNotBePresentRequirements: [ZooplaMethods.mustNotHavePlaceholderPictures]
		},
		{
			name: "Studio flat w/o Bills Included",
			shallowRequirements: [
				ZooplaMethods.availabilityRequirement,
				ZooplaMethods.isNotAParkingSpace,
				ZooplaMethods.priceLowerThan(priceConfig.studioPriceWithoutBills),
				ZooplaMethods.isStudio,
			],
			deepScoreMethods: [],
			mustNotBePresentRequirements: [ZooplaMethods.mustNotHavePlaceholderPictures]
		},
		{
			name: "Two bed flat",
			shallowRequirements: [
				ZooplaMethods.availabilityRequirement,
				ZooplaMethods.isNotAParkingSpace,
				ZooplaMethods.priceLowerThan(priceConfig.twoBedFlat),
				ZooplaMethods.getIsNBedApartment(2)
			],
			deepScoreMethods: [],
			mustNotBePresentRequirements: [ZooplaMethods.mustNotHavePlaceholderPictures]
		},
		{
			name: "Three bed flat",
			shallowRequirements: [
				ZooplaMethods.availabilityRequirement,
				ZooplaMethods.isNotAParkingSpace,
				ZooplaMethods.priceLowerThan(priceConfig.threeBedFlat),
				ZooplaMethods.getIsNBedApartment(3)
			],
			deepScoreMethods: [],
			mustNotBePresentRequirements: [ZooplaMethods.mustNotHavePlaceholderPictures]
		},
	],
	minDelayConfig: {
		mean: 1500,
		std: 500
	}

};

export default zooplaSearchConfig;