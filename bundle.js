(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),flatten=function(e){var t=function(t){e[t]=[].concat.apply([],Object.keys(e[t]).map(function(n){return[].concat.apply([],Object.keys(e[t][n]).map(function(a){return[].concat.apply([],Object.keys(e[t][n][a]).map(function(l){return e[t][n][a][l]}))}))}))};for(var n in e)t(n);return e},App=function(e){function t(e){_classCallCheck(this,t);var n=_possibleConstructorReturn(this,Object.getPrototypeOf(t).call(this,e));return n.state={data:{},filteredData:{},semester:"",allAttributes:[],allSubjects:[],pages:1,filters:{status:{query:null,func:function(e,t){return e.filter(function(e){return!t||e.STATUS===t})}},subject:{query:null,func:function(e,t){return e.filter(function(e){return!t||e.dept===t})}},attributes:{query:null,func:function(e,t){return e.filter(function(e){return!t||e["CRSE ATTR"].includes(t)})}},title:{query:null,func:function(e,t){return e.filter(function(e){return!t||e.TITLE.toLowerCase().indexOf(t.toLowerCase())>-1})}}}},n.onSemesterChange=n.onSemesterChange.bind(n),n.filter=n.filter.bind(n),n.onFilter=n.onFilter.bind(n),n.loadPage=n.loadPage.bind(n),n}return _inherits(t,e),_createClass(t,[{key:"componentDidMount",value:function(){var e=this;fetch("http://ec2-52-207-245-202.compute-1.amazonaws.com/courses").then(function(e){return e.json()}).then(function(t){t=flatten(t);var n=Object.keys(t)[0],a=[].concat.apply([],[].concat.apply([],Object.keys(t).map(function(e){return t[e]})).map(function(e){return e["CRSE ATTR"]})).filter(function(e,t,n){return t===n.indexOf(e)}).sort(),l=[].concat.apply([],[].concat.apply([],Object.keys(t).map(function(e){return t[e]})).map(function(e){return e.dept})).filter(function(e,t,n){return t===n.indexOf(e)}).sort();e.setState({data:t,filteredData:JSON.parse(JSON.stringify(t)),semester:n,allAttributes:a,allSubjects:l},e.filter)})}},{key:"onSemesterChange",value:function(e){this.setState({semester:e.target.value,pages:1},this.filter)}},{key:"filter",value:function e(){var t=this.state,n=t.data,a=t.filters,l=t.semester,r=JSON.parse(JSON.stringify(n));for(var e in a)r[l]=a[e].func(r[l],a[e].query);this.setState({filteredData:r})}},{key:"onFilter",value:function(e,t){var n=this.state.filters;n[e].query="null"===t.target.value?null:t.target.value,this.setState({filters:n},this.filter)}},{key:"loadPage",value:function(){this.setState({pages:++this.state.pages})}},{key:"render",value:function(){var e=this.state,t=e.data,n=e.pages,a=(e.filters,e.semester),l=e.allSubjects,r=e.filteredData,c=e.allAttributes;return React.createElement("div",{className:"container"},React.createElement("div",{style:{borderBottom:"#000 1px solid"}},React.createElement("div",{className:"center"},React.createElement("h2",null,"W&M Course Search"))),React.createElement("div",{className:"row"},React.createElement("div",{className:"input-field col s12 m6 l6"},React.createElement("select",{className:"browser-default",onChange:this.onSemesterChange.bind(this)},Object.keys(t).map(function(e,t){return React.createElement("option",{key:t,value:e},e)}))),React.createElement("div",{className:"input-field col s12 m6 l6"},React.createElement("select",{className:"browser-default",onChange:this.onFilter.bind(this,"status")},React.createElement("option",{value:"null"},"ALL"),t[a]&&t[a].map(function(e){return e.STATUS}).filter(function(e,t,n){return t===n.indexOf(e)}).map(function(e,t){return React.createElement("option",{key:t,value:e},e)}))),React.createElement("div",{className:"input-field col s12 m6 l6"},React.createElement("select",{className:"browser-default",onChange:this.onFilter.bind(this,"attributes")},React.createElement("option",{value:"null"},"Any"),c.map(function(e,t){return React.createElement("option",{key:t,value:e},e)}))),React.createElement("div",{className:"input-field col s12 m6 l6"},React.createElement("select",{className:"browser-default",onChange:this.onFilter.bind(this,"subject")},React.createElement("option",{value:"null"},"ALL"),l.map(function(e,t){return React.createElement("option",{key:t,value:e},e)})))),React.createElement("div",{className:"row"},React.createElement("div",{className:"input-field col s12 m8 l6 offset-m2 offset-l3"},React.createElement("input",{type:"text",onChange:this.onFilter.bind(this,"title")}),React.createElement("label",null,"Search for a class"))),React.createElement("div",null,React.createElement("table",{className:"striped"},React.createElement("thead",null,React.createElement("tr",null,React.createElement("th",null,"Subject"),React.createElement("th",null,"Level"),React.createElement("th",null,"Title"),React.createElement("th",null,"Instructor"),React.createElement("th",null,"Credits"),React.createElement("th",null,"Section"),React.createElement("th",null,"Days"),React.createElement("th",null,"Meet Times"),React.createElement("th",null,"Seats Available"),React.createElement("th",null,"Attributes"))),React.createElement("tbody",null,r[a]&&r[a].slice(0,50*n).map(function(e,t){return React.createElement("tr",{key:t},React.createElement("td",null,e.dept),React.createElement("td",null,e.level),React.createElement("td",null,e.TITLE),React.createElement("td",null,React.createElement("a",{href:"http://www.ratemyprofessors.com/search.jsp?query="+e.INSTRUCTOR.replace(/, /g,"+"),target:"_blank"},e.INSTRUCTOR)),React.createElement("td",null,e["CRDT HRS"]),React.createElement("td",null,e.section),React.createElement("td",null,e["MEET DAYS"]),React.createElement("td",null,e["MEET TIMES"]),React.createElement("td",null,e["SEATS AVAIL"]),React.createElement("td",null,e["CRSE ATTR"].join(", ")))})))),React.createElement("div",{className:"center"},React.createElement("a",{className:"btn-floating btn-large waves-effect waves-light red"},React.createElement("i",{className:"material-icons",onClick:this.loadPage},"add"))))}}]),t}(React.Component);ReactDOM.render(React.createElement(App,null),document.getElementById("app"));
},{}]},{},[1])


//# sourceMappingURL=bundle.map.json