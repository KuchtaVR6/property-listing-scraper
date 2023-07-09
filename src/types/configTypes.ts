export interface AttributeRequirement {
    attributeName: string,
    expectedValue: string,
    exactMatch: boolean
}

export interface SearchConfig {
    url: string,
    subDirectory: string,
    getParams: {parameter: string, value: string}[],
    page_param: string,
    requireToEstablishAsLoaded: AttributeRequirement,
    requireToStartParsing: AttributeRequirement[]
}
