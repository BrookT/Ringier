/* Member Javascript Package */
/* Version: 1.0 */
/* Author: Daniel */
/*Modified By Brook*/

(function () {
    var _language = {
        length: 2,
        0: {
            Client: "eng",
            Server: "en-US",
            IsDefault: false
        },
        1: {
            Client: "chs",
            Server: "zh-CN",
            IsDefault: true
        }
    };
    //全局操作
    var Rg = {
        //AJAX服务
        ajaxUrl: "/Service/AjaxService.asmx",
        //调试、开发模式
        debug: false,
        //语言模块
        language: {
            //获取当前语言
            getCurrentLanguage: function () {
                var lang = Rg.net.cookie("Language");
                if (Rg.string.isEmpty(lang)) {
                    if (Rg.string.contains(window.location.href, "/en/")) {
                        lang = "eng";
                    } else {
                        lang = "chs";
                    }
                }
                return lang;
            },
            //获取服务器语言
            getServerLanguage: function (language) {
                for (var i = 0; i < _language.length; i++) {
                    if (language == _language[i].Client) {
                        return _language[i].Server;
                    }
                }
                for (var i = 0; i < _language.length; i++) {
                    if (_language[i].IsDefault) {
                        return _language[i].Server;
                    }
                }
            },
            //获取客户端语言
            getClientLanguage: function (language) {
                for (var i = 0; i < _language.length; i++) {
                    if (language == _language[i].Server) {
                        return _language[i].Client;
                    }
                }
                for (var i = 0; i < _language.length; i++) {
                    if (_language[i].IsDefault) {
                        return _language[i].Client;
                    }
                }
            }
        }
    };
    //核心
    Rg.core = {};
    //字符串操作
    Rg.string = {
        //是否为Email
        isEmail: function (value) {
            return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
        },
        //是否整数
        isInteger: function (value) {
            return /^-?\d+$/.test(value);
        },
        //是否浮点数
        isFloat: function (value) {
            return /^(-?\d+)(\.\d+)?$/.test(value);
        },
        //是否合法IP
        isIP: function (value) {
            return /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/.test(value);
        },
        //是否日期(例:2005-12-12)
        isDate: function (value) {
            return /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))$/.test(value);
        },
        //是否身份证号
        isIdCardNo: function (value) {
            var factorArr = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);
            var varArray = new Array();
            var lngProduct = 0;
            var intCheckDigit;

            if ((value.length != 15) && (value.length != 18)) {
                return false;
            }
            for (i = 0; i < value.length; i++) {
                varArray[i] = value.charAt(i);
                if ((varArray[i] < '0' || varArray[i] > '9') && (i != 17)) {
                    return false;
                } else if (i < 17) {
                    varArray[i] = varArray[i] * factorArr[i];
                }
            }
            if (value.length == 18) {
                var date8 = value.substring(6, 14);
                if (checkDate(date8) == false) {
                    return false;
                }
                for (i = 0; i < 17; i++) {
                    lngProduct = lngProduct + varArray[i];
                }
                intCheckDigit = 12 - lngProduct % 11;
                switch (intCheckDigit) {
                    case 10:
                        intCheckDigit = 'X';
                        break;
                    case 11:
                        intCheckDigit = 0;
                        break;
                    case 12:
                        intCheckDigit = 1;
                        break;
                }
                if (varArray[17].toUpperCase() != intCheckDigit) {
                    return false;
                }
            } else {
                var date6 = value.substring(6, 12);
                if (checkDate(date6) == false) {
                    return false;
                }
            }
            return true;
        },
        //是否为URL
        isUrl: function (value) {
            return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
        },
        isDateISO: function (value) {
            return /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(value);
        },
        //是否为数字
        isNumber: function (value) {
            return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value);
        },
        //删除左边和右边空格
        trim: function (value) {
            return value.replace(/(^\s*)|(\s*$)/g, '');
        },
        //删除左边空格
        ltrim: function (value) {
            return value.replace(/^\s*/g, '');
        },
        //删除右边空格
        rtrim: function (value) {
            return value.replace(/\s*$/, '');
        },
        //字串是否有值
        isEmpty: function (value) {
            return (value == null || value == undefined || value.length <= 0);
        },
        //比较两字符串是否相等
        equals: function (str1, str2) {
            return (str1 == str2);
        },
        //忽略大小写比较两个字符串是否相等
        equalsIgnoreCase: function (str1, str2) {
            return (str1.toUpperCase() == str2.toUpperCase());
        },
        //是否包含指定字符
        contains: function (str, value) {
            return str.indexOf(value) > 0;
        },
        //将05/27/2012格式的字符串转化为2012-05-27格式
        toDateformat: function (str) {
            if (Rg.string.isEmpty(str)) {
                return "";
            }
            var arr = str.split(" ");
            var dateStr = arr[0].split("/");
            return dateStr[2] + "-" + dateStr[0] + "-" + dateStr[1];
        },
        //截取字符
        cutString: function (str, len) {
            if (Rg.string.isEmpty(str)) {
                return "";
            }
            var str_length = 0;
            var str_len = 0;
            var str_cut = new String();
            str_len = str.length;
            for (var i = 0; i < str_len; i++) {
                var a = str.charAt(i);
                str_length++;
                if (escape(a).length > 4) {
                    //中文字符的长度经编码之后大于4
                    str_length++;
                }
                str_cut = str_cut.concat(a);
                if (str_length >= len) {
                    str_cut = str_cut.concat("...");
                    return str_cut;
                }
            }
            //如果给定字符串小于指定长度，则返回源字符串；
            if (str_length < len) {
                return str;
            }
        }
    };
    //消息提示，必须引用jBox插件
    Rg.message = {
        alert: function (message) {
            $.jBox.alert(message, '');
        },
        info: function (message) {
            $.jBox.info(message, '');
        },
        success: function (message) {
            $.jBox.success(message, '');
        },
        error: function (message) {
            $.jBox.error(message, '');
        },
        tip: function (message, options) {
            $.jBox.tip(message, "info", options);
        }
    };
    //工具类
    Rg.tools = {
        //页面重定向
        replace: function (url) {
            //跳转到指定页面            
            window.location = url;
            //window.location.replace(url);
            //window.location.Reload();
        },
        //页面重定向
        redirect: function (action, parameterStr, method) {
            var customForm = document.createElement("form");
            customForm.id = "customForm";
            customForm.action = action;
            customForm.method = method == null ? "Post" : method;
            document.appendChild(customForm);
            var postData = new Array();
            if (parameterStr) {
                try {
                    var parameters = parameterStr.split('&');
                    for (var i = 0; i < parameters.length; i++) {
                        var keyAndValue = parameters[i].split('=');
                        var postItem = new Object();
                        postItem.ItemName = keyAndValue[0];
                        postItem.ItemValue = keyAndValue[1];
                        postData[i] = postItem;
                    }
                } catch (e) {
                    postData = new Array();
                }
            }
            if (postData.length > 0) {
                for (var i = 0; i < postData.length; i++) {
                    var hidden = document.createElement("input");
                    hidden.type = "hidden";
                    hidden.id = postData[i].ItemName;
                    hidden.value = postData[i].ItemValue;
                    customForm.appendChild(hidden);
                }
            }
            customForm.submit();
        },
        //引用JS或CSS文件
        importFile: function (path, file) {
            var files = typeof file == "string" ? [file] : file;
            for (var i = 0; i < files.length; i++) {
                var name = files[i].replace(/^\s|\s$/g, "");
                var att = name.split('.');
                var ext = att[att.length - 1].toLowerCase();
                var minExt = att[att.length - 2].toLowerCase();
                var para = "";
                var isMin = minExt == "min";
                var isJS = ext == "js";
                var isCSS = ext == "css";
                var debug = Rg.debug;
                if (!Rg.debug) {
                    para = isMin ? "" : "?minify=true";
                }
                if (isJS) {
                    document.write("<script type='text/javascript' src='" + path + name + para + "'></script>");
                } else if (isCSS) {
                    document.write("<link  type='text/css' rel='stylesheet' href='" + path + name + para + "'></link>");
                }
            }
        },
        //获取URL参数
        getUrlParam: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null)
                return unescape(r[2]);
            return null;
        },
        //分页类
        page: function (data, clickedClass, pageSideNumber, parentDomAttribute) {
            $(parentDomAttribute).empty();
            var pnum = parseInt(Rg.net.cookie("pnum"));
            var total = (data.total % data.perpage == 0) ? data.total / data.perpage : Math.ceil(data.total / data.perpage);
            var pageStartNumber = (pnum - pageSideNumber) < 1 ? 1 : (pnum - pageSideNumber);
            var pageEndNumber = (pnum + pageSideNumber) > total ? total : (pnum + pageSideNumber);
            var pageLengh = pageEndNumber - pageStartNumber + 1;
            var previousPage = (pnum == 1) ? 1 : pnum - 1;
            var nextPage = (pnum == total) ? total : pnum + 1;

            if (data.total < 1) {
                return;
            } else {
                $("<li/>").appendTo(parentDomAttribute);
                $("<a/>").attr("href", "javascript:void(0);").attr("title", 1).text(Resources.PageControl.First).appendTo(parentDomAttribute + " > li:eq(0)");
                $("<li/>").appendTo(parentDomAttribute);
                var first = $("<a/>");
                if (pnum != 1) {
                    first.attr("href", "javascript:void(0);");
                }
                first.attr("title", previousPage).text(Resources.PageControl.Previous).appendTo(parentDomAttribute + " > li:eq(1)");
                for (var i = 0; i < pageLengh; i++) {
                    $("<li/>").addClass(pnum == (pageStartNumber + i) ? clickedClass : "").appendTo(parentDomAttribute);
                    $("<a/>").attr("href", "javascript:void(0);").attr("title", pageStartNumber + i).text(pageStartNumber + i).appendTo(parentDomAttribute + " > li:eq(" + (i + 2) + ")");
                }
                $("<li/>").appendTo(parentDomAttribute);
                var last = $("<a/>");
                if (pnum != total) {
                    last.attr("href", "javascript:void(0);");
                }
                last.attr("title", nextPage).text(Resources.PageControl.Next).appendTo(parentDomAttribute + " > li:eq(" + (pageLengh + 2) + ")");
                $("<li/>").appendTo(parentDomAttribute);
                $("<a/>").attr("href", "javascript:void(0);").attr("title", total).text(Resources.PageControl.Last).appendTo(parentDomAttribute + " > li:eq(" + (pageLengh + 3) + ")");
            }
        }
    };
    //网络模块
    Rg.net = {
        //ajax操作
        ajax: {
            Post: {
                Ajax: function (postData, methodName, callback, error) {
                    $.ajax({
                        type: "POST",
                        cache: false,
                        contentType: "application/json;utf-8",
                        url: Rg.ajaxUrl + methodName,
                        data: postData == null ? "{}" : $.toJSON(postData),
                        dataType: "json",
                        success: callback,
                        error: error
                    });
                }
            },
            simpleAjax: {
                POST: function (postData, callback, error) {
                    $.ajax({
                        type: "POST",
                        cache: false,
                        url: Rg.ajaxUrl,
                        dataType: 'json',
                        data: postData == null ? "{}" : postData,
                        success: callback,
                        error: error
                    });
                },
                GET: function (postData, callback, error, needCache) {
                    var _cache = (Rg.string.isEmpty(needCache)) ? false : true;
                    $.ajax({
                        type: "GET",
                        cache: _cache,
                        url: Rg.ajaxUrl,
                        dataType: 'json',
                        data: postData == null ? "{}" : postData,
                        success: callback,
                        error: error
                    });
                }
            }
        },
        //cookie操作
        /**
        * Create a cookie with the given name and value and other optional parameters.
        *
        * @example $.cookie('the_cookie', 'the_value');
        * @desc Set the value of a cookie.
        * @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
        * @desc Create a cookie with all available options.
        * @example $.cookie('the_cookie', 'the_value');
        * @desc Create a session cookie.
        * @example $.cookie('the_cookie', null);
        * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
        *       used when the cookie was set.
        *
        * @param String name The name of the cookie.
        * @param String value The value of the cookie.
        * @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
        * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
        *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
        *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
        *                             when the the browser exits.
        * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
        * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
        * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
        *                        require a secure protocol (like HTTPS).
        * @type undefined
        *
        * @name $.cookie
        * @cat Plugins/Cookie
        * @author Klaus Hartl/klaus.hartl@stilbuero.de
        */
        /**
        * Get the value of a cookie with the given name.
        *
        * @example $.cookie('the_cookie');
        * @desc Get the value of a cookie.
        *
        * @param String name The name of the cookie.
        * @return The value of the cookie.
        * @type String
        *
        * @name $.cookie
        * @cat Plugins/Cookie
        * @author Klaus Hartl/klaus.hartl@stilbuero.de
        */
        cookie: function (name, value, options) {
            if (typeof value != 'undefined') {// name and value given, set cookie
                options = options || {};
                if (value === null) {
                    value = '';
                    options.expires = -1;
                }
                var expires = '';
                if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                    var date;
                    if (typeof options.expires == 'number') {
                        date = new Date();
                        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                    } else {
                        date = options.expires;
                    }
                    expires = '; expires=' + date.toUTCString();
                    // use expires attribute, max-age is not supported by IE
                }
                // CAUTION: Needed to parenthesize options.path and options.domain
                // in the following expressions, otherwise they evaluate to undefined
                // in the packed version for some reason...
                var path = options.path ? '; path=' + (options.path) : '';
                var domain = options.domain ? '; domain=' + (options.domain) : '';
                var secure = options.secure ? '; secure' : '';
                document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
            } else {// only name given, get cookie
                var cookieValue = null;
                if (document.cookie && document.cookie != '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = Rg.string.trim(cookies[i]);
                        // Does this cookie string begin with the name we want?
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }
        }
    };
    //初始化[加载必须脚本文件及样式表]
    Rg.init = function () {
        try {
            var path = "/content/Scripts/Plugs/";
            var sourcePath = "/content/Resources/";
            var files = ["jquery-1.5.1.min.js", "jquery.json-2.2.min.js", "jquery.validate.min.js", "jquery-plugin.js", "jquery.ba-bbq.min.js"];
            var lang = Rg.language.getCurrentLanguage();
            if (lang == "chs") {
                files.push("JQuery.Validate.Messages_cn.js");
                files.push("jquery.ui.datepicker-zh-CN.js");
            }
            Rg.tools.importFile(path, files);
            Rg.tools.importFile(sourcePath, Rg.language.getServerLanguage(lang) + ".js");
            Rg.tools.importFile(sourcePath + Rg.language.getServerLanguage(lang) + "/css/", "cmscustom.css");
            Rg.tools.importFile(path + "jquery-ui/js/", "jquery-ui-1.8.18.custom.min.js");
            Rg.tools.importFile(path + "jquery-ui/css/ui-lightness/", "jquery-ui-1.8.18.custom.css");
            Rg.tools.importFile(path + "jBox/Skins/Gray/", "jbox.css");
            Rg.tools.importFile(path + "jBox/", "jquery.jBox-2.3.min.js");
            Rg.tools.importFile(path + "jBox/i18n/", "jquery.jBox-zh-CN.js");
        } catch (e) {
        }
    };
    window.Rg = Rg;
})(window, document);


