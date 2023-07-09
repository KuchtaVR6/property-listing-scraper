import {HTMLElement} from "node-html-parser";
import {getElementsMatchingSelector} from "../requirementMatcherHelpers";
import {SearchConfig} from "../types/configTypes";

export const splitElementsOfInterest = (givenConfig : SearchConfig, element : HTMLElement) => {
	return getElementsMatchingSelector(element, givenConfig.selectElementsOfInterest);
};