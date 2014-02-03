/**
 * zoiA - A beautiful JavaScript template engine.
 * @author BaseCss<i@basecss.net> TooBug<i@toobug.net>
 * @version 0.0.1-alpha1
 * @license MIT
 */

(function(window){

	'use strict';

	var zoiA = {};

	zoiA.compile = function(tmplStr,data){

		// DOM节点树
		var nodeTree = {
			childNodes:[],
			loop:false
		};

		if(Array.isArray(data)){
			nodeTree.loop = data;
		}

		parseNode(tmplStr,nodeTree);
		console.log(nodeTree);

		function parseNode(tmplStr,node){

			var htmlTagRegExp = /<(\/?)\w+[^>\/]*(\/?)>/g;
			var tmpOpeningStack = [];

			var tmpTagRegResult;
			var startIndex,endIndex,selfOpeningTag;
			var totalIndex = 0;

			while(tmpTagRegResult = htmlTagRegExp.exec(tmplStr)){
				if(!tmpTagRegResult[1]){
					if(tmpTagRegResult[2]){
						// 自闭合标记
						endIndex = tmpTagRegResult.index;
					}else{
						// 开启标记
						if(!tmpOpeningStack.length){
							startIndex = totalIndex + tmpTagRegResult[0].length;
							selfOpeningTag = tmpTagRegResult[0];
						}
						tmpOpeningStack.push(tmpTagRegResult[0]);
					}
				}else{
					// 闭合标记
					endIndex = tmpTagRegResult.index;
					tmpOpeningStack.pop();
				}
				if(!tmpOpeningStack.length){
					console.log(startIndex,endIndex);
					console.log(tmplStr.substring(startIndex,endIndex));
					totalIndex = endIndex + tmpTagRegResult[0].length;
					if(!node.childNodes){
						node.childNodes = [];
					}
					node.childNodes.push({
						selfOpeningTag:selfOpeningTag,
						childHTML:tmplStr.substring(startIndex,endIndex)
					});
				}
			}

		}

		



		/*var htmlOpeningRegExp = /<\w+(?: [-_\w\d]+(?: ?= ?(?:['"][-_ \w\d]*['"]))?)* ?(\/?)>/g;

		console.log(tmpOpeningStack,tmpEndingStack);*/

		return function(){

			return tmplStr;

		};

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
