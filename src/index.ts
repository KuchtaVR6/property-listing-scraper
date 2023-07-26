import iterateThroughPages from "./procuringTheHTML/pageFlow";
import {splitElementsOfInterest} from "./splitAndCategorise/split";
import {categoriseElement} from "./splitAndCategorise/categorise";
import CategoryStorage from "./splitAndCategorise/categoryStorage";
import {SearchConfig} from "./types/configTypes";
import TestingStorage from "./testing/testingStorage";
import {getUserInputBoolean} from "./getUserInput";
import GumtreeRentSearchConfig from "./configs/gumtree/gumtree-rent/gumtree-rentSearchConfig";
import GumtreeShareSearchConfig from "./configs/gumtree/gumtree-share/gumtree-shareSearchConfig";
import RightMoveSearchConfig from "./configs/right-move/right-moveSearchConfig";
import ZooplaSearchConfig from "./configs/zoopla/zooplaSearchConfig";
import SpareRoomSearchConfig from "./configs/spare-room/spare-roomSearchConfig";

const possibleConfigs = [
	GumtreeRentSearchConfig,
	GumtreeShareSearchConfig,
	RightMoveSearchConfig,
	SpareRoomSearchConfig,
	ZooplaSearchConfig
];
export const configs = new Map<string, SearchConfig>();

const main = async () => {
	for(const possibleConfig of possibleConfigs) {
		if(await getUserInputBoolean("Would you like to include "+possibleConfig.name+" in the search?"))
			configs.set(possibleConfig.name, possibleConfig);
	}

	if(configs.size === 0)
		return;

	for(const config of Array.from(configs.values())) {
		TestingStorage.reset();
		await iterateThroughPages(
			config,
			(element) => {
				const elementsOfInterest = splitElementsOfInterest(config, element);
				for (const interestingElement of elementsOfInterest) {
					categoriseElement(config, interestingElement);
				}
				return elementsOfInterest;
			},40);
	}
	await CategoryStorage.getInstance().displayCategories();

	console.log("Program finished...");
};

main();


