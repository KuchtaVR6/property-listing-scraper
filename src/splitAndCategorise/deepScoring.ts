import {AttributeSelector, ValueCheckerRequirement} from "../types/configTypes";
import {fetchHTML} from "../procuringTheHTML/fetchPages";

const deepScoring =
	async (
		url: string,
		methods: ValueCheckerRequirement<number>[],
		listingLoaded : AttributeSelector) : Promise<number> => {

		const listingDetailed = await fetchHTML(url, listingLoaded);

		listingDetailed.id;

		return 0;
	};

export default deepScoring;