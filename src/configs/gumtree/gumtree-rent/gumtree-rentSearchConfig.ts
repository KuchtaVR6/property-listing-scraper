import {AttributeSelector, EndOfPagesIndicator, SearchConfig} from "../../../types/configTypes";
import gumtreeCategories from "../gumtreeCategories";
import {absolute_max} from "../../priceConfig";
import {locationConfig} from "../../locationConfig";

export const adCountSelector : AttributeSelector = {
	isCustomSelector: false,
	attributeName: "class",
	expectedValue: "css-19squc8",
	exactMatch: true
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
			value: `${absolute_max}`
		},
		{
			parameter: "search_category",
			value: "property-to-rent"
		},
		{
			parameter: "search_location",
			value: `${locationConfig.postcode}`
		},
		{
			parameter: "distance",
			value: `${locationConfig.distance}`
		}
	],
	page_param: "page",
	requireToEstablishAsLoaded : adCountSelector,
	selectElementsOfInterest : adSelector,
	identifierOfElementOfInterest : {
		selector : idContainer,
		extractor : (element) => {
			const hrefAttribute = element.getAttribute("href");
			if(hrefAttribute) {
				return hrefAttribute.split("/").slice(3).join("/");
			}
			else throw new Error("Id cannot be established!");
		},
		getURIBasedOnID : (id) => {
			return "https://www.gumtree.com/p/property-to-rent/" + id;
		}
	},
	endOfPagesIndicator: EndOfPagesIndicator.EndOfListElement,
	endOfPagesElement: {
		isCustomSelector: false,
		attributeName: "data-q",
		expectedValue: "nearby-results-title",
		exactMatch: true
	},
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