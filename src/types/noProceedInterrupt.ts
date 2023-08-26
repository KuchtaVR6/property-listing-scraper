export const noProceedInterruptMessage = "Program instructed to go to finish scanning.";
class NoProceedInterrupt extends Error {
	constructor() {
		super(noProceedInterruptMessage);
	}
}

export default NoProceedInterrupt;