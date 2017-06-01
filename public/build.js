(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function recompute(state, newState, oldState, isInitial) {
	if (isInitial || 'ballsPlayed' in newState && differs(state.ballsPlayed, oldState.ballsPlayed)) {
		state.ballsRemaining = newState.ballsRemaining = template.computed.ballsRemaining(state.ballsPlayed);
	}

	if (isInitial || 'seconds' in newState && differs(state.seconds, oldState.seconds)) {
		state.displayIsActive = newState.displayIsActive = template.computed.displayIsActive(state.seconds);
		state.showTimerWarning = newState.showTimerWarning = template.computed.showTimerWarning(state.seconds);
	}

	if (isInitial || 'ballsRemaining' in newState && differs(state.ballsRemaining, oldState.ballsRemaining)) {
		state.gameIsComplete = newState.gameIsComplete = template.computed.gameIsComplete(state.ballsRemaining);
	}
}

var template = function () {
	return {
		data: function data() {
			return {
				score: 0,
				ballsPlayed: 0
			};
		},
		oncreate: function oncreate() {
			var _this = this;

			var url = window.location.toString().slice(0, -1);
			console.log('connecting to websocket at', url);
			var socket = io.connect(url);
			socket.on('message', function (message) {
				if (message.key === 'action') {
					_this.set(message.data);
				}
				if (message.key === 'reset') {
					_this.set({
						score: 0,
						ballsPlayed: 0,
						theyKeepGoingAfterGameIsDone: false
					});
				}
				if (message.key === 'seconds') {
					_this.set({ seconds: message.data });
				}
				if (message.data && message.data.previouslyCompleted) {
					_this.set({ theyKeepGoingAfterGameIsDone: true });
				}
			});
		},

		computed: {
			ballsRemaining: function ballsRemaining(ballsPlayed) {
				return 7 - ballsPlayed;
			},
			displayIsActive: function displayIsActive(seconds) {
				return seconds !== 0;
			},
			showTimerWarning: function showTimerWarning(seconds) {
				return seconds < 30;
			},
			gameIsComplete: function gameIsComplete(ballsRemaining) {
				return ballsRemaining === 0;
			}
		}
	};
}();

function add_css() {
	var style = createElement('style');
	style.id = "svelte-3280404354-style";
	style.textContent = "\ndiv[svelte-3280404354].score-area, [svelte-3280404354] div.score-area {\n\ttext-align: center;\n\tcolor: blue;\n\tfont-size: 4em;\n\ttext-transform: uppercase;\n\tfont-family: \"Lucida Console\", \"Monaco\", \"Courier New\", Courier, monospace;\n}\n[svelte-3280404354].warning, [svelte-3280404354] .warning {\n\tfont-size: 0.4em;\n\tcolor: red;\n}\ndiv[svelte-3280404354][display-is-active], [svelte-3280404354] div[display-is-active] {\n\tmargin: 0;\n\tpadding: 0;\n\twidth: 100%;\n\theight: 100%;\n}\ndiv[svelte-3280404354][display-is-active=false] *, [svelte-3280404354] div[display-is-active=false] * {\n\tdisplay: none;\n}\n";
	appendNode(style, document.head);
}

function create_main_fragment(state, component) {
	var div_display_is_active_value, text_2_value;

	var div = createElement('div');
	setAttribute(div, 'svelte-3280404354', '');
	setAttribute(div, 'display-is-active', div_display_is_active_value = state.displayIsActive);
	var div_1 = createElement('div');
	appendNode(div_1, div);
	div_1.className = "score-area";

	var if_block = state.gameIsComplete && create_if_block(state, component);

	if (if_block) if_block.mount(div_1, null);
	var text = createText("\n\t\t");
	appendNode(text, div_1);
	var h1 = createElement('h1');
	appendNode(h1, div_1);
	appendNode(createText("Score: "), h1);
	var text_2 = createText(text_2_value = state.score);
	appendNode(text_2, h1);
	appendNode(createText("\n\t\t"), div_1);

	var if_block_1 = state.ballsRemaining && create_if_block_1(state, component);

	if (if_block_1) if_block_1.mount(div_1, null);
	var text_4 = createText("\n\t\t");
	appendNode(text_4, div_1);

	var if_block_2 = state.theyKeepGoingAfterGameIsDone && create_if_block_2(state, component);

	if (if_block_2) if_block_2.mount(div_1, null);
	var text_5 = createText("\n\t\t");
	appendNode(text_5, div_1);

	var if_block_3 = state.showTimerWarning && create_if_block_3(state, component);

	if (if_block_3) if_block_3.mount(div_1, null);

	return {
		mount: function mount(target, anchor) {
			insertNode(div, target, anchor);
		},

		update: function update(changed, state) {
			if (div_display_is_active_value !== (div_display_is_active_value = state.displayIsActive)) {
				setAttribute(div, 'display-is-active', div_display_is_active_value);
			}

			if (state.gameIsComplete) {
				if (!if_block) {
					if_block = create_if_block(state, component);
					if_block.mount(div_1, text);
				}
			} else if (if_block) {
				if_block.destroy(true);
				if_block = null;
			}

			if (text_2_value !== (text_2_value = state.score)) {
				text_2.data = text_2_value;
			}

			if (state.ballsRemaining) {
				if (if_block_1) {
					if_block_1.update(changed, state);
				} else {
					if_block_1 = create_if_block_1(state, component);
					if_block_1.mount(div_1, text_4);
				}
			} else if (if_block_1) {
				if_block_1.destroy(true);
				if_block_1 = null;
			}

			if (state.theyKeepGoingAfterGameIsDone) {
				if (!if_block_2) {
					if_block_2 = create_if_block_2(state, component);
					if_block_2.mount(div_1, text_5);
				}
			} else if (if_block_2) {
				if_block_2.destroy(true);
				if_block_2 = null;
			}

			if (state.showTimerWarning) {
				if (if_block_3) {
					if_block_3.update(changed, state);
				} else {
					if_block_3 = create_if_block_3(state, component);
					if_block_3.mount(div_1, null);
				}
			} else if (if_block_3) {
				if_block_3.destroy(true);
				if_block_3 = null;
			}
		},

		destroy: function destroy(detach) {
			if (if_block) if_block.destroy(false);
			if (if_block_1) if_block_1.destroy(false);
			if (if_block_2) if_block_2.destroy(false);
			if (if_block_3) if_block_3.destroy(false);

			if (detach) {
				detachNode(div);
			}
		}
	};
}

function create_if_block(state, component) {
	var p = createElement('p');
	appendNode(createText("Congratulations!"), p);

	return {
		mount: function mount(target, anchor) {
			insertNode(p, target, anchor);
		},

		destroy: function destroy(detach) {
			if (detach) {
				detachNode(p);
			}
		}
	};
}

function create_if_block_1(state, component) {
	var text_1_value;

	var p = createElement('p');
	appendNode(createText("Balls Remaining: "), p);
	var text_1 = createText(text_1_value = state.ballsRemaining);
	appendNode(text_1, p);

	return {
		mount: function mount(target, anchor) {
			insertNode(p, target, anchor);
		},

		update: function update(changed, state) {
			if (text_1_value !== (text_1_value = state.ballsRemaining)) {
				text_1.data = text_1_value;
			}
		},

		destroy: function destroy(detach) {
			if (detach) {
				detachNode(p);
			}
		}
	};
}

function create_if_block_2(state, component) {
	var p = createElement('p');
	appendNode(createText("Press the button to start a new game!"), p);

	return {
		mount: function mount(target, anchor) {
			insertNode(p, target, anchor);
		},

		destroy: function destroy(detach) {
			if (detach) {
				detachNode(p);
			}
		}
	};
}

function create_if_block_3(state, component) {
	var text_1_value;

	var p = createElement('p');
	p.className = "warning";
	appendNode(createText("Shutting down in "), p);
	var text_1 = createText(text_1_value = state.seconds);
	appendNode(text_1, p);

	return {
		mount: function mount(target, anchor) {
			insertNode(p, target, anchor);
		},

		update: function update(changed, state) {
			if (text_1_value !== (text_1_value = state.seconds)) {
				text_1.data = text_1_value;
			}
		},

		destroy: function destroy(detach) {
			if (detach) {
				detachNode(p);
			}
		}
	};
}

function Display(options) {
	options = options || {};
	this._state = assign(template.data(), options.data);
	recompute(this._state, this._state, {}, true);

	this._observers = {
		pre: Object.create(null),
		post: Object.create(null)
	};

	this._handlers = Object.create(null);

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;
	if (!document.getElementById("svelte-3280404354-style")) add_css();

	this._fragment = create_main_fragment(this._state, this);
	if (options.target) this._fragment.mount(options.target, null);

	if (options._root) {
		options._root._renderHooks.push(template.oncreate.bind(this));
	} else {
		template.oncreate.call(this);
	}
}

assign(Display.prototype, {
	get: get,
	fire: fire,
	observe: observe,
	on: on,
	set: set,
	_flush: _flush
});

Display.prototype._set = function _set(newState) {
	var oldState = this._state;
	this._state = assign({}, oldState, newState);
	recompute(this._state, newState, oldState, false);
	dispatchObservers(this, this._observers.pre, newState, oldState);
	this._fragment.update(newState, this._state);
	dispatchObservers(this, this._observers.post, newState, oldState);
};

Display.prototype.teardown = Display.prototype.destroy = function destroy(detach) {
	this.fire('destroy');

	this._fragment.destroy(detach !== false);
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

function createElement(name) {
	return document.createElement(name);
}

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function setAttribute(node, attribute, value) {
	node.setAttribute(attribute, value);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function appendNode(node, target) {
	target.appendChild(node);
}

function createText(data) {
	return document.createTextNode(data);
}

function differs(a, b) {
	return a !== b || a && (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object' || typeof a === 'function';
}

function assign(target) {
	for (var i = 1; i < arguments.length; i += 1) {
		var source = arguments[i];
		for (var k in source) {
			target[k] = source[k];
		}
	}

	return target;
}

function dispatchObservers(component, group, newState, oldState) {
	for (var key in group) {
		if (!(key in newState)) continue;

		var newValue = newState[key];
		var oldValue = oldState[key];

		if (differs(newValue, oldValue)) {
			var callbacks = group[key];
			if (!callbacks) continue;

			for (var i = 0; i < callbacks.length; i += 1) {
				var callback = callbacks[i];
				if (callback.__calling) continue;

				callback.__calling = true;
				callback.call(component, newValue, oldValue);
				callback.__calling = false;
			}
		}
	}
}

function get(key) {
	return key ? this._state[key] : this._state;
}

function fire(eventName, data) {
	var handlers = eventName in this._handlers && this._handlers[eventName].slice();
	if (!handlers) return;

	for (var i = 0; i < handlers.length; i += 1) {
		handlers[i].call(this, data);
	}
}

function observe(key, callback, options) {
	var group = options && options.defer ? this._observers.post : this._observers.pre;

	(group[key] || (group[key] = [])).push(callback);

	if (!options || options.init !== false) {
		callback.__calling = true;
		callback.call(this, this._state[key]);
		callback.__calling = false;
	}

	return {
		cancel: function cancel() {
			var index = group[key].indexOf(callback);
			if (~index) group[key].splice(index, 1);
		}
	};
}

function on(eventName, handler) {
	if (eventName === 'teardown') return this.on('destroy', handler);

	var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	handlers.push(handler);

	return {
		cancel: function cancel() {
			var index = handlers.indexOf(handler);
			if (~index) handlers.splice(index, 1);
		}
	};
}

function set(newState) {
	this._set(assign({}, newState));
	this._root._flush();
}

function _flush() {
	if (!this._renderHooks) return;

	while (this._renderHooks.length) {
		this._renderHooks.pop()();
	}
}

module.exports = Display;

},{}],2:[function(require,module,exports){
'use strict';

var Display = require('./Display.html');

new Display({
	target: document.querySelector('body')
});

},{"./Display.html":1}]},{},[2]);
