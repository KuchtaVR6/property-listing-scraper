const configsToInclude : Map<string, boolean> = new Map([
	["gumtree-rent", true],
	["gumtree-share", true],
	["right-move-for-rent", false],
	["spare-room", false],
	["zoopla-for-rent", false],
]);

export const stopOnFirstSeenAdvert = false;

export default configsToInclude;
