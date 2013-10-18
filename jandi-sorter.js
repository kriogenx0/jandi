var jandi = jandi || {};

jandi.sorter = function(a, objkey, method) {
	if (!method) method = "merge";
	if (jandi.sorter[method]) {
		return jandi.sorter[method](a, objkey);	
	}
};

jandi.sorter.merge = function(a, objkey) {
	
	// ARRAY IS a
	var mergeSort = function (arr) {
		if (arr.length < 2)
			return arr;
	 
		var middle = parseInt(arr.length / 2);
		var left   = arr.slice(0, middle);
		var right  = arr.slice(middle, arr.length);
	 
		return merge(mergeSort(left), mergeSort(right));
	}
	 
	var merge = function (left, right) {
		var result = [];
	 
		while (left.length && right.length) {
			if (left[0] <= right[0]) {
				result.push(left.shift());
			} else {
				result.push(right.shift());
			}
		}
	 
		while (left.length)
			result.push(left.shift());
	 
		while (right.length)
			result.push(right.shift());
	 
		return result;
	}
	
	// MERGE OBJECTS
	
	var mergeObjectSort = function(arr, key) {
		
		if (arr.length < 2) return arr;
	 
		var middle = parseInt(arr.length / 2);
		var left   = arr.slice(0, middle);
		var right  = arr.slice(middle, arr.length);
	 
		return mergeObject(mergeObjectSort(left, key), mergeObjectSort(right, key));
		
	};
	
	var mergeObject = function (left, right) {
		var result = [];
	 
		while (left.length && right.length) {
			if (left[0][objkey] <= right[0][objkey]) {
				result.push(left.shift());
			} else {
				result.push(right.shift());
			}
		}
	 
		while (left.length)
			result.push(left.shift());
	 
		while (right.length)
			result.push(right.shift());
	 
		return result;
	}
	
	// RETURN
	
	if (objkey) {
		return mergeObjectSort(a, objkey);
	} else {
		return mergeSort(a);
	}
	
};
// INSERTION
// INSERTION IS GOOD FOR ARRAYS THAT ARE ONLY SLIGHTLY OUT OF ORDER
jandi.sorter.insertion = function(a, objkey) {
	if (objkey) {
		var i, j, tmp;
		for (i = 0; i < a.length; ++i) {
			tmp = a[i];
			for (j = i - 1; j >= 0 && a[j][objkey] > tmp[objkey]; --j)
				a[j + 1] = a[j];
			a[j + 1] = tmp;
		}
	} else {
	   for (var i = 0, j, tmp; i < a.length; ++i) {
		  tmp = a[i];
		  for (j = i - 1; j >= 0 && a[j] > tmp; --j)
			 a[j + 1] = a[j];
		  a[j + 1] = tmp;
	   }
	}
	return a;
};
jandi.sorter.insert = jandi.sorter.insertion;

// QUICKSORT
jandi.sorter.quick = function(arr) {
 
  // return if array is unsortable
  if (arr.length < 2) return arr;
 
  var less = Array(), greater = Array();
 
  // select and remove a pivot value pivot from array
  // a pivot value closer to median of the dataset may result in better performance
  var pivotIndex = Math.floor(arr.length / 2);
  var pivot = arr.splice(pivotIndex, 1)[0];
 
  // step through all array elements
  for (var x = 0; x < arr.length; x++){
 
    // if (current value is less than pivot),
    // OR if (current value is the same as pivot AND this index is less than the index of the pivot in the original array)
    // then push onto end of less array
    if (
      (arr[x] < pivot)
      ||
      (arr[x] == pivot && x < pivotIndex)  // this maintains the original order of values equal to the pivot
    ){
      less.push(arr[x]);
    }
 
    // if (current value is greater than pivot),
    // OR if (current value is the same as pivot AND this index is greater than or equal to the index of the pivot in the original array)
    // then push onto end of greater array
    else {
      greater.push(arr[x]);
    }
  }
 
  // concatenate less+pivot+greater arrays
  return quickSort(less).concat([pivot], quickSort(greater));
};
jandi.sorter.quicksort = jandi.sorter.quick;


//////////
// TESTING
//////////

var testArray = [
	5,10,11,20,30,6,100,50,8,500,1024,4,2,0,80,4,69
	/*,
	"five",
	"ten",
	"eleven",
	"twenty",
	"thirty",
	"six",
	"one hundred",
	"fifty"
	*/
];


var testObjects = [
	{
		key: 10,
		value: "ten"
	},
	{
		key: 5,
		value: "five"
	},
	{
		key: 11,
		value: "eleven"
	},
	{
		key: 30,
		value: "thirty"
	},
	{
		key: 9,
		value: "nine"
	},
	{
		key: 6,
		value: "six"
	},
	{
		key: 100,
		value: "one hundred"
	},
	{
		key: 50,
		value: "fifty"
	}				   
];

var qsort = function(a) {
    if (a.length == 0) return [];
 
    var left = [], right = [], pivot = a[0];
 
    for (var i = 1; i < a.length; i++) {
        a[i] < pivot ? left.push(a[i]) : right.push(a[i]);
    }
 
    return qsort(left).concat(pivot, qsort(right));
}

var sortObjects = function(a, p) {
	
	if (a.length == 0) return false;
	if (!a[0][p]) return false;
 
    var left = [], right = [], pivot = a[0][p];
 
    for (var i = 1; i < a.length; i++) {
        a[i][p] < pivot ? left.push(a[i]) : right.push(a[i]);
    }
 
    return sortObjects(left).concat(pivot, sortObjects(right));
	
}


// STABLE implementation of quick sort to replace unstable Array.sort method in Firefox
var quickSort = function(arr) {
 
  // return if array is unsortable
  if (arr.length <= 1){
    return arr;
  }
 
  var less = Array(), greater = Array();
 
  // select and remove a pivot value pivot from array
  // a pivot value closer to median of the dataset may result in better performance
  var pivotIndex = Math.floor(arr.length / 2);
  var pivot = arr.splice(pivotIndex, 1)[0];
 
  // step through all array elements
  for (var x = 0; x < arr.length; x++){
 
    // if (current value is less than pivot),
    // OR if (current value is the same as pivot AND this index is less than the index of the pivot in the original array)
    // then push onto end of less array
    if (
      (arr[x] < pivot)
      ||
      (arr[x] == pivot && x < pivotIndex)  // this maintains the original order of values equal to the pivot
    ){
      less.push(arr[x]);
    }
 
    // if (current value is greater than pivot),
    // OR if (current value is the same as pivot AND this index is greater than or equal to the index of the pivot in the original array)
    // then push onto end of greater array
    else {
      greater.push(arr[x]);
    }
  }
 
  // concatenate less+pivot+greater arrays
  return quickSort(less).concat([pivot], quickSort(greater));
};
