const configsToInclude : Map<string, boolean> = new Map([
	["gumtree-rent", false],
	["gumtree-share", false],
	["right-move-for-rent", false],
	["spare-room", false],
	["zoopla-for-rent", true],
]);

export const stopOnFirstSeenAdvert = false;

export const pageStart = 25;
export const pageEnd = 40;

export default configsToInclude;
