import readline from "readline/promises";

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const getUserInput = async (question : string) => {
	return await rl.question(question);
};

export const getUserInputBoolean = async (question : string) => {

	const ans_valid = (extractedFirstLetter : string) => {
		return extractedFirstLetter === "y" || extractedFirstLetter === "n";};

	let answer = "";
	let extractedFirstLetter = answer.slice(0,1).toLowerCase();
	while (!ans_valid(extractedFirstLetter)) {
		answer = await getUserInput("[?] " + question + " [y/n] ");
		extractedFirstLetter = answer.slice(0,1).toLowerCase();
		if (ans_valid(extractedFirstLetter)) {
			return extractedFirstLetter==="y";
		} else {
			console.log("Invalid answer, please try again.");
		}
	}
	throw new Error("Incorrect input, function terminated");
};

export default getUserInput;