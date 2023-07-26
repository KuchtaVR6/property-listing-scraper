import {AttributeSelector, EndOfPagesIndicator, SearchConfig} from "../../types/configTypes";
import {findFirstNumber} from "../../testing/firstPageTest";
import {SpareRoomMethods} from "./valueRequirements";
import priceConfig from "../priceConfig";

const resultsSelector : AttributeSelector = {
	isCustomSelector : true,
	customSelector: "#results_header strong:nth-of-type(2)"
};

const spareRoomSearchConfig : SearchConfig = {
	name: "spare-room",
	url: "https://www.spareroom.co.uk/",
	subDirectory: "flatshare/",
	getParams: [
		{
			parameter : "search_id",
			value : "1232444711"
		}
	],
	page_param: "offset",
	page_step: 10,
	requireToEstablishAsLoaded : {
		isCustomSelector: false,
		attributeName: "class",
		expectedValue: "listing-results",
		exactMatch: false
	},

	selectElementsOfInterest : {
		isCustomSelector: false,
		attributeName: "class",
		expectedValue: "panel-listing-result",
		exactMatch: false
	},

	identifierOfElementOfInterest: {
		selector: {
			isCustomSelector: false,
			attributeName: "class",
			expectedValue: "advertDescription",
			exactMatch: true
		},
		extractor: (element) => {
			const hrefAttribute = element.getAttribute("href");
			if(hrefAttribute) return findFirstNumber(hrefAttribute).toString();
			else throw new Error("Id cannot be established!");
		},
		getURIBasedOnID: (id : string) => {
			return "https://www.spareroom.co.uk/flatshare/flatshare_detail.pl?flatshare_id=" + id;
		}
	},
	endOfPagesIndicator : EndOfPagesIndicator.AllPointOfInterestIDsRepeated,

	optional_tests: {
		expectedNumberOfElementsOfInterest: resultsSelector,
		expectedNumberOfPages : undefined
		// spare room doesn't display the number of pages
	},

	categories: [
		{
			name: "Weekly En-Suite with bills",
			requirements: [
				SpareRoomMethods.availabilityRequirement,
				SpareRoomMethods.priceMeasuredWeekly,
				SpareRoomMethods.isEnSuite,
				SpareRoomMethods.getPriceLowerThanArgumentReq(
					priceConfig.enSuiteWithBills, true),
				SpareRoomMethods.includesBills
			],
			mustNotBePresentRequirements: [SpareRoomMethods.monFriSelector]
		},
		{
			name: "Monthly En-Suite with bills",
			requirements: [
				SpareRoomMethods.availabilityRequirement,
				SpareRoomMethods.priceMeasuredMonthly,
				SpareRoomMethods.isEnSuite,
				SpareRoomMethods.getPriceLowerThanArgumentReq(
					priceConfig.enSuiteWithBills, false),
				SpareRoomMethods.includesBills
			],
			mustNotBePresentRequirements: [SpareRoomMethods.monFriSelector]
		},
		{
			name: "Weekly En-Suite without bills",
			requirements: [
				SpareRoomMethods.availabilityRequirement,
				SpareRoomMethods.priceMeasuredWeekly,
				SpareRoomMethods.isEnSuite,
				SpareRoomMethods.getPriceLowerThanArgumentReq(
					priceConfig.enSuiteWithoutBills, true),
			],
			mustNotBePresentRequirements: [SpareRoomMethods.monFriSelector]
		},
		{
			name: "Monthly En-Suite without bills",
			requirements: [
				SpareRoomMethods.availabilityRequirement,
				SpareRoomMethods.priceMeasuredMonthly,
				SpareRoomMethods.isEnSuite,
				SpareRoomMethods.getPriceLowerThanArgumentReq(
					priceConfig.enSuiteWithoutBills, false),
			],
			mustNotBePresentRequirements: [SpareRoomMethods.monFriSelector]
		},
		{
			name: "Weekly room with bills",
			requirements: [
				SpareRoomMethods.availabilityRequirement,
				SpareRoomMethods.priceMeasuredWeekly,
				SpareRoomMethods.getPriceLowerThanArgumentReq(
					priceConfig.roomWithBills, true),
				SpareRoomMethods.includesBills
			],
			mustNotBePresentRequirements: [SpareRoomMethods.monFriSelector]
		},
		{
			name: "Monthly room with bills",
			requirements: [
				SpareRoomMethods.availabilityRequirement,
				SpareRoomMethods.priceMeasuredMonthly,
				SpareRoomMethods.getPriceLowerThanArgumentReq(
					priceConfig.roomWithBills, false),
				SpareRoomMethods.includesBills
			],
			mustNotBePresentRequirements: [SpareRoomMethods.monFriSelector]
		},
		{
			name: "Weekly room without bills",
			requirements: [
				SpareRoomMethods.availabilityRequirement,
				SpareRoomMethods.priceMeasuredWeekly,
				SpareRoomMethods.getPriceLowerThanArgumentReq(
					priceConfig.roomWithoutBills, true),
			],
			mustNotBePresentRequirements: [SpareRoomMethods.monFriSelector]
		},
		{
			name: "Monthly room without bills",
			requirements: [
				SpareRoomMethods.availabilityRequirement,
				SpareRoomMethods.priceMeasuredMonthly,
				SpareRoomMethods.getPriceLowerThanArgumentReq(
					priceConfig.roomWithoutBills, false),
			],
			mustNotBePresentRequirements: [SpareRoomMethods.monFriSelector]
		},
	]
};

export default spareRoomSearchConfig;