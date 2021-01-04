//sort alghoritms

var RAND_MIN = 1;
var RAND_MAX = 100;

var inputId = 0;
var originalArray;
var bubleShortStep = 0;
var quickShortStep = 0;

function initSorting() {
	getValues();
	refreshForm();
}

function genRandomElementsEvent() {
	$(".element-input").remove();
	inputId = 0;
	let randElementNum = Math.floor(Math.random() * RAND_MAX) + RAND_MIN;	
	for(let i = 0; i != randElementNum; i++) {
		let randElementValue = Math.floor(Math.random() * RAND_MAX) + RAND_MIN;
		addNewElementEvent(randElementValue);
	}
}

function addNewElementEvent(value) {
	var inputItem = "<input id=element-" + ++inputId + " class=\"element-input\" type=\"input\" maxlength=\"5\" />";
	$(".element-inputs-wrapper").append(inputItem);
	if(value !== null) {
		$('#element-' + inputId).val(value);
 	} 	
 	refreshForm();
}

function removeLastElementEvent() {
	if(inputId > 1) {
		$("#element-" + inputId--).remove();
		refreshForm();
	}
}

function refreshForm() {
	$("#element-number").text(inputId);
}

function shortingElements() {	
	clearSorterTables();
	originalArray = new Array();
	var inpudIdCounter = 1;	
	$("#elementInputsWrapper :input").each(function(){
 		var input = $('#element-' + inpudIdCounter);
 		if(input.val() !== null && input.val() !== '' && typeof(input.val()) !== 'undefined') {
 			originalArray.push(parseInt(input.val()));
 		}
 		//console.log(input.val());
 		inpudIdCounter++;
	});
	if(inpudIdCounter != 1) {
		shorting();	
	}	
}

function clearSorterTables() {	
	$('#bublesorterTable tr').closest("tr").remove();
	$('#quicksorterTable tr').closest("tr").remove();
}

function shorting() {	
	var bubleStartArray = originalArray.slice();
	addRowTable('bublesorterTable', 0, bubleStartArray);
	bubleShortStep = 0;
	bubleSort(bubleStartArray);
			
	var quickStartArray = originalArray.slice();
	addRowTable('quicksorterTable', 0, quickStartArray);
	quickShortStep = 0;
	quickSort(quickStartArray, 0, (quickStartArray.length - 1));
}

function bubleSort(array) {	
	for(var i = 0; i <= array.length; i++) {
		for(var j = i + 1; j <= array.length; j++) {
			if(array[j] < array[i]) {
				swap(array, i, j);
				addRowTable('bublesorterTable', ++bubleShortStep, array);
			}
		}
	}
}

//https://www.guru99.com/quicksort-in-javascript.html
function quickSort(items, left, right) {	
	var index;	
    if (items.length > 1) {
        index = partition(items, left, right); //index returned from partition
        if (left < index - 1) { //more elements on the left side of the pivot
            quickSort(items, left, index - 1);
        }
        if (index < right) { //more elements on the right side of the pivot
            quickSort(items, index, right);
        }
    }
    return items;
}

function partition(items, left, right) {	
	var pivot   = items[Math.floor((right + left) / 2)], //middle element
        i       = left, //left pointer
        j       = right; //right pointer
    while (i <= j) {
        while (items[i] < pivot) {
            i++;
        }
        while (items[j] > pivot) {
            j--;
        }
        if (i <= j) {
            swap(items, i, j); //sawpping two elements
            i++;
            j--;
            addRowTable('quicksorterTable', ++quickShortStep, items);
        }
    }
    return i;
}

function swap(array, i, j) {
	var temp = array[i];
	array[i] = array[j];
	array[j] = temp;	
}

function getValues(array, title, spanId) {
	if(typeof(array) === 'undefined')
		return;

	var result = '';	
	for(var i = 0; i < array.length; i++) {
		result += array[i] + ' ';				
		//console.log(values[i]);
	}			
	$('#' + spanId).text(title + ': ' + result);
}

function addRowTable(tableId, rowNum, array) {	
	if(typeof(array) === 'undefined')
		return;

	var arrayText = '';
	for(var i = 0; i < array.length; i++) {
		arrayText += array[i] + ' ';
	}
	var row = "<tr class=\"sort-row\"><td style=\"width: 50px; text-align: right;\">" + rowNum + ".</td><td style=\"padding-left: 20px;\">" + arrayText + "</td></tr>";
 	$("#" + tableId + " tbody").append(row);
}