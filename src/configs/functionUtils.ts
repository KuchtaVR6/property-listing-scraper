const billsIncludedInDescription = (input : string) => {
	const lowerInput = input.toLowerCase();

	// Check if input contains "inc" and "bills"
	if (lowerInput.includes("inc") && lowerInput.includes("bills")) {
		// Check if input contains any phrases indicating exclusion
		if (lowerInput.includes("bills not inc") || lowerInput.includes("no bills inc") || lowerInput.includes("no bill inc")) {
			return -Infinity;
		}
		// If the exclusion phrases are not present, return 0
		return 0;
	}
	// If "inc" or "bills" is not present, return -Infinity
	return -Infinity;
};

export default billsIncludedInDescription;