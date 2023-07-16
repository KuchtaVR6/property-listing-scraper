import {EndOfPagesIndicator, SearchConfig} from "../../../types/configTypes";

const gumtreeShareSearchConfig : SearchConfig = {
	name: "gumtree-share",
	url: "https://www.gumtree.com/",
	subDirectory: "search",
	getParams: [
		{
			parameter: "max_price",
			value: "230"
		},
		{
			parameter: "search_category",
			value: "property-to-share"
		},
		{
			parameter: "search_location",
			value: "edinburgh"
		}
	],
	page_param: "page",
	requireToEstablishAsLoaded : {
		isCustomSelector: false,
		attributeName: "data-q",
		expectedValue: "ads-count",
		exactMatch: true
	},
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
			return "https://www.gumtree.com/p/property-to-share/" + id;
		}
	},
	endOfPagesIndicator: EndOfPagesIndicator.AllPointOfInterestIDsRepeated,
	optional_tests: {
		expectedNumberOfElementsOfInterest: {
			isCustomSelector: false,
			attributeName: "data-q",
			expectedValue: "ads-count",
			exactMatch: true
		},
		expectedNumberOfPages : {
			isCustomSelector: false,
			attributeName: "data-analytics",
			expectedValue: "gaEvent:PaginationPage",
			exactMatch: true
		}
	},
	categories: [
		{
			name: "test let everything in",
			requirements: [
				{
					selector: {
						isCustomSelector: false,
						attributeName: "class",
						expectedValue: "truncate-line",
						exactMatch: true
					},
					name: "random test on truncate-line",
					booleanTest: (element) => {
						return true;
					}
				}
			]
		}
	]
};

export default gumtreeShareSearchConfig;