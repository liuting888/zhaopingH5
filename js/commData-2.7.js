var commData = {
    // mobileUrl: getRealPath(), //接口地址
    mobileUrl: 'http://172.16.10.162:8080/Auxpolice1.0', //开发接口地址
};

var commMethod = {
    getCurrentDate: function () {
        var d = new Date(),
            year = d.getFullYear(),
            month = d.getMonth() + 1,
            day = d.getDate();

        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }
        return year + '-' + month + '-' + day;
    },
    //格式化时间
    formatTimeArr: function (date) {
        if (date) {
            var d = new Date(date),
                year = d.getFullYear(),
                month = d.getMonth() + 1,
                day = d.getDate(),
                time1 = '';
            if (month < 10) {
                month = '0' + month;
            }
            if (day < 10) {
                day = '0' + day;
            }
            time1 = year + '-' + month + '-' + day + '';
            return time1;
        }
    },
    //格式化年月
    formatTimeYearMonth: function (date) {
        if (date) {
            var d = new Date(date),
                year = d.getFullYear(),
                month = d.getMonth() + 1,
                day = d.getDate(),
                h = d.getHours(),
                m = d.getMinutes(),
                time1 = '';
            if (month < 10) {
                month = '0' + month;
            }
            if (day < 10) {
                day = '0' + day;
            };
            if (h < 10) {
                h = '0' + h;
            }
            if (m < 10) {
                m = '0' + m;
            }
            time1 = year + '-' + month + '-' + day + '  ' + h + ":" + m + ":00";
            return time1;
        }
    },
    //设置cookie
    setCookie: function (name, value, days) {
        var d = new Date();
        d.setTime(d.getTime() + 86400000);
        window.document.cookie = name + "=" + escape(value) + ";path=/;expires=" + d.toString();
    },
    //获取cookie
    getCookie: function (name) {
        var v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return v ? unescape(v[2]) : null;

    },
    //清除cookiie
    deleteCookie: function (name, value, days) {
        var d = new Date();
        d.setTime(d.getTime() - 1000);
        window.document.cookie = name + "=nvl;path=/;expires=" + d.toGMTString();
    },
    ajax: function (url, data, cb) {
        $.ajax({
            type: "POSt",
            url: url,
            data: data,
            dataType: "text",
            success: cb
        });
    },
    GetSearchArgs: function () {
        var qs = (window.location.search.length > 0 ? window.location.search.substring(1) : ''),
            args = {},
            items = qs.length ? qs.split('&') : [],
            item = null,
            name = null,
            value = null;
        for (var index = 0; index < items.length; index++) {
            item = items[index].split('=');
            name = decodeURIComponent(item[0]);
            value = decodeURIComponent(item[1]);
            if (name.length) {
                args[name] = value;
            }
        }
        return args;
    }
};
function getRealPath() { //获取项目路径
    var localObj = window.location;
    var contextPath = localObj.pathname.split("/")[1];
    // var basePath = localObj.protocol + "//" + localObj.host + "/" + contextPath + "/";
    var basePath = localObj.protocol + "//" + localObj.host;
    return basePath;
}
function exit() {
    var longinflag = commMethod.getCookie("loginflag");
    if (longinflag == '1') {
        window.location.href = commData.baseUrl + "/login.jsp?goto=4";
    } else {
        window.location.href = './login.html';
    }
}

function getResult(e) {
    if (e == undefined || e == 13) {
        var keyword = $('#keyword').val();
        if (keyword != '') {
            window.location.href = "./searchResult.html?keyword=" + keyword;
        }
    }
}
$.when($.ready).done(function () {
    $('.right-title a').attr('href', commData.baseUrl + "/hrm-lastver.apk");
    var username = commMethod.getCookie('username');
    if (username) {
        $("#username").text(username);
    }
    var roleid = commMethod.getCookie('roleId');
    var tgg = $("#toggle-control");
    var tat = $('#toggle-ul');
    if (roleid && roleid == 9) {
        $('.import-role').show();
    } else {
        $('.import-role').hide();
    }
    if (tgg) {
        $('#nav-list').on('click', '#toggle-control', function () {
            tat.slideToggle();
            if (!$($('#toggle-control').parent()).hasClass("active")) {
                $('.active').removeClass('active');
                tat.css('opacity', '1');
                $($(this).parent()).addClass('active');
            }
        });
    }
});