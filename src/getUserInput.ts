import readline from "readline/promises";

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const getUserInput = async (question : string) => {
	const answer = await rl.question(question);
	return answer;
};

export const getUserInputBoolean = async (question : string) => {
	let answer = "";
	let extractedFirstLetter = answer.slice(0,1).toLowerCase();
	while (extractedFirstLetter !== "y" && extractedFirstLetter !== "n") {
		answer = await getUserInput("[?] " + question + " [y/n] ");
		extractedFirstLetter = answer.slice(0,1).toLowerCase();
		if (extractedFirstLetter==="y") {
			return true;
		} else if (extractedFirstLetter==="n") {
			return false;
		} else {
			console.log("Invalid answer, please try again."); //allow
		}
	}
	throw new Error("Incorrect input, function terminated");
};

export default getUserInput;