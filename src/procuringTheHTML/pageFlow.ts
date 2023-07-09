import {HTMLElement} from "node-html-parser";
import {getElementsMatchingSelector} from "../requirementMatcherHelpers";
import {fetchWebsiteHTML} from "./fetchPages";
import {setTestingInformationFromFirstPage} from "../testing/firstPageTest";
import TestingStorage from "../testing/testingStorage";
import {SearchConfig} from "../types/configTypes";

const getFullURLBasedOnConfigWithPageNumber = (givenConfig : SearchConfig, pageNumber : number) => {
	let url = givenConfig.url + givenConfig.subDirectory + "?";

	for (const param of givenConfig.getParams) {
		url += param.parameter + "=" + param.value + "&";
	}

	url += givenConfig.page_param + "=" + pageNumber;

	return url;
};
const checkIfDocumentMeetsParsingRequirements = (givenConfig : SearchConfig, element : HTMLElement) => {
	for (const requiredAttribute of givenConfig.requireToStartParsing) {
		if(getElementsMatchingSelector(element, requiredAttribute).length === 0) {
			return false;
		}
	}
	return true;
};

const iterateThroughPages = async (
	givenConfig : SearchConfig,
	processElement : (element : HTMLElement) => HTMLElement[],
	limit? : number) => {

	if (!limit) {
		limit = 1000;
	}
	let currentPage = 1;
	let arrayOfPages : HTMLElement[]= [];
	while (currentPage <= limit) {

		const document = await fetchWebsiteHTML(givenConfig,
			getFullURLBasedOnConfigWithPageNumber(givenConfig, currentPage));

		if(currentPage === 1 && givenConfig.optional_tests) {
			setTestingInformationFromFirstPage(givenConfig, document);
		}

		if (checkIfDocumentMeetsParsingRequirements(givenConfig, document)) {
			arrayOfPages = [...arrayOfPages, ...processElement(document)];
		} else {
			break;
		}

		currentPage += 1;
	}
	console.log(">>>>>",givenConfig.name, "tests");
	TestingStorage.getInstance().produceReport({
		numberOfPages : currentPage - 1,
		numberOfElementsOfInterest: arrayOfPages.length
	});
	console.log(">>>>> end of tests");
};

export default iterateThroughPages;