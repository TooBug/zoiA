/**
 * zoiA - A beautiful JavaScript template engine for HTML.
 * @author Basecss<i@basecss.net> TooBug<i@toobug.net>
 * @version 0.0.1-alpha1
 * @license MIT
 */

(function(window){

	'use strict';

	var zoiA = {};

	var directiveList = 'repeat|if|show|hide';

	function encodeQuote(str){
		if(!str) return str;
		return str.replace(/"/g,'\\"');
	}

	function parseNode(node){

		var zoiATagRegExp = new RegExp('<(\\w+)[^>]*z-(?:' + directiveList + ')(?:=[\'"].*?[\'"])? *>','g');

		var zoiATagMatch;

		var tmplStr = node.original;

		while(zoiATagMatch = zoiATagRegExp.exec(tmplStr)){

			if(!zoiATagMatch){
				return false;
			}

			var tagName = zoiATagMatch[1];

			/*if(typeof node.before === 'undefined'){
				node.before = tmplStr.substring(0,zoiATagMatch.index);
			}*/
			var before = tmplStr.substring(0,zoiATagMatch.index);
			var after;
			if(before){
				node.childNodes.push({
					original:before,
					childNodes:[]
				});
			}

			tmplStr = tmplStr.substr(zoiATagMatch.index);

			var tagRegExp = new RegExp('<(/?)'+tagName+'.*?>','g');
			var tagStack = [],found = false;

			var tmpRegExpResult;
			var startIndex = 0,endIndex = 0,
				startTag = '',endTag = '';

			while(tmpRegExpResult = tagRegExp.exec(tmplStr)){
				if(tmpRegExpResult[1] === '/'){
					tagStack.pop();
					endIndex = tmpRegExpResult.index;
					endTag = tmpRegExpResult[0];
				}else{
					tagStack.push(tmpRegExpResult[0]);
					if(!startTag){
						startTag = tmpRegExpResult[0];
					}
					found = true;
				}
				if(!tagStack.length) break;
			}

			after = tmplStr.substr(endIndex + endTag.length);

			if(found){
				var content = tmplStr.substring(startTag.length,endIndex);
				node.childNodes.push({
					// original:tmplStr.substring(startTag.index,endIndex + endTag.length),
					original:content,
					zoiA:parseZoiA(startTag),
					startTag:startTag,
					endTag:endTag,
					childNodes:[]
				});
				// console.log(tmplStr,startTag,endTag,startIndex,endIndex);
			}
			tmplStr = tmplStr.substr(endIndex + endTag.length);
		}
		if(after){
			node.childNodes.push({
				original:after,
				childNodes:[]
			});
		}

		node.childNodes.forEach(function(childNode){
			// console.log('childNode:',childNode);
			parseNode(childNode);
		});

	}

	function parseVar(str){
		if(!str) return str;
		return str.replace(/{{([\w\d\.\$_]+?)}}/,function(match,varible){
			
			return '" + (' + getObjValue(varible) + ') + "';

			function getObjValue(objChild){

				var objStr = '';
				var objPrefix = '';
				var objChain = objChild.split('.');
				// objChain.unshift('data');

				objChain.forEach(function(objPart){

					if(!objPart) return;
					objStr += objPrefix + objPart + ' && ';
					objPrefix += objPart + '.';

				});
				return objStr.replace(/ && $/,'');

			}

		});
	}

	function compileNode(node,init){

		var functionBody = '';

		if(init){
			functionBody += 'var result = "";';
		}

		if(node.startTag){
			functionBody += 'result += "' + parseVar(encodeQuote(node.startTag)) + '";';
		}

		if(node.childNodes.length){
			node.childNodes.forEach(function(childNode){
				functionBody += compileNode(childNode) || '';
			});
		}else{
			functionBody += 'result += "' + (parseVar(encodeQuote(node.original)) || '""') + '";';
		}
		if(node.endTag){
			functionBody += 'result += "' + node.endTag + '";';
		}

		if(node.zoiA){
			if(node.zoiA.repeat){
				var repeatPart = node.zoiA.repeat.split(':');
				var dataStr = repeatPart[1];
				if(node.isRoot){
					dataStr = 'data.' + dataStr;
				}
				functionBody = 'if(Array.isArray(' + dataStr + ')){' +
									dataStr + '.forEach(function(' + repeatPart[0] + '){' +
										functionBody +
									'});' +
								'}';
			}
			if(node.zoiA.if){
				var dataStr = node.zoiA.if;
				if(node.isRoot){
					dataStr = 'data.' + dataStr;
				}
				functionBody = 'if(' + dataStr + '){' +
									functionBody +
								'}';
			}
		}

		if(init){
			functionBody += 'return result;';
			return new Function('data',functionBody);
		}else{
			return functionBody;
		}


	}

	function parseZoiA(startTag){

		var zoiAMetaRegExp = new RegExp('z-(' + directiveList + ')(?:=[\'"](.*?)[\'"])?','g');
		var zoiAMetaResult = {};

		var tmpMatchResult;

		while(tmpMatchResult = zoiAMetaRegExp.exec(startTag)){
			zoiAMetaResult[tmpMatchResult[1]] = tmpMatchResult[2];
		}

		// console.log(zoiAMetaResult);
		return zoiAMetaResult;

	}


	zoiA.compile = function(tmplStr){

		// DOM节点树
		var nodeTree = {
			childNodes:[],
			original:tmplStr
		};

		parseNode(nodeTree);

		var compiledFunc = compileNode(nodeTree,true);

		console.log(nodeTree);
		console.log(compiledFunc);

		return compiledFunc;

	};

	zoiA.render = function(tmplStr,data){

		return this.compile(tmplStr)(data);

	};

	if(typeof module === 'object' && module && typeof module.exports === 'object'){
		module.exports = zoiA;
	}else if(typeof define === 'object' && define.amd){
		define('zoiA',[],function(){
			return zoiA;
		});
	}else if(typeof window === 'object' && typeof window.document === 'object'){
		window.zoiA = zoiA;
	}

})(window);
