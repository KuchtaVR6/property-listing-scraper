import * as fs from "fs";
import {getUserInputBoolean} from "../getUserInput";

export default class TestingStorage {
	private expectedNumberOfPages : number | undefined;
	private expectedNumberOfElementsOfInterest : number | undefined;
	private readonly requirementsFulfilledRegistry : Map<string, [number, number]>;

	private static instance : TestingStorage | undefined = undefined;

	public static getInstance() : TestingStorage {
		if(!this.instance) {
			this.instance = new TestingStorage();
		}
		return this.instance;
	}

	public static reset() {
		this.instance = new TestingStorage();
	}

	private constructor() {
		this.expectedNumberOfPages = undefined;
		this.expectedNumberOfElementsOfInterest = undefined;
		this.requirementsFulfilledRegistry = new Map();
	}

	public setExpectedNumberOfPages (expectedNumberOfPages : number) {
		this.expectedNumberOfPages = expectedNumberOfPages;
	}

	public setExpectedNumberOfElementsOfInterest (expectedNumberOfElementsOfInterest : number) {
		this.expectedNumberOfElementsOfInterest = expectedNumberOfElementsOfInterest;
	}

	public addFulfilledRequirement (requirementName : string) {
		const initialValue = this.requirementsFulfilledRegistry.get(requirementName);
		if (initialValue) {
			this.requirementsFulfilledRegistry.set(
				requirementName,
				[initialValue[0] + 1, initialValue[1] + 1]);
		} else {
			this.requirementsFulfilledRegistry.set(
				requirementName,
				[1,1]);
		}
	}

	public addFailedRequirement (requirementName : string) {
		const initialValue = this.requirementsFulfilledRegistry.get(requirementName);
		if (initialValue) {
			this.requirementsFulfilledRegistry.set(
				requirementName,
				[initialValue[0], initialValue[1] + 1]);
		} else {
			this.requirementsFulfilledRegistry.set(
				requirementName,
				[0,1]);
		}
	}

	public async produceReport (encountered : {
		numberOfPages : number,
		numberOfElementsOfInterest : number
	}, configName : string) {
		const testsArray : {
			test: string,
			expected: number | undefined,
			encountered : number
		}[] = [];

		let warned = false;
		console.log("Testing " + configName + " in progress...");

		if(this.expectedNumberOfPages) {
			const difference = Math.abs(this.expectedNumberOfPages - encountered.numberOfPages);
			if(difference > 0) {
				warned = true;
				console.warn("[!] Number of index pages does not match the expected by " + difference +
					" pages. Expected: " + this.expectedNumberOfPages);
			}

			testsArray.push(
				{
					test: "numberOfPages",
					expected: this.expectedNumberOfPages,
					encountered: encountered.numberOfPages
				}
			);
		} else {
			testsArray.push(
				{
					test: "numberOfPages",
					expected: undefined,
					encountered: encountered.numberOfPages
				}
			);
		}

		if(this.expectedNumberOfElementsOfInterest) {
			const difference =
				Math.abs(this.expectedNumberOfElementsOfInterest - encountered.numberOfElementsOfInterest);
			if(difference > 0) {
				warned = true;
				console.warn("[!] Number of elements of interest does not match the expected by "
					+ difference + " elements. Expected: " + this.expectedNumberOfElementsOfInterest);
			}

			testsArray.push(
				{
					test: "numberOfElementsOfInterest",
					expected: this.expectedNumberOfElementsOfInterest,
					encountered: encountered.numberOfElementsOfInterest
				}
			);
		} else {
			testsArray.push(
				{
					test: "numberOfElementsOfInterest",
					expected: undefined,
					encountered: encountered.numberOfElementsOfInterest
				}
			);
		}

		const requirementTestsArray : string[] = [];

		for(const [requirementName, [passed, tried]] of Array.from(this.requirementsFulfilledRegistry)) {
			const rate = Math.floor((passed / tried) * 100);
			const multipleCheckDivider = encountered.numberOfElementsOfInterest / tried;
			if (rate <= 20) {
				warned = true;
				if (rate <= 5) {
					console.error("[!] '" + requirementName + "' has a very low pass rate of " + rate +
						"%. Make sure it is defined correctly.");
				} else {
					console.warn("[!] '" + requirementName + "' has a low pass rate of " + rate +
						"%. Check if it is defined correctly.");
				}
			}

			requirementTestsArray.push(
				"name: " + requirementName + "\n" +
				"fulfilled: " + Math.floor(passed * multipleCheckDivider) + "\n" +
				"tested: " + Math.floor(tried * multipleCheckDivider) + "\n" +
				"rate: " + Math.floor((passed / tried) * 100) + "%"
			);
		}

		let testsArrayString = "";
		for(const test of testsArray) {
			testsArrayString +=
				"====BAS===" + "\n" +
				"test: " + test.test + "\n" +
				"encountered: " + test.encountered + "\n" +
				"expected: " + test.expected + "\n";
		}

		fs.appendFileSync("debug-output/tests.txt",
			"\n\n\n>>>>>>>>>>>>>>>>>>>> " + configName
			+ " on " + (new Date())
			+ " >>>>>>>>>>>>>>>>>>>> \n\n" +
			testsArrayString + "\n====REQ====\n" +
			requirementTestsArray.join("\n====REQ====\n") + "\n"
		);

		console.log("Testing " + configName + " finished.");

		if(warned) {
			if (await getUserInputBoolean("Would you like to proceed after reading these warnings?")) {
				return;
			} else {
				throw new Error("Testing ended with warnings that have not been dismissed.");
			}
		}
	}
}