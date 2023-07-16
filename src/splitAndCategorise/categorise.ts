import {HTMLElement} from "node-html-parser";
import {SearchConfig, ValueCheckerRequirement} from "../types/configTypes";
import {getElementsMatchingSelector} from "../requirementMatcherHelpers";
import TestingStorage from "../testing/testingStorage";
import CategoryStorage from "./categoryStorage";
import {seenIdsStorage} from "../procuringTheHTML/pageFlow";

export const extractElementId = (givenConfig : SearchConfig, element : HTMLElement) => {
	const idElements = getElementsMatchingSelector(element, givenConfig.identifierOfElementOfInterest.selector);
	return givenConfig.identifierOfElementOfInterest.extractor(idElements[0]);
};

const compareToRequirement = (elementsToInspect : HTMLElement[], requirement : ValueCheckerRequirement) => {
	for(const element of elementsToInspect) {
		if (requirement.booleanTest(element.textContent)) {
			TestingStorage.getInstance().addFulfilledRequirement(requirement.name);
			return true;
		}
	}
	TestingStorage.getInstance().addFailedRequirement(requirement.name);
	return false;
};

const checkSuitabilityToCategory = (element : HTMLElement, requirements : ValueCheckerRequirement[]) => {
	let answer = true;
	for (const requirement of requirements) {
		const elementsToInspect = getElementsMatchingSelector(element, requirement.selector);
		if (!compareToRequirement(elementsToInspect, requirement)) {
			answer = false;
		}
	}
	return answer;
};

export const categoriseElement = (givenConfig : SearchConfig, element : HTMLElement) => {
	const elementID = extractElementId(givenConfig, element);
	if(seenIdsStorage.includes(elementID)) {
		return;
	}
	seenIdsStorage.push(elementID);
	for (const category of givenConfig.categories) {
		if(checkSuitabilityToCategory(element, category.requirements)) {
			CategoryStorage.getInstance().addToCategory(category.name, {
				prefix: givenConfig.name,
				main: elementID
			});
		}
	}
};