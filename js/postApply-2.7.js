$(function() {

    init();
});

function init() {
    new Vue({
        el: '#app',
        data: function() {
            return {
                apiUrl: commData.mobileUrl,
                educationList: [], //学历
                marryList: [], //婚姻
                nationList: [], //民族
                politicList: [], //政治面貌
                sexList: [], //政治面貌
                form: {
                    name: "",
                    phone: "",
                    sex: "",
                    works: [{}, {}, {}],
                    families: [{}, {}, {}],
                    educations: [{}, {}, {}],
                },
                sex: "",
                marriage: '',
                education: '',
                degree1: "",
                degree2: '',
                vitaeId: '',
                type: "",
                selectType: '',
                step: 1,
                selectVisible: false,
                startDate: new Date("1990-01-01"),
                target: "",
                // marrySlots: [{
                //     values: [],
                //     textAlign: 'center'
                // }],
                // eduSlots: [{
                //     values: [],
                //     textAlign: 'center'
                // }],
                // relationSlots: [{
                //     values: [],
                //     textAlign: 'center'
                // }],
                dataSlots: [{
                    values: [],
                    textAlign: 'center'
                }],
                data: [{
                        id: '1',
                        title: 'A'
                    },
                    {
                        id: '1',
                        title: 'B'
                    },
                ]
            };
        },
        mounted() {
            var that = this;
            var nation = new MobileSelect({
                trigger: "#nation",
                title: "选择民族",
                wheels: [{
                    data: this.data
                        // data: [{
                        //         id: '1',
                        //         title: 'A'
                        //     },
                        //     {
                        //         id: '1',
                        //         title: 'B'
                        //     },
                        // ]
                }],
                keyMap: {
                    id: 'id',
                    value: 'title'
                },
                callback: function(indexArr, data) {
                    console.log(indexArr, data);
                    that.form.education = data[0].nation;
                }
            });
            var sex = new MobileSelect({
                trigger: "#sex",
                title: "选择性别",
                wheels: [{
                    data: this.data
                }],
                keyMap: {
                    id: 'id',
                    value: 'title'
                },
                callback: function(indexArr, data) {
                    console.log(indexArr, data);
                    that.form.education = data[0].sex;
                }
            });
            var marriage = new MobileSelect({
                trigger: "#marriage",
                title: "选择婚否",
                wheels: [{
                    data: this.data
                }],
                keyMap: {
                    id: 'id',
                    value: 'title'
                },
                callback: function(indexArr, data) {
                    console.log(indexArr, data);
                    that.form.education = data[0].marriage;
                }
            });
            var politics = new MobileSelect({
                trigger: "#politics",
                title: "选择政治面貌",
                wheels: [{
                    data: this.data
                }],
                keyMap: {
                    id: 'id',
                    value: 'title'
                },
                callback: function(indexArr, data) {
                    console.log(indexArr, data);
                    that.form.education = data[0].politics;
                }
            });
            var education = new MobileSelect({
                trigger: "#education",
                title: "选择最高学历",
                wheels: [{
                    data: this.data
                }],
                keyMap: {
                    id: 'id',
                    value: 'title'
                },
                callback: function(indexArr, data) {
                    console.log(indexArr, data);
                    that.form.education = data[0].id;
                }
            });

        },
        created: function() {
            var that = this;
            that.t = commMethod.GetSearchArgs().t;
            // that.getMarList();
            // that.getXLList();
            // that.getRelationList();
            $(".boot-step").css("height", $(window).height() + "px");
            $(".contant").css("margin-top", Math.floor(($(window).height() - $(".contant").outerHeight()) / 2) + "px").show();
            // that.getQrcodeTime();
            that.getSelectFromDict();
        },
        methods: {
            //获取字典
            getSelectFromDict: function() {
                var vm = this;
                $.ajax({
                    url: vm.apiUrl + "/getRecruitDetailDict",
                    type: "POST",
                    data: {},
                    dataType: "json",
                    success: function(data) {
                        // console.log(data);
                        vm.educationList = data.education; //学历
                        vm.marryList = data.marry; //婚姻
                        vm.nationList = data.nation; //民族
                        vm.politicList = data.politic; //政治面貌
                    },
                    error: function(err) {}
                });
                return defer;
            },
            //获取二维码有效期
            getQrcodeTime: function() {
                var that = this;
                $.ajax({
                    type: 'POST',
                    url: that.apiUrl + '/getQrcodeTime',
                    data: {
                        t: that.t
                    },
                    dataType: 'text',
                    success: function(res) {
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
            // 签到
            signIn: function() {
                var that = this;
                $.ajax({
                    type: 'POST',
                    url: that.apiUrl + '/queryVitaeIdByPhone',
                    data: {
                        phone: that.form.phone,
                        name: that.form.name
                    },
                    dataType: 'text',
                    success: function(res) {
                        res = JSON.parse(res);
                        if (res.code == 1) {
                            that.$messagebox("提示", "签到成功");
                            var arr = res.body.split(",");
                            that.vitaeId = arr[0];
                            $.ajaxSetup({
                                headers: {
                                    "hrm-token": arr[1]
                                }
                            });
                            that.getApplicationInfo(arr[0]);
                            $("#qdtit").text("填写职位申请表");
                        } else {
                            that.$messagebox("提示", res.body);
                        }
                    }
                });
            },

            //获取简历申请表信息
            getApplicationInfo: function(val) {
                var that = this;
                $.ajax({
                    type: 'POST',
                    url: that.apiUrl + '/queryApplicationInfoByVitaeId',
                    data: {
                        vitaeId: val
                    },
                    dataType: 'json',
                    success: function(res) {
                        that.$data.step = 1;
                        res = res.body;
                        if (res.msg) return true;
                        that.sex = res.application.sex == 1 ? "男" : '女';
                        that.form.sex = res.application.sex;
                        that.form.idcard = res.application.idcard;
                        that.form.age = res.application.age + '';
                        that.marriage = res.application.marrDesc;
                        that.form.marriage = res.application.marriage;
                        that.form.address = res.application.address;
                        that.form.jobAge = res.application.jobAge + '';
                        that.form.email = res.application.email;
                        that.form.education = res.application.education;
                        that.education = res.application.eduDesc;
                        that.form.expectSalary = res.application.expectSalary + '';
                        that.form.arriveTime = res.application.arriveTime;
                        that.form.eduExp1.startDate = res.education[0].startDate;
                        that.form.eduExp1.finishDate = res.education[0].finishDate;
                        that.form.eduExp1.school = res.education[0].school;
                        that.form.eduExp1.degree = res.education[0].degree;
                        that.degree1 = res.education[0].degreeName;
                        that.form.eduExp1.specialty = res.education[0].specialty;
                        that.form.eduExp2.startDate = res.education[1].startDate;
                        that.form.eduExp2.finishDate = res.education[1].finishDate;
                        that.form.eduExp2.school = res.education[1].school;
                        that.form.eduExp2.degree = res.education[1].degree;
                        that.degree2 = res.education[1].degreeName;
                        that.form.eduExp2.specialty = res.education[1].specialty;
                        that.form.workExp1.startDate = res.workexper[0].startDate;
                        that.form.workExp1.finishDate = res.workexper[0].finishDate;
                        that.form.workExp1.company = res.workexper[0].company;
                        that.form.workExp1.position = res.workexper[0].position;
                        that.form.workExp1.salary = res.workexper[0].salary;
                        that.form.workExp1.contact = res.workexper[0].contact;
                        that.form.workExp1.cophone = res.workexper[0].cophone;
                        that.form.workExp1.leaveReason = res.workexper[0].leaveReason;
                        that.form.workExp2.startDate = res.workexper[1].startDate;
                        that.form.workExp2.finishDate = res.workexper[1].finishDate;
                        that.form.workExp2.company = res.workexper[1].company;
                        that.form.workExp2.position = res.workexper[1].position;
                        that.form.workExp2.salary = res.workexper[1].salary + '';
                        that.form.workExp2.contact = res.workexper[1].contact;
                        that.form.workExp2.cophone = res.workexper[1].cophone;
                        that.form.workExp2.leaveReason = res.workexper[1].leaveReason;
                        that.form.workExp3.startDate = res.workexper[2].startDate;
                        that.form.workExp3.finishDate = res.workexper[2].finishDate;
                        that.form.workExp3.company = res.workexper[2].company;
                        that.form.workExp3.position = res.workexper[2].position;
                        that.form.workExp3.salary = res.workexper[2].salary + '';
                        that.form.workExp3.contact = res.workexper[2].contact;
                        that.form.workExp3.cophone = res.workexper[2].cophone;
                        that.form.workExp3.leaveReason = res.workexper[2].leaveReason;
                        that.familyType = res.application.familyTypeDesc;
                        that.form.familyType = res.application.familyType;
                        that.form.familyName = res.application.familyName;
                        that.form.familyPhone = res.application.familyPhone;
                        that.form.familyAddr = res.application.familyAddr;
                        that.form.isDismiss = res.application.isDismiss == '1' ? '是' : '否';
                        that.form.isBreaklaw = res.application.isBreaklaw == '1' ? '是' : '否';
                        that.form.isSicken = res.application.isSicken == '1' ? '是' : '否';
                        that.form.isGroom = res.application.isGroom == '1' ? '是' : '否';
                        that.form.isRelation = res.application.isRelation == '1' ? '是' : '否';
                        that.form.rsName = res.application.rsName;
                        that.form.rsDept = res.application.rsDept;
                        that.form.rsPost = res.application.rsPost;
                        that.form.rstype = res.application.rstype;
                        that.rstype = res.application.rstypeDesc;
                    }
                });
            },
            // //获取婚姻状况
            // getMarList: function() {
            //     var that = this;
            //     $.ajax({
            //         type: 'POST',
            //         url: that.apiUrl + '/queryDictsByItemType',
            //         data: {
            //             type: "marriage"
            //         },
            //         dataType: 'json',
            //         success: function(res) {
            //             res = JSON.parse(res.body);
            //             that.$data.marrySlots[0].values = res;
            //         }
            //     });
            // },

            // //获取关系
            // getRelationList: function() {
            //     var that = this;
            //     $.ajax({
            //         type: 'POST',
            //         url: that.apiUrl + '/queryDictsByItemType',
            //         data: {
            //             type: "relation"
            //         },
            //         dataType: 'json',
            //         success: function(res) {
            //             res = JSON.parse(res.body);
            //             that.$data.relationSlots[0].values = res;
            //         }
            //     });
            // },
            // //获取学历列表
            // getXLList: function() {
            //     var that = this;
            //     $.ajax({
            //         type: 'POST',
            //         url: that.apiUrl + '/queryDictsByItemType',
            //         data: {
            //             type: "education"
            //         },
            //         dataType: 'json',
            //         success: function(res) {
            //             res = JSON.parse(res.body);
            //             that.$data.eduSlots[0].values = res;
            //         }
            //     });
            // },
            //pop打开
            Handler: function(select) {
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
            selectChange: function(parma, value) {
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
            checkEmail: function() {
                var regEmial = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //邮箱验证
                if (!regEmial.test(this.form.email)) {
                    this.$messagebox("提示", "请输入正确的邮箱");
                    this.form.email = '';
                }
            },
            goNext: function(val) {
                var that = this;
                that.step = parseInt(val) + 1;
                // switch (val) {
                //     case '1':
                //         var regPos = /^\d+(\.\d+)?$/; //非负浮点数
                //         if (!regPos.test(that.form.expectSalary)) {
                //             that.$messagebox("提示", "请输入正确的期望薪资");
                //         } else {
                //             if (that.form.email == '' || that.form.age == '' || that.form.marriage == '' || that.form.address == '' || that.form.education == '' || that.form.expectSalary == '' || that.form.arriveTime == '') {
                //                 that.$messagebox("提示", "红色标记处不能为空");
                //             } else {
                //                 $.ajax({
                //                     type: 'POST',
                //                     url: that.apiUrl + '/insertRczpApplication',
                //                     data: {
                //                         vitaeId: that.vitaeId,
                //                         name: that.form.name.trim(),
                //                         sex: that.form.sex,
                //                         idcard: that.form.idcard.trim(),
                //                         age: that.form.age,
                //                         phone: that.form.phone.trim(),
                //                         email: that.form.email.trim(),
                //                         jobAge: that.form.jobAge.trim(),
                //                         marriage: that.form.marriage,
                //                         address: that.form.address.trim(),
                //                         education: that.form.education,
                //                         eduDesc: that.education,
                //                         expectSalary: that.form.expectSalary.trim(),
                //                         arriveTime: that.form.arriveTime
                //                     },
                //                     dataType: 'json',
                //                     success: function(res) {
                //                         if (res.code == 1) {
                //                             that.$messagebox("提示", "填写成功");
                //                             setTimeout(function() {
                //                                 that.$data.step = 2;
                //                             }, 500);
                //                         } else {

                //                         }
                //                     }
                //                 });
                //             }
                //         }
                //         break;
                //     case '2':
                //         if (that.form.eduExp1.startDate == '' || that.form.eduExp1.finishDate == '' || that.form.eduExp1.school == '' || that.form.eduExp1.degree == '') {
                //             that.$messagebox("提示", "红色标记处不能为空");
                //         } else {
                //             $.ajax({
                //                 type: 'POST',
                //                 url: that.apiUrl + '/insertEducation',
                //                 data: {
                //                     vitaeId: that.vitaeId,
                //                     education1: JSON.stringify(that.form.eduExp1),
                //                     education2: JSON.stringify(that.form.eduExp2),
                //                 },
                //                 dataType: 'json',
                //                 success: function(res) {
                //                     if (res.code == 1) {
                //                         that.$messagebox("提示", "填写成功");
                //                         setTimeout(function() {
                //                             that.$data.step = 3;
                //                         }, 500);
                //                     } else {

                //                     }
                //                 }
                //             });
                //         }
                //         break;
                //     case '3':
                //         $.ajax({
                //             type: 'POST',
                //             url: that.apiUrl + '/insertWorkexper',
                //             data: {
                //                 vitaeId: that.vitaeId,
                //                 work1: JSON.stringify(that.form.workExp1),
                //                 work2: JSON.stringify(that.form.workExp2),
                //                 work3: JSON.stringify(that.form.workExp3),
                //             },
                //             dataType: 'json',
                //             success: function(res) {
                //                 if (res.code == 1) {
                //                     that.$messagebox("提示", "填写成功");
                //                     setTimeout(function() {
                //                         that.$data.step = 4;
                //                     }, 500);
                //                 } else {

                //                 }
                //             }
                //         });

                //         break;
                //     case '4':
                //         var reg = /^1\d{10}$/;
                //         if (that.form.familyType == '' || that.form.familyName == '' || that.form.familyPhone == '' || that.form.familyAddr == '') {
                //             that.$messagebox("提示", "红色标记处不能为空");
                //         } else {
                //             if (!reg.test(that.form.familyPhone)) {
                //                 that.$messagebox("提示", "请填写正确手机号");
                //             } else {
                //                 $.ajax({
                //                     type: 'POST',
                //                     url: that.apiUrl + '/updateRczpApplication',
                //                     data: {
                //                         inviteId: that.vitaeId,
                //                         vitaeId: that.vitaeId,
                //                         name: that.form.name.trim(),
                //                         idcard: that.form.idcard.trim(),
                //                         phone: that.form.phone.trim(),
                //                         familyType: that.form.familyType,
                //                         familyName: that.form.familyName.trim(),
                //                         familyPhone: that.form.familyPhone.trim(),
                //                         familyAddr: that.form.familyAddr.trim(),
                //                         isDismiss: that.form.isDismiss == "是" ? "1" : "0",
                //                         isBreaklaw: that.form.isBreaklaw == "是" ? "1" : "0",
                //                         isSicken: that.form.isSicken == "是" ? "1" : "0",
                //                         isGroom: that.form.isGroom == "是" ? "1" : "0",
                //                         isRelation: that.form.isRelation == "是" ? "1" : "0",
                //                         rsName: that.form.rsName.trim(),
                //                         rsDept: that.form.rsDept.trim(),
                //                         rsPost: that.form.rsPost.trim(),
                //                         rstype: that.form.rstype,
                //                         drivers: '',
                //                         qualify: '',
                //                         other: '',
                //                     },
                //                     dataType: 'json',
                //                     success: function(res) {
                //                         if (res.code == 1) {
                //                             that.$messagebox("提示", "填写成功,等待面试");
                //                             that.form.name = "";
                //                             that.form.phone = "";
                //                             setTimeout(function() {
                //                                 that.$data.step = 5;
                //                             }, 500);
                //                         } else {}
                //                     }
                //                 });
                //             }
                //         }
                //         break;
                //     default:
                //         break;

                // }
            }
        }
    });
}