import {SearchConfig} from "./types/configTypes";

const searchConfig : SearchConfig = {
	url: "https://www.zoopla.co.uk",
	subDirectory : "/to-rent/property/edinburgh/",
	getParams : [
		{
			parameter : "price_frequency",
			value : "per_month"
		},
		{
			//testing only
			parameter: "price_max",
			value: "800"
		}
	],
	page_param : "pn",
	requireToEstablishAsLoaded : {
		attributeName : "class",
		expectedValue : "portalLight",
		exactMatch : true
	},
	requireToStartParsing : [
		{
			attributeName : "id",
			expectedValue : "listing_",
			exactMatch : false
		}
	],
};

export default searchConfig;