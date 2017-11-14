/**
 * Created by ZhangXiaoQing on 2017-11-9.
 *
 * modify:
 *  （1）this.target本身就是jquery对象，将$(this.target)修改为this.target; 2017-11-13
 */
(function ($) {
    var ListCity = function (target) {
        this.target = target; //输入框
        this.gridContainer = ''; //城市Grid容器
        this.listContainer = ''; //列表容器
        this.container = ''; //插件容器
        this.isContainerExist = false; //插件容器是否已存在
        //默认参数
        this.defaluts = {
            cities: {
                inner: {
                    'HOT': ['厦门|XM|xiamen', '福州|FOC|fuzhou', '杭州|HZH|hangzhou', '天津|TSN|tianjin', '北京|BJ|beijing'],
                    'C': ['长沙|CS|changsha', '成都|CD|chengdu', '长白山|CBS|changbaishan', '重庆|CQ|chongqing|'],
                    'D': ['大连|DL|dalian'],
                    'F': ['福州|FZ|fuzhou'],
                    'B': ['北海|BH|beihai', '百色|BS|baise'],
                    'G': ['广州|GZ|guangzhou', '桂林|GL|guilin'],
                    'X': ['厦门|XM|xiamen']
                },
                outer: {
                    'HOT': ['齐齐哈尔|qiqihaer|qqhe', '石家庄|shijiazhuang|sjz', '沈阳|shenyang|sy', '思茅|simao|sm'],
                    'A': ['澳门|AM|aomen', '爱丁堡|ADB|aidingbao'],
                    'B': ['巴厘岛|BLD|balidao', '巴塞罗那|BSLN|basailuona', '巴黎|BL|bali'],
                    'D': ['大阪|DB|daban', '东京|DJ|dongjing']
                }
            },
            isKeyselect: true

        };
        //国内城市分类
        this.innerCity = {
            city: {
                "HOT": [],
                "ABCD": {},
                "EFGHJ": {},
                "KLMNOP": {},
                "QRSTW": {},
                "XYZ": {}
            },
            type: ''
        }
        //国外城市分类
        this.outerCity = {
            city: {
                "HOT": [],
                "ABCD": {},
                "EFGHJ": {},
                "KLMNOP": {},
                "QRSTW": {},
                "XYZ": {}
            },
            type: ''
        }
        //将国内和国外城市结合
        this.lists = [];
    }
    ListCity.prototype = {
        "constructor": ListCity,
        //初始化
        init: function (options) {
            if (!this.isValid(options))
                return;
            this.opts = $.extend({}, this.defaluts, options); //使用jQuery.extend 覆盖插件默认参数;
            console.log(this.opts);
            this.inner = this.sortData(this.opts.cities.inner); //国内
            this.outer = this.sortData(this.opts.cities.outer); //国际
            this.isKeyselect = this.opts.isKeyselect; //是否用上下键选择
            this.combineCities();
            this.orderByLetters(this.inner, this.innerCity, 'Domestic');
            this.orderByLetters(this.outer, this.outerCity, 'International');
            this.initParentContainer();
            this.tabToggle();
            this.searchLikeSth();
            this.cityGirdSelect();
            // this.keySelect();
        },
        //将国内和国外城市合并
        combineCities: function () {
            for (var key in this.inner) {
                if (key !== 'HOT') {
                    var arr = this.inner[key];
                    this.lists = this.lists.concat(arr);
                }
            }
            for (var key in this.outer) {
                if (key !== 'HOT') {
                    var arr = this.outer[key];
                    this.lists = this.lists.concat(arr);
                }
            }
        },
        //filed:键值；boo:布尔值(倒序or顺序); primer:类型
        sortBy: function (filed, boo, primer) {
            boo = (boo) ? -1 : 1;
            return function (a, b) {
                a = a[filed];
                b = b[filed];
                if (typeof (primer) != 'undefined') {
                    a = primer(a);
                    b = primer(b);
                }
                if (a < b) {
                    return boo * -1;
                }
                if (a > b) {
                    return boo * 1;
                }
                return 1;
            }
        },
        //排序的使用
        sortData: function (array) {
            var datas = [];
            for (var i in array) {
                var obj = {};
                obj.key = i;
                obj.val = array[i];
                datas.push(obj);
            }
            datas.sort(this.sortBy('key', false));
            var rtn = {};
            for (var i = 0; i < datas.length; i++) {
                var data = datas[i];
                rtn[data.key] = data.val;
            }
            return rtn;
        },
        //检测参数是否合法
        isValid: function (options) {
            return !options || (options && typeof options === "object") ? true : false;
        },
        //将国内和国外城市按照字母分类
        orderByLetters: function (city, varity, type) {
            varity.city.HOT = city.HOT;
            varity.type = type;
            for (var letGroup in varity.city) {
                if (letGroup !== 'HOT') {
                    var letArr = letGroup.split('');
                    for (var i = 0; i < letArr.length; i++) {
                        if (city[letArr[i]] !== undefined) {
                            varity.city[letGroup][letArr[i]] = city[letArr[i]];
                        }
                    }
                }
            }
        },
        //创建城市列表
        createCityGrid: function (cityObj) {
            var titList = '';
            var bodyList = '';
            var cityList = cityObj.city;
            var isShow = (cityObj.type === "Domestic") ? "style='display: block;'" : "style='display: none;'";
            for (var key in cityList) {
                if (key === 'HOT') {
                    titList += "<li rel='hot' class='active'>热门城市</li>";
                    bodyList += "<div class='city_body' rel='hot' style='display: block'><ul>";
                    for (var i = 0; i < cityList.HOT.length; i++) {
                        bodyList += "<li title='" + cityList.HOT[i].split('|')[0] + "' data-options='" + cityList.HOT[i].split('|')[1] + "'>" + cityList.HOT[i].split('|')[0] + "</li>";
                    }
                    bodyList += "</ul></div>"
                } else {
                    titList += "<li rel='" + key + "'>" + key + "</li>";
                    bodyList += "<div class='city_body' rel='" + key + "'>";
                    for (var letter in cityList[key]) {
                        var line = cityList[key][letter];
                        bodyList += "<div class='letter'><i>" + letter + "</i><ul>";
                        for (var i = 0; i < line.length; i++) {
                            bodyList += "<li data-options='" + line[i].split('|')[1] + "' title='" + line[i].split('|')[0] + "'>" + line[i].split('|')[0] + "</li>";
                        }
                        bodyList += "</ul></div>";
                    }
                    bodyList += "</div>";
                }
            }
            var str = '';
            str += " <div class='regional' rel='" + cityObj.type + "' " + isShow + ">" +
                "<div class='title'><ul>" + titList + "</ul></div>" +
                "<div class='body'>" + bodyList + "</div>" +
                "</div>";
            return str;
        },
        //初始化城市格
        initCityGrid: function () {
            if (this.isContainerExist)
                return;
            this.gridContainer = ".cityPanel";
            var str = '';
            str += "<div class='cityPanel'>" +
                "<div class='tips'><b>热门城市</b>（可直接输入城市名称或城市拼音）</div>" +
                "<div class='type'><ul><li rel='Domestic' class='active'>国内</li><li rel='International' class=''>国际/地区</li></ul> <div class='clear'></div></div>" +
                "<div class='close'>关闭</div>" +
                this.createCityGrid(this.innerCity) +
                this.createCityGrid(this.outerCity) +
                "</div>";
            return str;
        },
        //初始化父容器
        initParentContainer: function () {
            this.container = ".citybox";
            var str = '';
            str += "<div class='citybox'>" +
                this.initCityGrid() +
                "</div>";
            $("body").append(str);
            this.isContainerExist = true;
        },
        //tab切换,关闭城市
        tabToggle: function () {
            $(".type").on('click', 'li', function () {
                $(this).addClass('active').siblings().removeClass('active');
                $('.regional').hide(100);
                var rel1 = $(this).attr('rel');
                var len = $('.regional').length;
                for (var i = 0; i < len; i++) {
                    var curr = $('.regional')[i];
                    if ($(curr).attr('rel') === rel1) {
                        $(curr).fadeIn(200);
                        return;
                    }
                }
            });
            $(".regional .title").on('click', 'li', function () {
                $(this).addClass('active').siblings().removeClass('active');
                $(this).parents('.regional').find('.city_body').hide();
                var rel1 = $(this).attr('rel');
                var bodys = $(this).parents('.regional').find('.city_body');
                var len = bodys.length;
                for (var i = 0; i < len; i++) {
                    var curr = bodys[i];
                    if ($(curr).attr('rel') === rel1) {
                        $(curr).fadeIn(200);
                        if ($(curr).height() < 170) {
                            $(curr).css('overflow-y', 'hidden');
                        } else {
                            $(curr).css('overflow-y', 'auto');
                        }
                        return;
                    }
                }
            });
            //关闭城市
            $(".close").on("click", function () {
                $(this.container).hide();
            }.bind(this));
            //关闭城市
            $("body").on('click', function (evt) {
                if (!$(this.container).has($(evt.target))[0] && $(evt.target).attr('id') != this.target.attr('id')) {
                    $(this.container).hide();
                }
            }.bind(this));
        },
        //列表，结果，整体 显示切换
        toggleShow: function (param) {
            if (param === 'grid') {
                $(this.container).show();
                $(this.listContainer).hide();
                $(this.gridContainer).show();
            } else if (param === 'list') {
                $(this.container).show();
                $(this.listContainer).show();
                $(this.gridContainer).hide();
            }
        },
        //城市选择
        cityGirdSelect: function () {
            $(".city_body").on('click', 'li', function (e) {
                var val = $(e.target).attr('title');
                var code = $(e.target).data('options');
                this.target.val(val);
                this.target.data('code', code);
                $(this.container).hide();
            }.bind(this));
        },
        //城市列表模糊查询
        searchLikeSth: function () {
            // console.log(this.lists);
            this.target.on('input', function (evt) {
                var val = $.trim($(evt.target).val());
                var reg1 = /[^a-zA-Z\u4e00-\u9fff]/g; //只能是字母和汉字
                var str = val.replace(reg1, '');
                var hanzi = '';
                var letters = str;
                $(evt.target).val(str);
                if (str === '') {
                    return this.toggleShow('grid');
                }
                if (/[\u4e00-\u9fff]/g.test(str)) { // 有汉字
                    hanzi = str.replace(/[^\u4e00-\u9fff]/g, ''); //输入框中的汉字
                    if (/[a-z][A-Z]/g.test(str)) {
                        letters = str.replace(/[\u4e00-\u9fff]/g, ''); //输入框中的字母
                    } else {
                        letters = '1';
                    }
                } else if (/[a-z]|[A-Z]/g.test(str)) { //没有汉字
                    hanzi = '1';
                    letters = str;
                }
                var cities = [];
                var liststr = '';
                liststr += "<ul>";
                for (var i = 0; i < this.lists.length; i++) {
                    var city = this.lists[i];
                    var name = city.split('|')[0];
                    var code = city.split('|')[1].toLocaleLowerCase();
                    var alphabet = city.split('|')[2].toLocaleLowerCase();
                    if (alphabet.indexOf(letters) > -1 || code.indexOf(letters) > -1 || name.indexOf(hanzi) > -1) {
                        cities.push(city);
                        var classname = '';
                        if (cities.length == 1) {
                            classname = 'active';
                        }
                        liststr += "<li class='" + classname + "'>" +
                            "<span class='cityname'>" + name + "</span>" +
                            "<span class='citycode'>" + code + "</span>" +
                            "<span class='cityalpha'>" + alphabet + "</span>" +
                            "</li>";
                    }
                }
                liststr += "</ul>";
                this.createCityList(liststr);
            }.bind(this));
        },
        //创建列表
        createCityList: function (params) {
            this.listContainer = '.citylist';
            var str = "";
            str += "<div class='citylist'>" + params + "</div>";
            this.toggleShow('list');
            if (!!$(this.container).has($(this.listContainer))[0]) {
                $(this.listContainer).html(params);
            } else {
                $(this.container).append(str);
            }
            $(".citylist").on('click', 'li', function (e) {
                var val = $(e.target).children('.cityname').html();
                var code = $(e.target).children('.citycode').html();
                this.target.val(val);
                this.target.data('code', code);
                $(this.container).hide();
            }.bind(this));
            this.keySelect();
        },
        //上下键选择搜索结果
        keySelect: function () {
            var self = this;
            var current = $(self.listContainer).find('.active').index();
            $(self.target).on('keydown', function (e) {
                if (current !== -1) {
                    switch (e.keyCode) {
                        //上
                        case 38:
                            keyActive(false);
                            break;
                        //下
                        case 40:
                            keyActive(true);
                            break;
                        //确定
                        case 13:
                            self.isKeyselect = false;
                            $(self.target).val($(self.listContainer).find('.active .cityname').html());
                            $(self.target).data('code', $(self.listContainer).find('.active .citycode').html());
                            $(self.container).hide();
                            $(self.target).blur();
                            break;
                        default:
                            self.isKeyselect = false;
                            break;
                    }
                    ;
                    function keyActive(isInorder) {
                        var max = $(self.listContainer).find('li').length - 1;
                        if (isInorder) {
                            current = current == max ? 0 : current + 1;
                        } else {
                            current = current == 0 ? max : current - 1;
                        }
                        $(self.listContainer).find('li').eq(current).addClass('active').siblings().removeClass('active');
                        self.isKeyselect = true;
                    }
                }
            }.bind(this));
        }
    }
    // //判断:当前元素是否是被筛选元素的子元素或者本身
    // $.fn.isChildAndSelfOf = function (b) {
    //     return (this.closest(b).length > 0);
    // };
    var listcity = null;
    $.fn.listCity = function (options) {
        var target = $(this);
        target.on('focus', function (e) {
            var top = $(this).offset().top + $(this).outerHeight(),
                left = $(this).offset().left;
            if (!listcity) {
                listcity = new ListCity(target);
                listcity.init(options);
            }
            // listcity = listcity ? listcity : new ListCity(target);
            listcity.target = $(e.target);

            $(listcity.container).show().offset({
                'top': top + 7,
                'left': left
            });
            listcity.toggleShow('grid');
        })
        return this;
    }
})(jQuery);