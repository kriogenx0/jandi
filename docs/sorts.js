

/*

function quicksort('array')
      create empty lists 'less' and 'greater'
      if length('array') <= 1
          return 'array'  // an array of zero or one elements is already sorted
      select and remove a pivot value 'pivot' from 'array'
      for each 'x' in 'array'
          if 'x' <= 'pivot' then append 'x' to 'less'
          else append 'x' to 'greater'
      return concatenate(quicksort('less'), 'pivot', quicksort('greater'))
*/


/*

// Swap a[i], a[j] with profiling, single stepping, 
// return false if cancel
function swap(i, j)
{
  if (i==j)
    return !cancelSort;
  if (form.swap.checked)
  {
    writeArray('i','a');
    if (!confirm("Swap a["+i+"]="+a[i]+", a["+j+"]="+a[j]))
    {
      cancelSort=true;
      return false;
    }
  }
  var t=a[i];
  a[i]=a[j];
  a[j]=t;
  ++form.imoves.value;
  ++form.imoves.value;
  return !cancelSort;
}

// Swap a[i], a[j] if out of order
function order(i, j)
{
  ++form.icompares.value;
  if (a[i]>a[j])
    return swap(i, j);
  return !cancelSort;
}




var sorter = {
	array: [],
	
	
	
	bubble: function(a) {
		console.log("BUBBLE:");
		console.log(a);
					  
		for (var i=n-1; i>0; --i) {
			if (form.step.checked)
			{
			  writeArray('i','a');
			  if (!confirm("Bubble sort a[0.."+(i-1)+"]"))
				return;
			}
			for (var j=0; j<i; ++j)
			  if (!order(j, j+1))
				return;
		}
		
					  
	}
};

// Bubble sort array a
function bubbleSort()
{

  readArray('i');

  for (var i=n-1; i>0; --i)
  {
    if (form.step.checked)
    {
      writeArray('i','a');
      if (!confirm("Bubble sort a[0.."+(i-1)+"]"))
        return;
    }
    for (var j=0; j<i; ++j)
      if (!order(j, j+1))
        return;
  }
  writeArray('i','a');
}

// Quick sort a[start..end-1]
function quickSort1(start, end)
{
  if (end-start > 1 && !cancelSort)
  {
    var lastlow=start;
    for (var i=start+1; i<end; ++i)
    {
      ++form.icompares.value;
      if (a[i]<a[start])
        if (!swap(i, ++lastlow))
          return;
    }
    if (!swap(start, lastlow))
      return;
    if (form.step.checked)
    {
      writeArray('i','a');
      if (!confirm("Sort ["+start+".."+(lastlow-1)+"],["+
          (lastlow+1)+".."+(end-1)+"] on pivot "+a[lastlow]))
      {
        cancelSort=true;
        return;
      }
    }
    quickSort1(start, lastlow);
    if (!cancelSort)
      quickSort1(lastlow+1, end);
  } 
}

// Quick sort setup and reporting
function quickSort()
{
  readArray('i');
  quickSort1(0, n);
  writeArray('i','a');
}

// Merge sort the part of array a from start to end-1
function mergeSort1(start, end)
{
  if (end-start > 1)  // Recursively merge sort
  {
    // Merge sort each half of a
    var mid=parseInt((start+end)/2);
    mergeSort1(start, mid);
    if (cancelSort)
      return;
    mergeSort1(mid, end);
    if (cancelSort)
      return;

    if (form.step.checked)  // Single step
    {
      writeArray('i','a');
      if (!confirm("Merging A["+start+".."+(mid-1)+"] and A["+
          mid+".."+(end-1)+"]"))
      {
        cancelSort=true;
        return;
      }
    }

    // Merge the two halves
    var b=new obj();  // Temporary array
    var j1=start;
    var j2=mid;
    for (var i=0; i<end-start; ++i)
    {
      if (j1>=mid)
        b[i]=a[j2++];
      else if (j2>=end)
        b[i]=a[j1++];
      else if (a[j1]<=a[j2])
      {
        b[i]=a[j1++];
        ++form.icompares.value;  // Profiling
      }
      else
      {
        b[i]=a[j2++];
        ++form.icompares.value;
      }
    }
    for (i=0; i<end-start; ++i)
    {
      a[i+start]=b[i];     
      ++form.imoves.value;  // Profiling
    }
  }
}

// Merge sort setup and reporting
function mergeSort()
{
  readArray('i','a');
  mergeSort1(0, n);
  writeArray('i','a');
}

// Radix sort a (base 2)
// Numbers must be in the range 0 to 2**31 - 1
function radixSort()
{
  readArray('i');
  var b0 = new obj();  // Bin for 0 digits
  var b1 = new obj();  // Bin for 1 digits
  for (var i=0; i<32; ++i)
  {
    if (form.step.checked)  // Single step
    {
      writeArray('i','a');
      if (!confirm("Sort on bit "+i))
        return;
    }

    var mask = 1<<i;     // Digit (2**i)
    var biggest = 2<<i;  // If all of a is smaller, we're done
    var zeros=0;         // Number of elements in b0, b1
    var ones=0;
    var found=false;     // Any digits past i?
    for (var j=0; j<n; ++j)  // Sort into bins b0, b1
    {
      if ((a[j] & mask) == 0)
        b0[zeros++] = a[j];
      else
        b1[ones++] = a[j];
      if (a[j]>=biggest)  // Any more digits to sort on?
        found=true;
    }
    for (j=0; j<zeros; ++j)  // Concatenate b0, b1 back to a
      a[j]=b0[j];
    for (j=0; j<ones; ++j)
      a[j+zeros]=b1[j];
    form.imoves.value = parseInt(form.imoves.value)+n;
    if (!found)
      break;
  }
  writeArray('i','a');
}

function insertionSort()
// sort a[1..n]
{
  readArray('i');
  var i, j, chstr;
  for(i=1; i < n; i++)
  {
    var ai = a[i];
    j = i-1;
    while( a[j]-0 > ai ) 
	{
	  a[j+1] = a[j]; 
	  j--; 
	}
    a[j+1] = ai;
    if (form.step.checked)  // Single step
    {
      writeArray('i','a');
	  chstr='[';
	  for(tj=0; tj <= i; tj++)
        chstr+=a[tj]+' ';
	  chstr+='] ';
	  for(tj2=i+1; tj2 < n; tj2++)
        chstr+=a[tj2]+' '; 
	  if (!confirm("Inserting "+ai+':\n'+chstr))
         return;
    }
  }
  writeArray('i','a'); 
}


/*
// global variables var col = 0; var parent = null; var items = new Array(); var N = 0; function quicksort(m, n, desc) { if(n <= m+1) return; if((n - m) == 2) { if(compare(get(n-1), get(m), desc)) exchange(n-1, m); return; } i = m + 1; j = n - 1; if(compare(get(m), get(i), desc)) exchange(i, m); if(compare(get(j), get(m), desc)) exchange(m, j); if(compare(get(m), get(i), desc)) exchange(i, m); pivot = get(m); while(true) { j--; while(compare(pivot, get(j), desc)) j--; i++; while(compare(get(i), pivot, desc)) i++; if(j <= i) break; exchange(i, j); } exchange(m, j); if((j-m) < (n-j)) { quicksort(m, j, desc); quicksort(j+1, n, desc); } else { quicksort(j+1, n, desc); quicksort(m, j, desc); } } function sortTable(tableid, n, desc) { parent = document.getElementById(tableid); col = n; if(parent.nodeName != "TBODY") parent = parent.getElementsByTagName("TBODY")[0]; if(parent.nodeName != "TBODY") return false; items = parent.getElementsByTagName("TR"); N = items.length; // quick sort quicksort(0, N, desc); }

*/