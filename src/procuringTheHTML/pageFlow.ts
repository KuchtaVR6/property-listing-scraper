import {HTMLElement} from "node-html-parser";
import searchConfig from "../searchConfig";
import {getElementsMatchingRequirement} from "../requirementMatcherHelpers";
import {fetchWebsiteHTML} from "./fetchPages";

const getFullURLBasedOnConfigWithPageNumber = (pageNumber : number) => {
	let url = searchConfig.url + searchConfig.subDirectory + "?";

	for (const param of searchConfig.getParams) {
		url += param.parameter + "=" + param.value + "&";
	}

	url += searchConfig.page_param + "=" + pageNumber;

	return url;
};
const checkIfDocumentMeetsParsingRequirements = (element : HTMLElement) => {
	for (const requiredAttribute of searchConfig.requireToStartParsing) {
		if(getElementsMatchingRequirement(element, requiredAttribute).length === 0) {
			return false;
		}
	}
	return true;
};

const iterateThroughPages = async (limit? : number) => {
	if (!limit) {
		limit = 1000;
	}
	let currentPage = 1;
	const arrayOfPages : HTMLElement[]= [];
	while (currentPage <= limit) {
		const document = await fetchWebsiteHTML(
			getFullURLBasedOnConfigWithPageNumber(currentPage));
		if (checkIfDocumentMeetsParsingRequirements(document)) {
			arrayOfPages.push(document);
		} else {
			console.log(`End of parsing page encountered (after ${currentPage - 1} page(s))!`);
			console.log("If not desired check *requireToStartParsing*");
			break;
		}
		currentPage += 1;
	}
};

export default iterateThroughPages;