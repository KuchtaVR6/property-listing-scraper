import {EndOfPagesIndicator, SearchConfig} from "../../types/configTypes";
import {findFirstNumber} from "../../testing/firstPageTest";
import RightMoveMethods from "./valueRequirements";
import priceConfig from "../priceConfig";

const rightMoveSearchConfig : SearchConfig = {
	name: "right-move-for-rent",
	url: "https://www.rightmove.co.uk/",
	subDirectory: "property-to-rent/find.html",
	getParams: [
		{
			parameter : "locationIdentifier",
			value : "REGION^475"
		},
		{
			parameter: "maxPrice",
			value: "2000"
		},
		{
			parameter: "includeLetAgreed",
			value: "false"
		}
	],
	stopOnFirstSeenAdvert: true,
	page_param: "index",
	page_step: 24,
	requireToEstablishAsLoaded : {
		isCustomSelector: false,
		attributeName: "class",
		expectedValue: "l-propertySearch-main",
		exactMatch: true
	},

	selectElementsOfInterest : {
		isCustomSelector: false,
		attributeName: "itemtype",
		expectedValue: "http://schema.org/Residence",
		exactMatch: true
	},

	identifierOfElementOfInterest: {
		selector: {
			isCustomSelector: false,
			attributeName: "class",
			expectedValue: "propertyCard-anchor",
			exactMatch: false
		},
		extractor: (element) => {
			const idAttribute = element.getAttribute("id");
			if(idAttribute) return findFirstNumber(idAttribute).toString();
			else throw new Error("Id cannot be established!");
		},
		getURIBasedOnID: (id : string) => {
			return "https://www.rightmove.co.uk/properties/" + id;
		}
	},
	endOfPagesIndicator : EndOfPagesIndicator.AllPointOfInterestIDsRepeated,

	optional_tests: {
		expectedNumberOfElementsOfInterest: undefined,
		// I don't know why but the number displayed on the website is wrong :/
		expectedNumberOfPages : {
			isCustomSelector: false,
			attributeName: "data-bind",
			expectedValue: "total",
			exactMatch: false
		}
	},

	categories: [
		{
			name: "Room with bills",
			requirements: [
				RightMoveMethods.includesBills,
				RightMoveMethods.priceLowerThan(priceConfig.roomWithBills),
				RightMoveMethods.isNotAParkingSpace
			]
		},
		{
			name: "Room without bills",
			requirements: [
				RightMoveMethods.priceLowerThan(priceConfig.roomWithoutBills),
				RightMoveMethods.isNotAParkingSpace
			]
		},
		{
			name: "En-suite with bills",
			requirements: [
				RightMoveMethods.includesBills,
				RightMoveMethods.priceLowerThan(priceConfig.enSuiteWithBills),
				RightMoveMethods.isNotAParkingSpace,
				RightMoveMethods.enSuite
			]
		},
		{
			name: "En-suite without bills",
			requirements: [
				RightMoveMethods.priceLowerThan(priceConfig.enSuiteWithoutBills),
				RightMoveMethods.isNotAParkingSpace,
				RightMoveMethods.enSuite
			]
		},

		{
			name: "Studio with bills",
			requirements: [
				RightMoveMethods.includesBills,
				RightMoveMethods.priceLowerThan(priceConfig.studioPriceWithBills),
				RightMoveMethods.isNotAParkingSpace,
				RightMoveMethods.isStudio,
				RightMoveMethods.isNotAHouseShare
			]
		},
		{
			name: "Studio without bills",
			requirements: [
				RightMoveMethods.priceLowerThan(priceConfig.studioPriceWithoutBills),
				RightMoveMethods.isNotAParkingSpace,
				RightMoveMethods.isStudio,
				RightMoveMethods.isNotAHouseShare
			]
		},

		{
			name: "One bed flat with bills",
			requirements: [
				RightMoveMethods.includesBills,
				RightMoveMethods.priceLowerThan(priceConfig.studioPriceWithBills),
				RightMoveMethods.isNotAParkingSpace,
				RightMoveMethods.getIsNBedApartment(1),
				RightMoveMethods.isNotAHouseShare
			]
		},
		{
			name: "One bed flat without bills",
			requirements: [
				RightMoveMethods.priceLowerThan(priceConfig.studioPriceWithoutBills),
				RightMoveMethods.isNotAParkingSpace,
				RightMoveMethods.getIsNBedApartment(1),
				RightMoveMethods.isNotAHouseShare
			]
		},

		{
			name: "Two bed flat",
			requirements: [
				RightMoveMethods.priceLowerThan(priceConfig.twoBedFlat),
				RightMoveMethods.isNotAParkingSpace,
				RightMoveMethods.getIsNBedApartment(2),
				RightMoveMethods.isNotAHouseShare
			]
		},

		{
			name: "Three bed flat",
			requirements: [
				RightMoveMethods.priceLowerThan(priceConfig.threeBedFlat),
				RightMoveMethods.isNotAParkingSpace,
				RightMoveMethods.getIsNBedApartment(3),
				RightMoveMethods.isNotAHouseShare
			]
		},
	]
};

export default rightMoveSearchConfig;