import * as fs from "fs";

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

		if(this.expectedNumberOfPages) {
			const difference = Math.abs(this.expectedNumberOfPages - encountered.numberOfPages);
			if(difference > 0) {
				console.warn("⚠️ Number of index pages does not match the expected value. " +
					"Encountered" + encountered.numberOfPages + " pages. Expected: " + this.expectedNumberOfPages);
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
			const multipleCheckDivider = Math.min(encountered.numberOfElementsOfInterest / tried, 1);
			if (rate <= 20) {
				if (rate <= 5) {
					console.error("🚨 " + requirementName + "' has a VERY LOW pass rate of " + rate +
						"%. Make sure it is defined correctly.");
				} else {
					console.warn("⚠️ " + requirementName + "' has a LOW pass rate of " + rate +
						"%. Check if it is defined correctly.");
				}
			}

			requirementTestsArray.push(
				"	name: " + requirementName + "\n" +
				"	fulfilled: " + Math.floor(passed * multipleCheckDivider) + "\n" +
				"	tested: " + Math.floor(tried * multipleCheckDivider) + "\n" +
				"	rate: " + Math.floor((passed / tried) * 100) + "%"
			);
		}

		let testsArrayString = "";
		for(const test of testsArray) {
			testsArrayString +=
				"type: BAS\n" +
				"	test: " + test.test + "\n" +
				"	encountered: " + test.encountered + "\n" +
				"	expected: " + test.expected + "\n";
		}

		fs.appendFileSync("debug-output/tests.txt",
			"\n\n\n>>> " + configName
			+ " on " + (new Date())
			+ " >>> \n\n" +
			testsArrayString + "\ntype: REQ\n" +
			requirementTestsArray.join("\ntype: REQ\n") + "\n" +
			"\n\n<<< END <<<\n\n"
		);

		console.log("Testing " + configName + " finished.");
	}
}