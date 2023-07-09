import {AttributeRequirement} from "./types/configTypes";
import {HTMLElement} from "node-html-parser";

export const getSelectorBasedOfRequirement = (requirement : AttributeRequirement) => {
	let selector = "[" + requirement.attributeName;
	if(!requirement.exactMatch) {
		selector += "*";
	}
	selector += "=" + requirement.expectedValue + "]";
	return selector;
};

export const getElementsMatchingRequirement = (element : HTMLElement, requirement : AttributeRequirement) => {
	return element.querySelectorAll(getSelectorBasedOfRequirement(requirement));
};