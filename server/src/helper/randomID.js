export function generateUniqueNumber() {
	// Get current timestamp in milliseconds
	const timestamp = new Date().getTime();
	const randomFactor = Math.floor(Math.random() * 100) + 1;
	const uniqueNumber = timestamp * randomFactor;
	return uniqueNumber;
}
