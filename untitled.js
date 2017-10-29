var pageNumber = 1;
eval("var text" + pageNumber + "=123;");
console.log(text1);

var someNum = 47;
var obj = {};
obj['text' + pageNumber] = 1;
obj["nextKey" + someNum] = "Hello, you!";
console.log(obj);