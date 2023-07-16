import {AttributeSelector, EndOfPagesIndicator, SearchConfig} from "../../types/configTypes";
import {findFirstNumber} from "../../testing/firstPageTest";

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
			name: "test let everything in",
			requirements: [
				{
					selector: {
						isCustomSelector: false,
						attributeName: "class",
						expectedValue: "listingPriceDetails",
						exactMatch: true
					},
					name: "random test on propertyCard-priceValue",
					booleanTest: (element) => {
						return true;
					}
				}
			]
		}
	]
};

export default spareRoomSearchConfig;