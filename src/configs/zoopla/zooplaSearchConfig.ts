import {EndOfPagesIndicator, SearchConfig} from "../../types/configTypes";
import {findFirstNumber} from "../../testing/firstPageTest";
import {ZooplaMethods} from "./valueRequirements";
import priceConfig from "../priceConfig";

const zooplaSearchConfig : SearchConfig = {
	name: "zoopla-for-rent",
	url: "https://www.zoopla.co.uk",
	subDirectory : "/to-rent/property/edinburgh/",
	getParams : [
		{
			parameter : "price_frequency",
			value : "per_month"
		},
		{
			parameter: "price_max",
			value: "1500"
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
			name: "Room MANUAL CHECK Bills Included",
			requirements: [
				ZooplaMethods.availabilityRequirement,
				ZooplaMethods.isNotAParkingSpace,
				ZooplaMethods.priceLowerThan(priceConfig.roomWithBills),
				//ZooplaMethods.includesBills
			]
		},
		// {
		// 	name: "Room without Bills Included, but cheap",
		// 	requirements: [
		// 		ZooplaMethods.availabilityRequirement,
		// 		ZooplaMethods.isNotAParkingSpace,
		// 		ZooplaMethods.priceLowerThan(priceConfig.roomWithoutBills)
		// 	]
		// },
		{
			name: "EnSuite Room MANUAL CHECK Bills Included",
			requirements: [
				ZooplaMethods.availabilityRequirement,
				ZooplaMethods.isNotAParkingSpace,
				ZooplaMethods.priceLowerThan(priceConfig.enSuiteWithBills),
				//ZooplaMethods.includesBills,
				ZooplaMethods.enSuite,
			]
		},
		// {
		// 	name: "EnSuite Room without Bills Included, but cheap",
		// 	requirements: [
		// 		ZooplaMethods.availabilityRequirement,
		// 		ZooplaMethods.isNotAParkingSpace,
		// 		ZooplaMethods.priceLowerThan(priceConfig.enSuiteWithoutBills),
		// 		ZooplaMethods.enSuite,
		// 	]
		// },

		{
			name: "Studio flat MANUAL CHECK Bills Included",
			requirements: [
				ZooplaMethods.availabilityRequirement,
				ZooplaMethods.isNotAParkingSpace,
				ZooplaMethods.priceLowerThan(priceConfig.studioPriceWithBills),
				//ZooplaMethods.includesBills,
				ZooplaMethods.isStudio,
			]
		},
		// {
		// 	name: "Studio flat without Bills Included",
		// 	requirements: [
		// 		ZooplaMethods.availabilityRequirement,
		// 		ZooplaMethods.isNotAParkingSpace,
		// 		ZooplaMethods.priceLowerThan(priceConfig.studioPriceWithoutBills),
		// 		ZooplaMethods.isStudio,
		// 	]
		// },

		{
			name: "Two bed flat",
			requirements: [
				ZooplaMethods.availabilityRequirement,
				ZooplaMethods.isNotAParkingSpace,
				ZooplaMethods.priceLowerThan(priceConfig.twoBedFlat),
				ZooplaMethods.getIsNBedApartment(2)
			]
		},
		{
			name: "Three bed flat",
			requirements: [
				ZooplaMethods.availabilityRequirement,
				ZooplaMethods.isNotAParkingSpace,
				ZooplaMethods.priceLowerThan(priceConfig.threeBedFlat),
				ZooplaMethods.getIsNBedApartment(3)
			]
		},
	]

};

export default zooplaSearchConfig;