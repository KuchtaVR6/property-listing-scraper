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

	public produceReport (encountered : {
		numberOfPages : number,
		numberOfElementsOfInterest : number
	}) {
		const testsArray : {
			test: string,
			expected: number | undefined,
			encountered : number
		}[] = [];

		let passed = 0;
		let failed = 0;
		let omitted = 0;

		if(this.expectedNumberOfPages) {
			const testOutcome = this.expectedNumberOfPages === encountered.numberOfPages;
			if(testOutcome) passed+=1;
			else failed+=1;

			testsArray.push(
				{
					test: "numberOfPages",
					expected: this.expectedNumberOfPages,
					encountered: encountered.numberOfPages
				}
			);
		} else {
			omitted+=1;
			testsArray.push(
				{
					test: "numberOfPages",
					expected: undefined,
					encountered: encountered.numberOfPages
				}
			);
		}

		if(this.expectedNumberOfElementsOfInterest) {
			const testOutcome = this.expectedNumberOfElementsOfInterest === encountered.numberOfElementsOfInterest;
			if(testOutcome) passed+=1;
			else failed+=1;

			testsArray.push(
				{
					test: "numberOfElementsOfInterest",
					expected: this.expectedNumberOfElementsOfInterest,
					encountered: encountered.numberOfElementsOfInterest
				}
			);
		} else {
			omitted+=1;
			testsArray.push(
				{
					test: "numberOfElementsOfInterest",
					expected: undefined,
					encountered: encountered.numberOfElementsOfInterest
				}
			);
		}

		const testResultsArray = [{Passed: passed, Failed: failed, Omitted: omitted}];

		const requirementTestsArray : { name: string, fulfilled: number, tested: number, rate : string}[] = [];

		for(const [requirementName, [passed, tried]] of Array.from(this.requirementsFulfilledRegistry)) {
			const rate = Math.floor((passed / tried) * 100);
			const multipleCheckDivider = encountered.numberOfElementsOfInterest / tried;
			if (rate <= 10) {
				console.warn(requirementName,
					"has low pass rate of ",
					rate,
					"%. Check if it is defined correctly.");
			}

			requirementTestsArray.push({
				name: requirementName,
				fulfilled: passed * multipleCheckDivider,
				tested: tried * multipleCheckDivider,
				rate: Math.floor((passed / tried) * 100) + "%"
			});
		}


		console.table(testResultsArray);
		console.log("Requirements statistics:");
		console.table(requirementTestsArray);
	}
}