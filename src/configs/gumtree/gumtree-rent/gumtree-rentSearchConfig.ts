import {AttributeSelector, EndOfPagesIndicator, SearchConfig} from "../../../types/configTypes";
import {GumtreeMethods} from "../valueRequirements";
import priceConfig from "../../priceConfig";

const adCountSelector : AttributeSelector = {
	isCustomSelector: false,
	attributeName: "data-q",
	expectedValue: "ads-count",
	exactMatch: true
};

const gumtreeRentSearchConfig : SearchConfig = {
	name: "gumtree-rent",
	url: "https://www.gumtree.com/",
	subDirectory: "search",
	getParams: [
		{
			parameter: "max_price",
			value: "230"
		},
		{
			parameter: "search_category",
			value: "property-to-rent"
		},
		{
			parameter: "search_location",
			value: "Edinburgh"
		}
	],
	page_param: "page",
	requireToEstablishAsLoaded : adCountSelector,
	selectElementsOfInterest : {
		isCustomSelector: false,
		attributeName: "class",
		expectedValue: "natural",
		exactMatch: true,
	},
	identifierOfElementOfInterest : {
		selector : {
			isCustomSelector: false,
			attributeName: "class",
			expectedValue: "listing-link",
			exactMatch: false
		},
		extractor : (element) => {
			const hrefAttribute = element.getAttribute("href");
			if(hrefAttribute) {
				const finalString = hrefAttribute.split("/").slice(3).join("/");
				return finalString;
			}
			else throw new Error("Id cannot be established!");
		},
		getURIBasedOnID : (id) => {
			return "https://www.gumtree.com/p/property-to-rent/" + id;
		}
	},
	endOfPagesIndicator: EndOfPagesIndicator.AllPointOfInterestIDsRepeated,
	optional_tests: {
		expectedNumberOfElementsOfInterest: adCountSelector,
		expectedNumberOfPages : {
			isCustomSelector: false,
			attributeName: "data-analytics",
			expectedValue: "gaEvent:PaginationPage",
			exactMatch: true
		}
	},
	categories: [
		{
			name: "En-Suite with bills",
			requirements: [
				GumtreeMethods.availabilityRequirement,
				GumtreeMethods.isEnSuite,
				GumtreeMethods.getPriceLowerThanArgumentReq(
					priceConfig.enSuiteWithBills),
				GumtreeMethods.includesBills
			]
		},
		{
			name: "En-Suite without bills",
			requirements: [
				GumtreeMethods.availabilityRequirement,
				GumtreeMethods.isEnSuite,
				GumtreeMethods.getPriceLowerThanArgumentReq(
					priceConfig.enSuiteWithoutBills),
			]
		},
		{
			name: "Room with bills",
			requirements: [
				GumtreeMethods.availabilityRequirement,
				GumtreeMethods.getPriceLowerThanArgumentReq(
					priceConfig.roomWithBills),
				GumtreeMethods.includesBills
			]
		},
		{
			name: "Room without bills",
			requirements: [
				GumtreeMethods.availabilityRequirement,
				GumtreeMethods.getPriceLowerThanArgumentReq(
					priceConfig.roomWithoutBills),
			]
		},
	]
};

export default gumtreeRentSearchConfig;