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
			value : "1326557100"
		},
		{
			parameter : "sort_by",
			value : "days_since_placed"
		}
	],
	page_param: "offset",
	page_step: 10,
	requireToEstablishAsLoaded : {
		isCustomSelector: true,
		customSelector: ".listing-results"
	},
	requireToEstablishListingAsLoaded: {
		isCustomSelector: false,
		attributeName : "class",
		expectedValue: "photo-gallery__main-image-dt",
		exactMatch : true
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
	endOfPagesIndicator : EndOfPagesIndicator.DidNotSeeNextPageElement,
	endOfPagesElement: {
		isCustomSelector: false,
		attributeName: "id",
		expectedValue: "paginationNextPageLink",
		exactMatch: true
	},

	optional_tests: {
		expectedNumberOfElementsOfInterest: resultsSelector,
		expectedNumberOfPages : undefined
		// spare room doesn't display the number of pages
	},

	categories: [
		{
			name: "EnSuite Room Bills Included",
			shallowRequirements: [
				SpareRoomMethods.availabilityRequirement,
				SpareRoomMethods.priceMeasuredWeekly,
				SpareRoomMethods.isEnSuite,
				SpareRoomMethods.getPriceLowerThanArgumentReq(
					priceConfig.enSuiteWithBills, true),
				SpareRoomMethods.includesBills
			],
			mustNotBePresentRequirements: [SpareRoomMethods.monFriSelector],
			deepScoreMethods: []
		},
		{
			name: "EnSuite Room Bills Included",
			shallowRequirements: [
				SpareRoomMethods.availabilityRequirement,
				SpareRoomMethods.priceMeasuredMonthly,
				SpareRoomMethods.isEnSuite,
				SpareRoomMethods.getPriceLowerThanArgumentReq(
					priceConfig.enSuiteWithBills, false),
				SpareRoomMethods.includesBills
			],
			mustNotBePresentRequirements: [SpareRoomMethods.monFriSelector],
			deepScoreMethods: []
		},
		{
			name: "EnSuite Room w/o Bills Included",
			shallowRequirements: [
				SpareRoomMethods.availabilityRequirement,
				SpareRoomMethods.priceMeasuredWeekly,
				SpareRoomMethods.isEnSuite,
				SpareRoomMethods.getPriceLowerThanArgumentReq(
					priceConfig.enSuiteWithoutBills, true),
			],
			mustNotBePresentRequirements: [SpareRoomMethods.monFriSelector],
			deepScoreMethods: []
		},
		{
			name: "EnSuite Room w/o Bills Included",
			shallowRequirements: [
				SpareRoomMethods.availabilityRequirement,
				SpareRoomMethods.priceMeasuredMonthly,
				SpareRoomMethods.isEnSuite,
				SpareRoomMethods.getPriceLowerThanArgumentReq(
					priceConfig.enSuiteWithoutBills, false),
			],
			mustNotBePresentRequirements: [SpareRoomMethods.monFriSelector],
			deepScoreMethods: []
		},
		{
			name: "Room Bills Included",
			shallowRequirements: [
				SpareRoomMethods.availabilityRequirement,
				SpareRoomMethods.priceMeasuredWeekly,
				SpareRoomMethods.getPriceLowerThanArgumentReq(
					priceConfig.roomWithBills, true),
				SpareRoomMethods.includesBills
			],
			mustNotBePresentRequirements: [SpareRoomMethods.monFriSelector],
			deepScoreMethods: []
		},
		{
			name: "Room Bills Included",
			shallowRequirements: [
				SpareRoomMethods.availabilityRequirement,
				SpareRoomMethods.priceMeasuredMonthly,
				SpareRoomMethods.getPriceLowerThanArgumentReq(
					priceConfig.roomWithBills, false),
				SpareRoomMethods.includesBills
			],
			mustNotBePresentRequirements: [SpareRoomMethods.monFriSelector],
			deepScoreMethods: []
		},
		{
			name: "Room w/o Bills Included",
			shallowRequirements: [
				SpareRoomMethods.availabilityRequirement,
				SpareRoomMethods.priceMeasuredWeekly,
				SpareRoomMethods.getPriceLowerThanArgumentReq(
					priceConfig.roomWithoutBills, true),
			],
			mustNotBePresentRequirements: [SpareRoomMethods.monFriSelector],
			deepScoreMethods: []
		},
		{
			name: "Room w/o Bills Included",
			shallowRequirements: [
				SpareRoomMethods.availabilityRequirement,
				SpareRoomMethods.priceMeasuredMonthly,
				SpareRoomMethods.getPriceLowerThanArgumentReq(
					priceConfig.roomWithoutBills, false),
			],
			mustNotBePresentRequirements: [SpareRoomMethods.monFriSelector],
			deepScoreMethods: []
		},

		{
			name: "Studio flat w/o Bills Included",
			shallowRequirements: [
				SpareRoomMethods.availabilityRequirement,
				SpareRoomMethods.priceMeasuredWeekly,
				SpareRoomMethods.getPriceLowerThanArgumentReq(
					priceConfig.studioPriceWithoutBills, true),
				SpareRoomMethods.getIsNBedApartment(1)
			],
			mustNotBePresentRequirements: [SpareRoomMethods.monFriSelector],
			deepScoreMethods: []
		},
		{
			name: "Studio flat w/o Bills Included",
			shallowRequirements: [
				SpareRoomMethods.availabilityRequirement,
				SpareRoomMethods.priceMeasuredMonthly,
				SpareRoomMethods.getPriceLowerThanArgumentReq(
					priceConfig.studioPriceWithoutBills, false),
				SpareRoomMethods.getIsNBedApartment(1)
			],
			mustNotBePresentRequirements: [SpareRoomMethods.monFriSelector],
			deepScoreMethods: []
		},
		{
			name: "Studio flat Bills Included",
			shallowRequirements: [
				SpareRoomMethods.availabilityRequirement,
				SpareRoomMethods.priceMeasuredWeekly,
				SpareRoomMethods.getPriceLowerThanArgumentReq(
					priceConfig.studioPriceWithBills, true),
				SpareRoomMethods.includesBills,
				SpareRoomMethods.getIsNBedApartment(1)
			],
			mustNotBePresentRequirements: [SpareRoomMethods.monFriSelector],
			deepScoreMethods: []
		},
		{
			name: "Studio flat Bills Included",
			shallowRequirements: [
				SpareRoomMethods.availabilityRequirement,
				SpareRoomMethods.priceMeasuredMonthly,
				SpareRoomMethods.getPriceLowerThanArgumentReq(
					priceConfig.studioPriceWithBills, false),
				SpareRoomMethods.includesBills,
				SpareRoomMethods.getIsNBedApartment(1)
			],
			mustNotBePresentRequirements: [SpareRoomMethods.monFriSelector],
			deepScoreMethods: []
		},

		{
			name: "Two bed flat",
			shallowRequirements: [
				SpareRoomMethods.availabilityRequirement,
				SpareRoomMethods.priceMeasuredMonthly,
				SpareRoomMethods.getPriceLowerThanArgumentReq(
					priceConfig.twoBedFlat, false),
				SpareRoomMethods.getIsNBedApartment(2)
			],
			mustNotBePresentRequirements: [SpareRoomMethods.monFriSelector],
			deepScoreMethods: []
		},
		{
			name: "Two bed flat",
			shallowRequirements: [
				SpareRoomMethods.availabilityRequirement,
				SpareRoomMethods.priceMeasuredWeekly,
				SpareRoomMethods.getPriceLowerThanArgumentReq(
					priceConfig.twoBedFlat, true),
				SpareRoomMethods.getIsNBedApartment(2)
			],
			mustNotBePresentRequirements: [SpareRoomMethods.monFriSelector],
			deepScoreMethods: []
		},

		{
			name: "Three bed flat",
			shallowRequirements: [
				SpareRoomMethods.availabilityRequirement,
				SpareRoomMethods.priceMeasuredMonthly,
				SpareRoomMethods.getPriceLowerThanArgumentReq(
					priceConfig.threeBedFlat, false),
				SpareRoomMethods.getIsNBedApartment(3)
			],
			mustNotBePresentRequirements: [SpareRoomMethods.monFriSelector],
			deepScoreMethods: []
		},
		{
			name: "Three bed flat",
			shallowRequirements: [
				SpareRoomMethods.availabilityRequirement,
				SpareRoomMethods.priceMeasuredWeekly,
				SpareRoomMethods.getPriceLowerThanArgumentReq(
					priceConfig.threeBedFlat, true),
				SpareRoomMethods.getIsNBedApartment(3)
			],
			mustNotBePresentRequirements: [SpareRoomMethods.monFriSelector],
			deepScoreMethods: []
		},
	]
};

export default spareRoomSearchConfig;