import {HTMLElement} from "node-html-parser";
import {getElementsMatchingSelector} from "../requirementMatcherHelpers";
import TestingStorage from "./testingStorage";
import {SearchConfig} from "../types/configTypes";

export const findFirstNumber = (input: string): number => {

	const regex = /[0-9]+/;
	const result = input.match(regex);

	if (result !== null) {
		return parseInt(result[0]);
	} else {
		throw new Error("TESTING VALUES: Failed to find a suitable value.");
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