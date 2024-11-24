export const run = async (
	config: {
		dependencies: Record<string, object>;
	},
	exclude: string[],
) => {
	// Validation
	if (typeof config !== "object") {
		throw new Error("config must be an object");
	}
	if (!config.dependencies) {
		throw new Error("config must have a dependencies key");
	}
	if (!Array.isArray(exclude)) {
		throw new Error("exclude must be an array");
	}
	for (const packageName of exclude) {
		if (typeof packageName !== "string") {
			throw new Error("exclude must be an array of strings");
		}
	}

	console.log(JSON.stringify(config));
};
