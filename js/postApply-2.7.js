$(function () {

    init();
});

function init() {
    new Vue({
        el: '#app',
        data: function () {
            return {
                apiUrl: commData.mobileUrl,
                educationList: [], //学历
                marryList: [], //婚姻
                nationList: [], //民族
                politicList: [], //政治面貌
                sexList: [], //政治面貌
                deptIdList: [], //应聘地区
                fileSrc: '',
                form: {
                    name: "",
                    phone: "",
                    sex: "",
                    marriage: "",
                    nation: "",
                    politics: "",
                    education: "",
                    deptId: "",
                    wors: [{}, {}, {}],
                    fams: [{}, {}, {}],
                    edus: [{}, {}, {}],
                },
                sex: "",
                marriage: "",
                nation: "",
                politics: "",
                education: "",
                soldier: "",
                deptId: "",
                degree1: "",
                degree2: '',
                vitaeId: '',
                type: "",
                selectType: '',
                step: 1,
                activePicker: false,
                birth:new Date("1990-01-01"),
                flag: true,
                selectVisible: false,
                startDate: new Date("1990-01-01"),
                target: "",
                dataSlots: [{
                    values: [],
                    textAlign: 'center'
                }],
                data: [{
                    id: '1',
                    value: 'A'
                },
                {
                    id: '1',
                    value: 'B'
                },
                ]
            };
        },
        created: function () {
            var that = this;
            that.t = commMethod.GetSearchArgs().t;
            // that.getMarList();
            // that.getXLList();
            // that.getRelationList();
            $(".boot-step").css("height", $(window).height() + "px");
            $(".contant").css("margin-top", Math.floor(($(window).height() - $(".contant").outerHeight()) / 2) + "px").show();
            // that.getQrcodeTime();
            $("#nation,#deptId,#sex,#marriage,#politics,#education,#soldier").focus(function () {
                document.activeElement.blur();
            });
            that.getSelectFromDict();
            that.getDeptId();

        },
        computed: {
            showOrHide: function () {
                if (this.activePicker) {
                    return 'block'
                } else {
                    return 'none'
                }
            }
        },
        methods: {
            cancelPicker(val) {
                console.log(val);
                this.activePicker = false;
                Date.prototype.Format = function (fmt) { //author: meizz
                    var o = {
                        "M+": this.getMonth() + 1, //月份
                        "d+": this.getDate(), //日
                        "h+": this.getHours(), //小时
                        "m+": this.getMinutes(), //分
                        "s+": this.getSeconds(), //秒
                        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                        "S": this.getMilliseconds() //毫秒
                    };
                    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                    for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    return fmt;
                };
                this.form.birth=val.Format("yyyy-MM-dd");
            },
            getTime() {
                this.activePicker = true;
            },
            changepic(file) {
                var that = this;
                var reads = new FileReader();
                f = document.getElementById('file').files[0];
                that.form.photo = f;
                reads.readAsDataURL(f);
                reads.onload = function (e) {
                    that.fileSrc = this.result;
                };

            },
            //获取应聘地区
            getDeptId: function () {
                var vm = this;
                $.ajax({
                    url: vm.apiUrl + "/searchDeptsByFenju",
                    type: "POST",
                    data: {},
                    dataType: "json",
                    success: function (data) {
                        vm.deptIdList = data.list; //派出所
                        var that = vm;
                        var deptId = new MobileSelect({
                            trigger: "#deptId",
                            title: "选择派出所",
                            wheels: [{
                                data: that.deptIdList
                            }],
                            keyMap: {
                                id: 'deptId',
                                value: 'deptName'
                            },
                            callback: function (indexArr, data) {
                                that.form.deptId = data[0].deptId;
                                that.deptId = data[0].deptName;
                            }
                        });

                    },
                    error: function (err) { }
                });
            },
            //获取字典
            getSelectFromDict: function () {
                var vm = this;
                $.ajax({
                    url: vm.apiUrl + "/getRecruitDetailDict",
                    type: "POST",
                    data: {},
                    dataType: "json",
                    success: function (data) {
                        // console.log(data);
                        vm.educationList = data.education; //学历
                        vm.marryList = data.marry; //婚姻
                        vm.nationList = data.nation; //民族
                        vm.politicList = data.politic; //政治面貌
                        vm.sexList = data.sex; //政治面貌
                        var that = vm;
                        var nation = new MobileSelect({
                            trigger: "#nation",
                            title: "选择民族",
                            wheels: [{
                                data: that.nationList
                            }],
                            callback: function (indexArr, data) {
                                that.form.nation = data[0].id;
                                that.nation = data[0].value;
                            }
                        });
                        var sex = new MobileSelect({
                            trigger: "#sex",
                            title: "选择性别",
                            wheels: [{
                                data: that.sexList
                            }],
                            callback: function (indexArr, data) {
                                that.form.sex = data[0].id;
                                that.sex = data[0].value;
                            }
                        });
                        var marriage = new MobileSelect({
                            trigger: "#marriage",
                            title: "选择婚否",
                            wheels: [{
                                data: that.marryList
                            }],
                            callback: function (indexArr, data) {
                                that.form.marriage = data[0].id;
                                that.marriage = data[0].value;
                            }
                        });
                        var politics = new MobileSelect({
                            trigger: "#politics",
                            title: "选择政治面貌",
                            wheels: [{
                                data: that.politicList
                            }],
                            callback: function (indexArr, data) {
                                that.form.politics = data[0].id;
                                that.politics = data[0].value;
                            }
                        });
                        var education = new MobileSelect({
                            trigger: "#education",
                            title: "选择最高学历",
                            wheels: [{
                                data: that.educationList
                            }],
                            callback: function (indexArr, data) {
                                that.form.education = data[0].id;
                                that.education = data[0].value;
                            }
                        });
                        var soldier = new MobileSelect({
                            trigger: "#soldier",
                            title: "请选择",
                            wheels: [{
                                data: [{
                                    id: '0',
                                    value: '是'
                                },
                                {
                                    id: '1',
                                    value: '否'
                                },
                                ]
                            }],
                            callback: function (indexArr, data) {
                                that.form.soldier = data[0].id;
                                that.soldier = data[0].value;
                            }
                        });
                    },
                    error: function (err) { }
                });
            },
            //获取二维码有效期
            getQrcodeTime: function () {
                var that = this;
                $.ajax({
                    type: 'POST',
                    url: that.apiUrl + '/getQrcodeTime',
                    data: {
                        t: that.t
                    },
                    dataType: 'text',
                    success: function (res) {
                        res = JSON.parse(res);
                        var nowTime = new Date(),
                            month = nowTime
                                .getMonth() + 1,
                            day = nowTime
                                .getDate();
                        nowTime = '' + nowTime.getFullYear() +
                            (month < 10 ? '0' : '') + month +
                            (day < 10 ? '0' : '') + day;
                        if (!res.body || res.body.length != 8 ||
                            res.body < nowTime) {
                            $("#app").remove();
                            that.$messagebox("提示",
                                "二维码已失效，请联系招聘负责人");
                        }
                    }
                });
            },
            //pop打开
            Handler: function (select) {
                var that = this;
                that.selectType = select;
                that.$refs.select.open();
                switch (select) {
                    case "sex":
                        that.dataSlots = that.sexSlots;
                        break;
                    case "marry":
                        that.dataSlots = that.marrySlots;
                        break;
                    case "edu":
                        that.dataSlots = that.eduSlots;
                        break;
                    case "eduExp1":
                        that.dataSlots = that.eduSlots;
                        break;
                    case "eduExp2":
                        that.dataSlots = that.eduSlots;
                        break;
                    case "fmrel":
                        that.dataSlots = that.relationSlots;
                        break;
                    case "rsrel":
                        that.dataSlots = that.relationSlots;
                        break;
                    case "arriveTime":
                        that.dataSlots = that.arriveTimeSlots;
                        break;
                    default:
                        break;
                }
            },
            //pop确认
            selectChange: function (parma, value) {
                var that = this;
                if (that.selectType == 'sex') {
                    that.sex = value[0].value;
                    that.form.sex = value[0].id;
                } else if (that.selectType == 'marry') {
                    that.marriage = value[0].value;
                    that.form.marriage = value[0].id;
                } else if (that.selectType == 'edu') {
                    that.education = value[0].value;
                    that.form.education = value[0].id;
                } else if (that.selectType == 'eduExp1') {
                    that.degree1 = value[0].value;
                    that.form.eduExp1.degree = value[0].id;
                } else if (that.selectType == 'eduExp2') {
                    that.degree2 = value[0].value;
                    that.form.eduExp2.degree = value[0].id;
                } else if (that.selectType == 'fmrel') {
                    that.familyType = value[0].value;
                    that.form.familyType = value[0].id;
                } else if (that.selectType == 'rsrel') {
                    that.rstype = value[0].value;
                    that.form.rstype = value[0].id;
                } else if (that.selectType == 'arriveTime') {
                    that.form.arriveTime = value[0].value;
                }
            },
            //验证邮箱 
            checkEmail: function () {
                var regEmial = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //邮箱验证
                if (!regEmial.test(this.form.email)) {
                    this.$messagebox("提示", "请输入正确的邮箱");
                    this.form.email = '';
                }
            },
            addRecruit: function () {
                var defer = $.Deferred();
                var vm = this;
                // 用表单来初始化
                var formData = new FormData();
                for (var i in vm.form) {
                    if (i == "wors" || i == "fams" || i == "edus") {
                        formData.append(i, JSON.stringify(vm.form[i]));
                    } else {
                        formData.append(i, vm.form[i]);
                    }
                }
                $.ajax({
                    url: vm.apiUrl + "/addRecruit",
                    type: "POST",
                    data: formData,
                    processData: false,
                    contentType: false,
                    // dataType: "json",
                    success: function (data) {
                        if (data.errorCode == 0) {
                            vm.step = 5;
                            vm.flag = true;
                        } else {
                            vm.$messagebox("提示", data.errorMsg);
                            vm.step = 1;
                            vm.flag = true;
                        }
                        defer.resolve();
                    },
                    error: function (err) {
                        vm.$messagebox("提示", "添加失败，请重新填写");
                        vm.step = 1;
                        vm.flag = true;
                        defer.reject();
                    }
                });
                return defer;
            },
            goNext: function (val) {
                var that = this;
                if (val == 1) {
                    for (var i in that.form) {
                        if (i == "wors" || i == "fams" || i == "edus") {

                        } else {
                            // formData.append(i, that.form[i]);
                            if (!that.form[i]) {
                                return this.$messagebox("提示", "请完整输入信息");
                            }
                        }
                    }
                }
                if (that.step == 4) {
                    if (that.flag == true) {
                        that.addRecruit();
                        that.flag = false;
                    }
                } else {
                    that.step = parseInt(val) + 1;
                }

            }
        }
    });
}