// Usage: replaceURL(inputString, category)
// Description: Replace the url of the image with the url of the category
export const replaceURL = (inputString, category) => {
	const regex = /(https:\/\/portfolio\.ctwhome\.com\/)(?!wp-content)/g;
	return inputString
		.replace(regex, (match) => 'https://ctwhome.com/') // replace the url
		.replace(/content="noindex/g, 'content="index'); // replace noindex with index
};
