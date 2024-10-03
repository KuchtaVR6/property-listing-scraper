import {AttributeSelector, ValueCheckerRequirement} from "../types/configTypes";
import {fetchHTML} from "../procuringTheHTML/fetchPages";
import {getElementsMatchingSelector} from "../requirementMatcherHelpers";
import {HTMLElement} from "node-html-parser";
import TestingStorage from "../testing/testingStorage";

const evaluateRequirement =
	(elementsToInspect : HTMLElement[], requirement : ValueCheckerRequirement<number>) : number =>
	{
		if (elementsToInspect.length == 1) {
			const element = elementsToInspect[0];
			const outcome = requirement.valueTest(element.textContent);
			if (outcome >= 0) {
				TestingStorage.getInstance().addFulfilledRequirement(requirement.name);
			} else {
				TestingStorage.getInstance().addFailedRequirement(requirement.name);
			}
			return outcome;
		} else if (elementsToInspect.length > 1) {
			throw new Error(`Too many matching elements found for deep requirement ${requirement.name}`);
		} else {
			throw new Error(`No matching elements found for deep requirement ${requirement.name}`);
		}
	};

const deepScoring =
	async (
		url: string,
		requirements: ValueCheckerRequirement<number>[],
		listingLoaded : AttributeSelector) : Promise<number> => {

		if (requirements.length > 0) {
			const listingDetailed = await fetchHTML(url, listingLoaded);

			let score = 0;

			for (const requirement of requirements) {
				const elementsToInspect = getElementsMatchingSelector(listingDetailed, requirement.selector);
				score += evaluateRequirement(elementsToInspect, requirement);
			}

			return score;
		} else {
			return 0;
		}
	};

export default deepScoring;