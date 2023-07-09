import {configs} from "../index";
import {SearchConfig} from "../types/configTypes";

export default class CategoryStorage {
	private static instance : CategoryStorage | undefined = undefined;

	public mapStorage : Map<string, {prefix : string, main : string}[]>;
	public static getInstance() : CategoryStorage {
		if(!this.instance) {
			this.instance = new CategoryStorage();
		}
		return this.instance;
	}

	private constructor() {
		this.mapStorage = new Map();
	}

	public addToCategory(categoryName : string, identifier : {prefix : string, main : string}) {
		const initialValue = this.mapStorage.get(categoryName);
		if(initialValue) {
			this.mapStorage.set(categoryName, [...initialValue, identifier]);
		} else {
			this.mapStorage.set(categoryName, [identifier]);
		}
	}

	private hasBeenSeen(identifier : {prefix : string, main : string}) {
		return false;
	}

	private getConfig (prefix : string) : SearchConfig {
		const config = configs.get(prefix);
		if(config) return config;
		else throw new Error("Config not found");
	}

	private displayEntries(seen? : boolean) {
		if (!seen) {
			seen = false;
		}

		let firstDisplay = true;

		for(const [categoryName, identifiers] of Array.from(this.mapStorage)) {
			firstDisplay = true;
			for (const identifier of identifiers) {
				if(this.hasBeenSeen(identifier)? seen : !seen) {
					const config = this.getConfig(identifier.prefix);
					if (firstDisplay) {
						console.log("--------------------- " + categoryName + " ---------------------");
						firstDisplay = false;
					}
					if (config.identifierOfElementOfInterest.getURIBasedOnID) {
						console.log(config.identifierOfElementOfInterest.getURIBasedOnID(identifier.main));
					} else {
						console.log(identifier.prefix + "|" + identifier.main);
					}
				}
			}
		}
	}

	public displayCategories() {
		console.log("===================== SEEN CATEGORIES =====================");

		this.displayEntries(true);

		console.log("===================== NEW CATEGORIES =====================");

		this.displayEntries();

	}
}