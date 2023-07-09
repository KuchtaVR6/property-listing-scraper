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

export type ValueCheckerRequirement = {
    name: string,
    selector: AttributeSelector,
    booleanTest: (input : string) => boolean
}

export type Category = {
    name : string,
    requirements : ValueCheckerRequirement[];
}

export interface SearchConfig {
    name: string
    url: string,
    subDirectory: string,
    getParams: {parameter: string, value: string}[],
    page_param: string,
    requireToEstablishAsLoaded: AttributeSelector,
    requireToStartParsing: AttributeSelector[],
    selectElementsOfInterest: AttributeSelector,
    identifierOfElementOfInterest: {
        selector: AttributeSelector,
        extractor: (element : HTMLElement) => string,
        getURIBasedOnID?: (id : string) => string,
    }
    optional_tests?: {
        // only run on the first page
        // both extract the numerical value from the last matching element.
        expectedNumberOfElementsOfInterest? : AttributeSelector,
        expectedNumberOfPages? : AttributeSelector,
    }

    categories: Category[]
}
