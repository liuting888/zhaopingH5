var commData = {
	// baseUrl: 'https://hrm.csgxcf.com', //基本接口地址
    // mobileUrl : 'https://hrm.csgxcf.com', //应聘者手机端接口地址
    // resumeUrl : 'https://hrm.csgxcf.com/pdfjs-dist/web/viewer.html?', //简历文件地址
    // resumeIpad: 'https://hrm.csgxcf.com/pdfjs-dist/web/viewer.html?',
   baseUrl: 'http://172.16.10.79:8080/HRM2018', //基本接口地址
//    mobileUrl: 'http://172.16.10.79:8080/HRM2018', //应聘者手机端接口地址
   mobileUrl: 'http://172.16.10.162:8080/Auxpolice1.0', //应聘者手机端接口地址
   resumeUrl: 'http://172.16.10.79:8080/HRM2018/pdfjs-dist/web/viewer.html?', //简历文件地址
   resumeIpad: 'http://172.16.10.79:8080/HRM2018/pdfjs-dist/web/viewer.html?',
    // newsChannelList: [
    //     {
    //         id: 0,
    //         value: "内部推荐"
    //     },
    //     {
    //         id: 1,
    //         value: "58同城"
    //     },
    //     {
    //         id: 2,
    //         value: "智联招聘"
    //     },
    //     {
    //         id: 3,
    //         value: "前程无忧"
    //     },
    //     {
    //         id: 4,
    //         value: "Boss直聘"
    //     },
    //     {
    //         id: 5,
    //         value: "拉勾"
    //     },
    //     {
    //         id: 6,
    //         value: "招财猫直聘"
    //     },
    //     {
    //         id: 7,
    //         value: "大街网"
    //     },
    //     {
    //         id:8,
    //         value: "脉脉"
    //     },
    //     {
    //         id: 9,
    //         value: "中华英才网"
    //     },
    //     {
    //         id: 10,
    //         value: "猎聘"
    //     },
    //     {
    //         id: 11,
    //         value: "店长急聘"
    //     },
    //     {
    //         id: 12,
    //         value: "领英"
    //     },
    //     {
    //         id: 13,
    //         value: "简历咖"
    //     },
    //     {
    //         id: 14,
    //         value: "纷简历"
    //     },
    //     {
    //         id: 15,
    //         value: "看准网"
    //     },
    //     {
    //         id: 16,
    //         value: "实习僧"
    //     },
    //     {
    //         id: 17,
    //         value: "兼职猫"
    //     },
    //     {
    //         id: 18,
    //         value: "口袋兼职"
    //     },
    //     {
    //         id: 19,
    //         value: "蚂蚁兼职"
    //     },
    //     {
    //         id: 20,
    //         value: "斗米兼职"
    //     }
    // ],
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
$.when($.ready).done(function(){
    $('.right-title a').attr('href',commData.baseUrl+"/hrm-lastver.apk");
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
    if(tgg){      
        $('#nav-list').on('click','#toggle-control' ,function () {
            tat.slideToggle();
            if (!$($('#toggle-control').parent()).hasClass("active")) {             
                 $('.active').removeClass('active');    
                 tat.css('opacity','1');
                 $($(this).parent()).addClass('active');
            }
        });
    }
});