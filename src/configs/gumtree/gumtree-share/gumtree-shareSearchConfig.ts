import {EndOfPagesIndicator, SearchConfig} from "../../../types/configTypes";
import gumtreeCategories from "../gumtreeCategories";
import {adCountSelector, adSelector, idContainer} from "../gumtree-rent/gumtree-rentSearchConfig";
import {absolute_max} from "../../priceConfig";
import {locationConfig} from "../../locationConfig";

const gumtreeShareSearchConfig : SearchConfig = {
	name: "gumtree-share",
	url: "https://www.gumtree.com/",
	subDirectory: "search",
	getParams: [
		{
			parameter: "max_price",
			value: `${absolute_max}`
		},
		{
			parameter: "search_category",
			value: "property-to-share"
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
			return "https://www.gumtree.com/p/property-to-share/" + id;
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
		expectedNumberOfElementsOfInterest: {
			isCustomSelector: false,
			attributeName: "data-q",
			expectedValue: "ads-count",
			exactMatch: true
		}
	},
	categories: gumtreeCategories
};

export default gumtreeShareSearchConfig;