import {HTMLElement} from "node-html-parser";
import {
	mustNotBePresentRequirement,
	SearchConfig,
	ValueCheckerRequirement
} from "../types/configTypes";
import {getElementsMatchingSelector} from "../requirementMatcherHelpers";
import TestingStorage from "../testing/testingStorage";
import CategoryStorage from "./categoryStorage";
import {seenIdsStorage} from "../procuringTheHTML/pageFlow";
import {stopOnFirstSeenAdvert} from "../configsToInclude";
import deepScoring from "./deepScoring";

export const extractElementId = (givenConfig : SearchConfig, element : HTMLElement) => {
	if(givenConfig.identifierOfElementOfInterest.selector) {
		const idElements = getElementsMatchingSelector(element, givenConfig.identifierOfElementOfInterest.selector);
		return givenConfig.identifierOfElementOfInterest.extractor(idElements[0]);
	} else {
		return givenConfig.identifierOfElementOfInterest.extractor(element);
	}
};

const compareToRequirement = (elementsToInspect : HTMLElement[], requirement : ValueCheckerRequirement<boolean>) => {
	for(const element of elementsToInspect) {
		if (requirement.valueTest(element.textContent)) {
			TestingStorage.getInstance().addFulfilledRequirement(requirement.name);
			return true;
		}
	}
	TestingStorage.getInstance().addFailedRequirement(requirement.name);
	return false;
};

const shallowCheckSuitabilityToCategory = (
	element : HTMLElement,
	requirements : ValueCheckerRequirement<boolean>[],
	mustNotBePresentRequirements? : mustNotBePresentRequirement[]
) => {
	let answer = true;
	for (const requirement of requirements) {
		const elementsToInspect = getElementsMatchingSelector(element, requirement.selector);
		if (!compareToRequirement(elementsToInspect, requirement)) {
			answer = false;
		}
	}
	if(mustNotBePresentRequirements) {
		for (const mustNotBePresentRequirement of mustNotBePresentRequirements) {
			const elementsToInspect = getElementsMatchingSelector(element, mustNotBePresentRequirement);
			if (elementsToInspect.length > 0) {
				TestingStorage.getInstance().addFailedRequirement(mustNotBePresentRequirement.name);
				answer = false;
			} else {
				TestingStorage.getInstance().addFulfilledRequirement(mustNotBePresentRequirement.name);
			}
		}
	}

	return answer;
};

export const categoriseElementAndReturnIfProceed =
	async (givenConfig : SearchConfig, element : HTMLElement): Promise<boolean> => {
		const elementID = extractElementId(givenConfig, element);
		const categoryStorageInstance = CategoryStorage.getInstance();
		if(seenIdsStorage.includes(elementID)) {
			return true;
		}
		if(stopOnFirstSeenAdvert) {
			if(categoryStorageInstance.hasBeenSeen({prefix: givenConfig.name, main: elementID})) {
				return false;
			}
		}
		seenIdsStorage.push(elementID);
		for (const category of givenConfig.categories) {
			if(shallowCheckSuitabilityToCategory(element, category.shallowRequirements, category.mustNotBePresentRequirements)) {
				const score = await deepScoring(
					givenConfig.identifierOfElementOfInterest.getURIBasedOnID(elementID),
					category.deepScoreMethods,
					givenConfig.requireToEstablishListingAsLoaded
				);
				if (score >= 0) {
					CategoryStorage.getInstance().addToCategory(category.name, {
						prefix: givenConfig.name,
						main: elementID
					});
				}
			}
		}
		return true;
	};