export const sort = array => {
	// Check if array is already sorted
	function isAlreadySorted(array) {
		let isSortedForward, isSortedReverse = true;

		// Check for reverse sort
		for (let i = 0; i < array.length - 1; i++) {
			if (parseInt(array[i].timestamp) > parseInt(array[i + 1].timestamp)) {
				isSortedReverse = false;
				break;
			}
		}
		
		// Check for forward sort
		for (let j = 0; j < array.length - 1; j++) {
			if (parseInt(array[j].timestamp) < parseInt(array[j + 1].timestamp)) {
				isSortedForward = false;
				break;
			}
		}

		if (!isSortedForward && !isSortedReverse) {
			// If not sorted either forward or back
			return false;
		} else {
			// Else:
			return true;
		}
	}

	// Sort function if array is not sorted
	function sortArray(a, b) {
		return parseInt(a.timestamp) - parseInt(b.timestamp);
	}

	// Sort function if array is already sorted (simple array reversal)
	function reverseSort(array) {
		let arrayLength = array.length;
		for (let i = 0; i < arrayLength / 2; i++) {
			let t = array[i];
			array[i] = array[arrayLength - 1 - i];
			array[arrayLength - 1 - i] = t;
		}
		return array;
	}
	
	if (isAlreadySorted(array)) {
		// Reverse already sorted array
		return reverseSort(array);
	} else {
		// Sort array by timestamp
		return array.sort(sortArray);
	}
}
