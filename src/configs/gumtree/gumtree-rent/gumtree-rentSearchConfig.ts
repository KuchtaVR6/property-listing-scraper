import {AttributeSelector, EndOfPagesIndicator, SearchConfig} from "../../../types/configTypes";
import gumtreeCategories from "../gumtreeCategories";

export const adCountSelector : AttributeSelector = {
	isCustomSelector: false,
	attributeName: "class",
	expectedValue: "css-1yuhvjn",
	exactMatch: false
};

export const adSelector : AttributeSelector = {
	isCustomSelector: false,
	attributeName: "data-q",
	expectedValue: "search-result",
	exactMatch: true
};

export const idContainer : AttributeSelector = {
	isCustomSelector: false,
	attributeName: "data-q",
	expectedValue: "search-result-anchor",
	exactMatch: true
};

const gumtreeRentSearchConfig : SearchConfig = {
	name: "gumtree-rent",
	url: "https://www.gumtree.com/",
	subDirectory: "search",
	getParams: [
		{
			parameter: "max_price",
			value: "500"
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
	timeoutTime: 15000,
	page_param: "page",
	requireToEstablishAsLoaded : adCountSelector,
	selectElementsOfInterest : adSelector,
	identifierOfElementOfInterest : {
		selector : idContainer,
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
		/*
		expectedNumberOfPages : {
			isCustomSelector: false,
			attributeName: "data-analytics",
			expectedValue: "gaEvent:PaginationPage",
			exactMatch: true
		}
		 */
	},
	categories: gumtreeCategories
};

export default gumtreeRentSearchConfig;