import {HTMLElement} from "node-html-parser";

export type SimpleSelector = {
    attributeName: string,
    expectedValue: string,
    exactMatch: boolean,
    isCustomSelector: false,
}

export type CustomSelector = {
    customSelector: string,
    isCustomSelector: true,
}

export type AttributeSelector = SimpleSelector | CustomSelector

export type ValueCheckerRequirement<N> = {
    name: string,
    selector: AttributeSelector,
    valueTest: (input : string) => N
}

export type MustNotBePresentRequirement = AttributeSelector & {name : string}

export type Category = {
    name : string,
    shallowRequirements : ValueCheckerRequirement<boolean>[];
    mustNotBePresentRequirements? : MustNotBePresentRequirement[];
    deepScoreMethods: ValueCheckerRequirement<number>[];
}

export enum EndOfPagesIndicator {
    NoPointsOfInterestPresent,
    AllPointOfInterestIDsRepeated,
    EndOfListElement,
    DidNotSeeNextPageElement,
}

export type NormalDistributionArgs = {
    mean: number,
    std: number
}

export interface SearchConfig {
    name: string
    url: string,
    subDirectory: string,
    getParams: {parameter: string, value: string}[],
    page_param: string,
    page_step?: number,
    requireToEstablishAsLoaded: AttributeSelector,
    requireToEstablishListingAsLoaded: AttributeSelector,
    selectElementsOfInterest: AttributeSelector,
    identifierOfElementOfInterest: {
        selector?: AttributeSelector,
        extractor: (element : HTMLElement) => string,
        getURIBasedOnID: (id : string) => string,
    }
    minDelayConfig?: NormalDistributionArgs,
    endOfPagesIndicator: EndOfPagesIndicator,
    endOfPagesElement?: AttributeSelector,
    optional_tests?: {
        // only run on the first page
        // both extract the numerical value from the last matching element.
        expectedNumberOfElementsOfInterest? : AttributeSelector,
        expectedNumberOfPages? : AttributeSelector,
    }
    categories: Category[]
}
