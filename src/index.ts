import iterateThroughPages from "./procuringTheHTML/pageFlow";
import {splitElementsOfInterest} from "./splitAndCategorise/split";
import {categoriseElementAndReturnIfProceed} from "./splitAndCategorise/categorise";
import CategoryStorage from "./splitAndCategorise/categoryStorage";
import {SearchConfig} from "./types/configTypes";
import TestingStorage from "./testing/testingStorage";
import {getUserInputBoolean} from "./getUserInput";
import GumtreeRentSearchConfig from "./configs/gumtree/gumtree-rent/gumtree-rentSearchConfig";
import GumtreeShareSearchConfig from "./configs/gumtree/gumtree-share/gumtree-shareSearchConfig";
import RightMoveSearchConfig from "./configs/right-move/right-moveSearchConfig";
import ZooplaSearchConfig from "./configs/zoopla/zooplaSearchConfig";
import SpareRoomSearchConfig from "./configs/spare-room/spare-roomSearchConfig";
import NoProceedInterrupt, {noProceedInterruptMessage} from "./types/noProceedInterrupt";

const possibleConfigs = [
	GumtreeRentSearchConfig,
	GumtreeShareSearchConfig,
	RightMoveSearchConfig,
	SpareRoomSearchConfig,
	ZooplaSearchConfig
];
export const configs = new Map<string, SearchConfig>();

export let stopOnFirstSeenAdvert = false;

const main = async () => {
	for(const possibleConfig of possibleConfigs) {
		if(await getUserInputBoolean("Would you like to include "+possibleConfig.name+" in the search?"))
			configs.set(possibleConfig.name, possibleConfig);
	}
	stopOnFirstSeenAdvert = await getUserInputBoolean("Would you like to include stop searching as soon as first seen add is encountered in the search?");

	if(configs.size === 0)
		return;

	for(const config of Array.from(configs.values())) {
		TestingStorage.reset();
		try {
			await iterateThroughPages(
				config,
				async (element) => {
					const elementsOfInterest = splitElementsOfInterest(config, element);
					for (const interestingElement of elementsOfInterest) {
						const proceedFlag = await categoriseElementAndReturnIfProceed(config, interestingElement);
						if (!proceedFlag) {
							throw new NoProceedInterrupt;
						}
					}
					return elementsOfInterest;
				},10); //todo temp for testing, should be 100
		} catch (e) {
			if ((e as NoProceedInterrupt).message === noProceedInterruptMessage) {
				console.log("HALT! Stopped On First Saved As Seen");
			} else {
				throw e;
			}
		}

	}
	await CategoryStorage.getInstance().displayCategories();

	console.log("Program finished...");
};

main();


