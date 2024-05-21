export const getRandomItemFromArray = (arrayOfItems: unknown[]): unknown => {
	return arrayOfItems[Math.floor(Math.random() * arrayOfItems.length)];
};
