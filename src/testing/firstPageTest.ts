import {HTMLElement} from "node-html-parser";
import {getElementsMatchingSelector} from "../requirementMatcherHelpers";
import TestingStorage from "./testingStorage";
import {SearchConfig} from "../types/configTypes";

export const findFirstNumber = (input: string, replaceErrorWithNan? : true): number => {

	if (input.includes("javascript:alert")) {
		return NaN;
	}

	const regex = /[0-9]+/;
	const result = input.replace(",","").match(regex);

	if (result !== null) {
		return parseInt(result[0]);
	} else {
		if(replaceErrorWithNan) {
			return NaN;
		}
		throw new Error("findFirstNumber: Failed to find a suitable value in " + input);
	}
};

const extractLastNumericalValueOrOne = (elements : HTMLElement[]) : number => {
	const lastElement = elements[elements.length - 1];
	if (!lastElement) {
		return 1;
	}
	const text = lastElement.textContent;
	return findFirstNumber(text);
};

export const setTestingInformationFromFirstPage = (givenConfig : SearchConfig, element : HTMLElement) => {
	if(givenConfig.optional_tests?.expectedNumberOfPages) {
		const elements = getElementsMatchingSelector(element, givenConfig.optional_tests.expectedNumberOfPages);
		TestingStorage.getInstance().setExpectedNumberOfPages(extractLastNumericalValueOrOne(elements));
	}
	if(givenConfig.optional_tests?.expectedNumberOfElementsOfInterest) {
		const elements = getElementsMatchingSelector(element, givenConfig.optional_tests.expectedNumberOfElementsOfInterest);
		TestingStorage.getInstance().setExpectedNumberOfElementsOfInterest(extractLastNumericalValueOrOne(elements));
	}
};