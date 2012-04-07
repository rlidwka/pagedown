var Markdown;

if (typeof exports === "object" && typeof require === "function") // we're in a CommonJS (e.g. Node.js) module
    Markdown = exports;
else
    Markdown = {};
    
(function () {

    function identity(x) { return x; }
    function returnFalse(x) { return false; }
    
	function HookCollection() { }

    HookCollection.prototype = {

        chain: function (hookname, func) {
            var original = this[hookname];
            if (original === identity)
                this[hookname] = func;
            else
                this[hookname] = function (x) { return func(original(x)); }
        },
        set: function (hookname, func) {
            this[hookname] = func;
        },
        addNoop: function (hookname) {
            this[hookname] = identity;
        },
        addFalse: function (hookname) {
            this[hookname] = returnFalse;
        }
    };


    // g_urls and g_titles allow arbitrary user-entered strings as keys. This
    // caused an exception (and hence stopped the rendering) when the user entered
    // e.g. [push] or [__proto__]. Adding a prefix to the actual key prevents this
    // (since no builtin property starts with "s_"). See
    // http://meta.stackoverflow.com/questions/64655/strange-wmd-bug
    // (granted, switching from Array() to Object() alone would have left only __proto__
    // to be a problem)
    function SaveHash() { }
    SaveHash.prototype = {
        set: function (key, value) {
            this["s_" + key] = value;
        },
        get: function (key) {
            return this["s_" + key];
        }
    };
	Markdown.HookCollection = HookCollection;

    Markdown.Converter = function () {
        var pluginHooks = this.hooks = new HookCollection();

        this.makeHtml = function (text) {
			return markdown.toHTML(text);
        };

    }; // end of the Markdown.Converter constructor

})();
