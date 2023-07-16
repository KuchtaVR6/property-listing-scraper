import {HTMLElement} from "node-html-parser";
import {getElementsMatchingSelector} from "../requirementMatcherHelpers";
import {fetchWebsiteHTML} from "./fetchPages";
import {setTestingInformationFromFirstPage} from "../testing/firstPageTest";
import TestingStorage from "../testing/testingStorage";
import {EndOfPagesIndicator, SearchConfig} from "../types/configTypes";
import {extractElementId} from "../splitAndCategorise/categorise";

export const seenIdsStorage : string[] = [];

const getFullURLBasedOnConfigWithPageNumber = (givenConfig : SearchConfig, pageNumber : number) => {
	let url = givenConfig.url + givenConfig.subDirectory + "?";

	for (const param of givenConfig.getParams) {
		url += param.parameter + "=" + param.value + "&";
	}

	url += givenConfig.page_param + "=" + pageNumber;

	return url;
};

const checkIfDocumentMeetsParsingRequirements = (givenConfig : SearchConfig, element : HTMLElement) => {
	switch (givenConfig.endOfPagesIndicator) {
		case EndOfPagesIndicator.NoPointsOfInterestPresent: {
			if(getElementsMatchingSelector(element, givenConfig.identifierOfElementOfInterest.selector).length === 0) {
				return false;
			}
			return true;
		}
		case EndOfPagesIndicator.AllPointOfInterestIDsRepeated: {
			const elementsInteresting = getElementsMatchingSelector(element, givenConfig.selectElementsOfInterest);
			for (const element of elementsInteresting) {
				if(!seenIdsStorage.includes(extractElementId(givenConfig,element))) {
					return true;
				}
			}
			return false;
		}

	}

};

const iterateThroughPages = async (
	givenConfig : SearchConfig,
	processElement : (element : HTMLElement) => HTMLElement[],
	limit? : number) => {

	let currentPage = (givenConfig.page_step? 0 : 1);
	let arrayOfPages : HTMLElement[]= [];
	const pageStep = (givenConfig.page_step? givenConfig.page_step : 1);

	if (!limit) {
		limit = 1000;
	}

	limit = limit * pageStep;

	while (currentPage <= limit) {

		const document = await fetchWebsiteHTML(givenConfig,
			getFullURLBasedOnConfigWithPageNumber(givenConfig, currentPage));

		if([0,1].includes(currentPage) && givenConfig.optional_tests) {
			setTestingInformationFromFirstPage(givenConfig, document);
		}

		if (checkIfDocumentMeetsParsingRequirements(givenConfig, document)) {
			arrayOfPages = [...arrayOfPages, ...processElement(document)];
		} else {
			break;
		}

		currentPage += pageStep;
	}

	if(!givenConfig.page_step) {
		currentPage -= pageStep;
	}

	await TestingStorage.getInstance().produceReport({
		numberOfPages : Math.ceil(currentPage/pageStep),
		numberOfElementsOfInterest: arrayOfPages.length,
	}, givenConfig.name);
};

export default iterateThroughPages;