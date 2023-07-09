import {SearchConfig} from "../../types/configTypes";
import {findFirstNumber} from "../../testing/firstPageTest";
import {ZooplaMethods} from "./valueRequirements";

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
			value: "650"
		}
	],
	page_param : "pn",
	requireToEstablishAsLoaded : {
		isCustomSelector: false,
		attributeName : "class",
		expectedValue : "portalLight",
		exactMatch : true
	},
	requireToStartParsing : [
		{
			isCustomSelector: false,
			attributeName : "id",
			expectedValue : "listing_",
			exactMatch : false
		}
	],
	selectElementsOfInterest : {
		isCustomSelector: false,
		attributeName : "id",
		expectedValue : "listing_",
		exactMatch : false
	},
	identifierOfElementOfInterest: {
		selector : {
			isCustomSelector: false,
			attributeName : "class",
			expectedValue : "_1maljyt1",
			exactMatch : true
		},
		extractor: (element) => {
			const linkAttribute = element.getAttribute("href");
			if(linkAttribute) return findFirstNumber(linkAttribute).toString();
			else throw new Error("Id cannot be established!");
		},
		getURIBasedOnID : (id) => {
			return "https://www.zoopla.co.uk/to-rent/details/" + id + "/";
		}
	},
	optional_tests : {
		expectedNumberOfElementsOfInterest : {
			isCustomSelector: false,
			attributeName: "data-testid",
			expectedValue: "total-results",
			exactMatch: true
		},
		expectedNumberOfPages : {
			isCustomSelector: false,
			attributeName: "class",
			expectedValue: "_13wnc6k4",
			exactMatch: true
		}
	},
	categories: [
		{
			name: "Room with Bills Included",
			requirements: [
				ZooplaMethods.availabilityRequirement,
				ZooplaMethods.parkingNotAllowedRequirement,
				ZooplaMethods.priceLowerThan650,
				ZooplaMethods.includesBills
			]
		},
		{
			name: "Room without Bills Included, but cheap",
			requirements: [
				ZooplaMethods.availabilityRequirement,
				ZooplaMethods.parkingNotAllowedRequirement,
				ZooplaMethods.priceLowerThan500
			]
		}
	]

};

export default zooplaSearchConfig;