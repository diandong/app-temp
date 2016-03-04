/**
 * app-temp 模板插件
 * 基于jQuery
 */
+ function($) {
    "use strict";
    // 默认实例化配置
    var defaults = {
        src: null, //数据源，可以是一个url或者一个json数据
        tempId: null, //模板id，如'#temp',默认在实例对象里面寻找noscript
        data: null, //同ajax的data
        type: 'GET', //同ajax的type
        dataType: 'JSON', //同ajax的dataType
        filter: null, //得到数据后，在渲染之前的处理函数
        final: null, //替换变量后将数据渲染到页面前的处理函数，常用于添加头尾的html标签
        complete: null, //所有渲染完成的回调函数
        dataKey: 'app-temp' //实例化后的data键值，方便后续通过data('app-temp')取出；
    };

    /**
     * app-temp模板插件
     */
    $.fn.app_temp = function(options) {
        var _this = $(this),
            _num = _this.length;
        // 当要实例的对象只有一个时，直接实例化返回对象；
        if (_num === 1) {
            return new APP_temp(_this, options);
        };
        // 当要实例的对象有多个时，循环实例化，不返回对象；
        if (_num > 1) {
            _this.each(function(index, el) {
                new APP_temp($(el), options);
            })
        }
    };

    function APP_temp(el, opt) {
        if (typeof opt == 'string') {
            opt = { src: opt }
        }
        this._opt = $.extend(true, {}, defaults, opt);
        this.el = el;
        return this._init();
    }
    APP_temp.prototype = {
        // init
        _init: function() {
            var _data = this.el.data(this._opt.dataKey);
            if (_data)
                return _data;
            else
                this.el.data(this._opt.dataKey, this);

            // 获取模版,绑定事件
            this._setTemp()._render();
        },

        // 获取模版
        _setTemp: function() {
            var _tempObj = $(this._opt.tempId);
            _tempObj = _tempObj.length ? _tempObj : this.el.find('script');
            this.temp = _tempObj.html();
            return this;
        },

        // 发送ajax请求
        _ajax: function(callback) {
            var _this = this;
            var _url = _this._opt.src;
            if (typeof _url == 'object') {
                return backData(_url);
            }
            $.ajax({
                url: _url,
                type: _this._opt.type,
                dataType: _this._opt.dataType,
                data: _this._opt.data,
                success: function(data) {
                    backData(data);
                },
                complete: function() {

                }
            });

            function backData(data) {
                _this.srcData = data;
                _this.data = data;
                if (typeof _this._opt.filter == 'function') {
                    _this.data = _this._opt.filter(data);
                }
                callback(_this.data);
            }
        },

        // 渲染模板
        _render: function() {
            var _this = this;
            // 如果没有数据，发送请求
            if (_this.data === undefined) {
                return _this._ajax(function() {
                    _this._render();
                });
            }
            // 渲染
            if (_this.data.length === undefined) {
                _this.renderData = renderData(_this.data, _this.temp, _this.srcData);
            } else {
                _this.renderData = [];
                for (var i = 0, l = _this.data.length; i < l; i++) {
                    var _temp = renderData(_this.data[i], _this.temp, _this.srcData, i + 1)
                    _this.renderData.push(_temp);
                }
                _this.renderData = _this.renderData.join('');
            }

            // 对html进行最后一步处理
            if (_this._opt.final == 'function') {
                _this.renderData = _this._opt.final;
            }

            _this.el.html(_this.renderData);
        },

        // 渲染模板 - public
        render: function(src) {
            if (src) {
                this._opt.src = src;
            }
            this.data = undefined;
            this._render();
        },

        // 切换模板 -public
        setTemp: function(tempSrc) {
            var _obj = $(tempSrc);
            if (_obj.length == 1 && tempSrc.indexOf('#') == 0) {
                this._opt.tempId = tempSrc;
                this._setTemp();
            } else {
                this.temp = tempSrc;
            }
            return this;
        }
    };

    // 替换模板变量，使用独立函数，最小化作用域
    function renderData(row, _temp, _srcData, _no) {
        var __reg = new RegExp("({{.*?}})", "g");
        return _temp.replace(__reg, function(_tag) {
            var __code = _tag.substring(2, _tag.length - 2);
            var _res = eval(__code);
            return _res === undefined ? '' : _res;
        });
    }
}(jQuery);
