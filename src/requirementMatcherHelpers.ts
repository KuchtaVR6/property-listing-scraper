import {AttributeSelector, MustNotBePresentRequirement} from "./types/configTypes";
import {HTMLElement} from "node-html-parser";

export const getSelectorBasedOfSelector = (providedSelector : AttributeSelector | MustNotBePresentRequirement) => {
	if (providedSelector.isCustomSelector) {
		return providedSelector.customSelector;
	}
	let selector = "[" + providedSelector.attributeName;
	if(!providedSelector.exactMatch) {
		selector += "*";
	}
	selector += "=" + providedSelector.expectedValue + "]";
	return selector;
};

export const getElementsMatchingSelector = (element : HTMLElement, providedSelector : AttributeSelector) => {
	return element.querySelectorAll(getSelectorBasedOfSelector(providedSelector));
};