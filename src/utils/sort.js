export const sort = array => {
	// Check if array is already sorted
	function isAlreadySorted(array) {
		let isSortedForward, isSortedReverse = true;

		// Check for reverse sort
		for (let i = 0; i < array.length - 1; i++) {
			// If timestamp of array[i] > array[i + 1]:
			if (parseInt(array[i].timestamp) > parseInt(array[i + 1].timestamp)) {
				// The array is not sorted in reverse
				isSortedReverse = false;
				break;
			}
		}
		
		// Check for forward sort
		for (let j = 0; j < array.length - 1; j++) {
			// If timestamp of array[j] < array[j + 1]:
			if (parseInt(array[j].timestamp) < parseInt(array[j + 1].timestamp)) {
				// The array is not sorted forward
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
		// Sort by timestamp of JSON object
		return parseInt(a.timestamp) - parseInt(b.timestamp);
	}

	// Sort function if array is already sorted (simple array reversal)
	function reverseSort(array) {
		// Get array length
		let arrayLength = array.length;
		
		// Use array length to reverse the position of each item
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
