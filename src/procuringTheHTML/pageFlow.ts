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

const correctDocumentTermination = (givenConfig : SearchConfig, element : HTMLElement) : {
	element: HTMLElement | null,
	nextPage: boolean
} => {
	switch (givenConfig.endOfPagesIndicator) {
		case EndOfPagesIndicator.NoPointsOfInterestPresent: {
			if (getElementsMatchingSelector(element, givenConfig.selectElementsOfInterest).length !== 0) {
				return {
					element: element,
					nextPage: true
				};
			}
			return {
				element: null,
				nextPage: false
			};

		}
		case EndOfPagesIndicator.AllPointOfInterestIDsRepeated: {
			const elementsInteresting = getElementsMatchingSelector(element, givenConfig.selectElementsOfInterest);
			for (const element of elementsInteresting) {
				if(!seenIdsStorage.includes(extractElementId(givenConfig,element))) {
					return {
						element: element,
						nextPage: true
					};
				}
			}
			return {
				element: null,
				nextPage: false
			};
		}
		case EndOfPagesIndicator.EndOfListElement: {
			if (givenConfig.endOfPagesElement) {
				// Find the end of pages element in the document
				const endElement = getElementsMatchingSelector(element, givenConfig.endOfPagesElement)[0];

				if (!endElement) {
					return {
						element: element,
						nextPage: true
					};
				}

				// Remove all siblings after the end of pages element
				let sibling = endElement.nextElementSibling;

				// Loop through and remove all subsequent siblings
				while (sibling) {
					const nextSibling = sibling.nextElementSibling;
					sibling.remove();  // Remove the sibling
					sibling = nextSibling;  // Move to the next sibling
				}

				return {
					element: element,
					nextPage: false
				};
			} else {
				throw new Error("endOfPagesElement must be defined for EndOfListElement.");
			}
		}
		case EndOfPagesIndicator.DidNotSeeNextPageElement: {
			if (givenConfig.endOfPagesElement) {
				if (getElementsMatchingSelector(element, givenConfig.endOfPagesElement).length !== 0) {
					return {
						element: element,
						nextPage: true
					};
				}
			}
			else {
				throw new Error("endOfPagesElement must be defined for DidNotSeeNextPageElement.");
			}
			return {
				element: element,
				nextPage: false
			};
		}

	}

};

const iterateThroughPages = async (
	givenConfig : SearchConfig,
	processElement : (element : HTMLElement) => HTMLElement[],
	limit? : number) => {

	const beginSeenStorageSize = seenIdsStorage.length;

	let currentPage = (givenConfig.page_step? 0 : 1);
	let arrayOfPages : HTMLElement[]= [];
	const pageStep = (givenConfig.page_step? givenConfig.page_step : 1);

	if (!limit) {
		limit = 1000;
	}

	limit = limit * pageStep;

	let seeNextPage = true;

	while (currentPage <= limit && seeNextPage) {

		const document = await fetchWebsiteHTML(givenConfig,
			getFullURLBasedOnConfigWithPageNumber(givenConfig, currentPage));

		if([0,1].includes(currentPage) && givenConfig.optional_tests) {
			setTestingInformationFromFirstPage(givenConfig, document);
		}

		const terminated_document = correctDocumentTermination(givenConfig, document);
		seeNextPage = terminated_document.nextPage;

		if (terminated_document.element) {
			arrayOfPages = [...arrayOfPages, ...processElement(terminated_document.element)];
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
		numberOfElementsOfInterest: seenIdsStorage.length - beginSeenStorageSize,
	}, givenConfig.name);
};

export default iterateThroughPages;