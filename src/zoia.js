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
