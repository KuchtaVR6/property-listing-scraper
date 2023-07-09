import iterateThroughPages from "./procuringTheHTML/pageFlow";
import {splitElementsOfInterest} from "./splitAndCategorise/split";
import {categoriseElement} from "./splitAndCategorise/categorise";
import CategoryStorage from "./splitAndCategorise/categoryStorage";
import ZooplaSearchConfig from "./configs/zoopla/zooplaSearchConfig";
import {SearchConfig} from "./types/configTypes";
import TestingStorage from "./testing/testingStorage";

export const configs = new Map<string, SearchConfig>();

configs.set(ZooplaSearchConfig.name, ZooplaSearchConfig);

for(const config of Array.from(configs.values())) {
	TestingStorage.reset();
	iterateThroughPages(
		config,
		(element) => {
			const elementsOfInterest = splitElementsOfInterest(config, element);
			for (const interestingElement of elementsOfInterest) {
				categoriseElement(config, interestingElement);
			}
			return elementsOfInterest;
		},
		3).then(() => {
		CategoryStorage.getInstance().displayCategories();
		console.log("Program finished.");
	});
}

