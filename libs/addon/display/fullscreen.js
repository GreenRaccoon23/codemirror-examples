// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function (mod) {
	if (typeof exports == "object" && typeof module == "object") // CommonJS
		mod(require("../../lib/codemirror"));
	else if (typeof define == "function" && define.amd) // AMD
		define(["../../lib/codemirror"], mod);
	else // Plain browser env
		mod(CodeMirror);
})(function (CodeMirror) {
	"use strict";

	CodeMirror.defineOption("fullScreen", false, function (cm, val, old) {
		if (old == CodeMirror.Init) old = false;
		if (!old == !val) return;
		if (val) setFullscreen(cm);
		else setNormal(cm);
	});

	function getEdit(cm) {
		return cm.getWrapperElement();
	}
	function getWrap(cm) {
		var el1 = cm.getWrapperElement();
		var el2 = $(el1).closest('.fullscreen-wrapper');
		return (el2.length)? el2[0] : el1;
	}
	function getHtml() {
		return document.documentElement;
	}

	function setFullscreen(cm) {
		var elHtml = getHtml(cm);
		var elWrap = getWrap(cm);
		var elEdit = getEdit(cm);

		// save states
		cm.state.fullScreenRestoreWrapper = {
			width: elWrap.style.width,
			height: elWrap.style.height
		};
		cm.state.fullScreenRestoreEditor = {
			height: elEdit.style.height
		};
		cm.state.fullScreenRestoreWindow = {
			scrollTop: window.pageYOffset,
			scrollLeft: window.pageXOffset
		};

		// set <wrap>
		elWrap.style.width = '';
		elWrap.style.height = '100vh';
		elWrap.className += ' CodeMirror-fullscreen';

		// set <html>
		elHtml.style.overflow = 'hidden';

		// set <edit>
		elEdit.style.height = '100%';

		cm.refresh();
	}

	function setNormal(cm) {
		var elWrap = getWrap(cm);
		var elHtml = getHtml(cm);
		var elEdit = getEdit(cm);

		// restore <html>
		elHtml.style.overflow = '';

		// restore <wrap>
		elWrap.className = elWrap.className.replace(/\s*CodeMirror-fullscreen\b/, '');
		elWrap.style.width = cm.state.fullScreenRestoreWrapper.width;
		elWrap.style.height = cm.state.fullScreenRestoreWrapper.height;

		// restore <edit>
		elEdit.style.height = cm.state.fullScreenRestoreEditor.height;

		// restore window state
		window.scrollTo(
			cm.state.fullScreenRestoreWindow.scrollLeft,
			cm.state.fullScreenRestoreWindow.scrollTop);
		cm.refresh();
	}
});
