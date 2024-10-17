import {configs} from "../index";
import {SearchConfig} from "../types/configTypes";
import {getUserInputBoolean} from "../getUserInput";
import * as fs from "fs";

export default class CategoryStorage {
	private static instance : CategoryStorage | undefined = undefined;

	private seenIdentifiers : string[];

	public mapStorage : Map<string, {prefix : string, main : string}[]>;
	public static getInstance() : CategoryStorage {
		if(!this.instance) {
			try{
				const text = fs.readFileSync("saves/seenIdentifiers.txt","utf8");
				this.instance = new CategoryStorage(text.split("\n"));
			}
			catch {
				this.instance = new CategoryStorage([]);
			}
		}
		return this.instance;
	}

	private constructor(seenIdentifiers : string[]) {
		this.mapStorage = new Map();
		this.seenIdentifiers = seenIdentifiers;
	}

	public addToCategory(categoryName : string, identifier : {prefix : string, main : string}) {
		const initialValue = this.mapStorage.get(categoryName);
		if(initialValue) {
			this.mapStorage.set(categoryName, [...initialValue, identifier]);
		} else {
			this.mapStorage.set(categoryName, [identifier]);
		}
	}

	public hasBeenSeen(identifier : {prefix : string, main : string}) {
		return this.seenIdentifiers.includes(identifier.prefix + "|" + identifier.main);
	}

	private addAsHasBeenSeen(identifier : {prefix : string, main : string}) {
		this.seenIdentifiers.push(identifier.prefix + "|" + identifier.main);
	}

	private async saveHasBeenSeenFile() {
		fs.writeFileSync("saves/seenIdentifiers.txt", this.seenIdentifiers.join("\n"));
	}

	private getConfig (prefix : string) : SearchConfig {
		const config = configs.get(prefix);
		if(config) return config;
		else throw new Error("Config not found");
	}

	private async displayEntries(displaySeen?: boolean) {
		if (!displaySeen) {
			displaySeen = false;
		}

		const identifierCategoriesMap = new Map<string, string[]>(); // To track categories per identifier
		const categoryEntries = new Map<string, string[]>(); // To store entries per category
		const multicategoryIdentifiers = new Set<string>(); // To store identifiers that belong to multiple categories

		// Step 1: Populate categoryEntries and identifierCategoriesMap
		for (const categoryName of Array.from(this.mapStorage.keys())) {
			const identifiers = this.mapStorage.get(categoryName);
			if (identifiers) { // Check if identifiers exist
				for (const identifier of identifiers) {
					const identifierKey = `${identifier.prefix}|${identifier.main}`;
					if (!identifierCategoriesMap.has(identifierKey)) {
						identifierCategoriesMap.set(identifierKey, []);
					}

					// Add the category to the identifier's list
					identifierCategoriesMap.get(identifierKey)?.push(categoryName);

					// Add to the category entries
					if (!categoryEntries.has(categoryName)) {
						categoryEntries.set(categoryName, []);
					}
					categoryEntries.get(categoryName)?.push(identifierKey);
				}
			}
		}

		// Step 2: Prepare multicategory identifiers
		for (const identifier of Array.from(identifierCategoriesMap.keys())) {
			const categories = identifierCategoriesMap.get(identifier);
			if (categories && categories.length > 1) { // Check if categories exist
				multicategoryIdentifiers.add(identifier);
			}
		}

		// Step 3: Sort identifiers based on the number of categories
		const sortedIdentifiers = Array.from(identifierCategoriesMap.entries())
			.sort((a, b) => b[1].length - a[1].length); // Sort by number of categories descending

		// Step 4: Display multicategory entries first
		if (multicategoryIdentifiers.size > 0) {
			console.log("--------------------- Multicategory Entries ---------------------");
			for (const identifier of sortedIdentifiers) {
				const [identifierKey, categories] = identifier;
				const isSeen = this.hasBeenSeen({ prefix: identifierKey.split("|")[0], main: identifierKey.split("|")[1] });

				if (multicategoryIdentifiers.has(identifierKey) && (displaySeen === isSeen)) {
					// Display the combined heading for multicategory entries
					console.log(`Categories: ${categories.join("; ")}`);

					// Display using URL method
					const config = this.getConfig(identifierKey.split("|")[0]); // Get config based on prefix
					if (config.identifierOfElementOfInterest.getURIBasedOnID) {
						console.log(config.identifierOfElementOfInterest.getURIBasedOnID(identifierKey.split("|")[1]));
					} else {
						console.log(identifierKey); // Directly print the identifier
					}

					// Ask if the user wants to save as seen, only for new categories
					if (!displaySeen && !isSeen) {
						const answer = await getUserInputBoolean("Do you want to save this as seen?");
						if (answer) {
							this.addAsHasBeenSeen({ prefix: identifierKey.split("|")[0], main: identifierKey.split("|")[1] });
						}
					}
				}
			}
		}

		// Step 5: Display the main entries
		for (const categoryName of Array.from(categoryEntries.keys())) {
			const identifiers = categoryEntries.get(categoryName);
			if (identifiers) { // Check if identifiers exist
				for (const identifier of identifiers) {
					const isSeen = this.hasBeenSeen({ prefix: identifier.split("|")[0], main: identifier.split("|")[1] });

					if (!multicategoryIdentifiers.has(identifier) && (displaySeen === isSeen)) {
						const config = this.getConfig(identifier.split("|")[0]); // Get config based on prefix
						console.log("--------------------- " + categoryName + " ---------------------");

						// Display using URL method
						if (config.identifierOfElementOfInterest.getURIBasedOnID) {
							console.log(config.identifierOfElementOfInterest.getURIBasedOnID(identifier.split("|")[1]));
						} else {
							console.log(identifier); // Directly print the identifier
						}

						// Ask if the user wants to save as seen, only for new categories
						if (!displaySeen && !isSeen) {
							const answer = await getUserInputBoolean("Do you want to save this as seen?");
							if (answer) {
								this.addAsHasBeenSeen({ prefix: identifier.split("|")[0], main: identifier.split("|")[1] });
							}
						}
					}
				}
			}
		}

		// Save seen file if not displaying seen entries
		if (!displaySeen) {
			await this.saveHasBeenSeenFile();
		}
	}


	public async displayCategories() {
		console.log("===================== SEEN CATEGORIES ====================="); //allow

		await this.displayEntries(true);

		console.log("===================== NEW CATEGORIES ====================="); //allow

		await this.displayEntries();

		console.log("===================== END OF CATEGORIES ====================="); //allow

	}
}