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

	private async displayEntries(displaySeen? : boolean) {
		if (!displaySeen) {
			displaySeen = false;
		}

		let firstDisplay = true;

		for(const [categoryName, identifiers] of Array.from(this.mapStorage)) {
			firstDisplay = true;
			for (const identifier of identifiers) {
				const isSeen = this.hasBeenSeen(identifier);
				if(isSeen? displaySeen : !displaySeen) {
					const config = this.getConfig(identifier.prefix);
					if (firstDisplay) {
						console.log("--------------------- " + categoryName + " ---------------------"); //allow
						firstDisplay = false;
					}

					if (config.identifierOfElementOfInterest.getURIBasedOnID) {
						console.log(config.identifierOfElementOfInterest.getURIBasedOnID(identifier.main)); //allow
					} else {
						console.log(identifier.prefix + "|" + identifier.main); //allow
					}

					if(!isSeen) {
						const answer = await getUserInputBoolean("Do you want to save this as seen?");
						if (answer) {
							this.addAsHasBeenSeen(identifier);
						}
					}
				}
			}
		}

		if(!displaySeen) {
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