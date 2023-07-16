import {EndOfPagesIndicator, SearchConfig} from "../../types/configTypes";
import {findFirstNumber} from "../../testing/firstPageTest";

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
			value: "1000"
		},
		{
			parameter: "includeLetAgreed",
			value: "false"
		}
	],
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
			name: "test let everything in",
			requirements: [
				{
					selector: {
						isCustomSelector: false,
						attributeName: "class",
						expectedValue: "propertyCard-priceValue",
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

export default rightMoveSearchConfig;