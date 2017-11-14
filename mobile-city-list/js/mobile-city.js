/**
 * Created by ZhangXiaoQing on 2017-11-10.
 * city-widget is specially for mobilephone;
 */

(function ($) {

    var MobileCity = function (target) {
        this.target = target; //调用本插件的jquery对象
        this.cityType = 'Domestic'; //当前选择是国内or国外
        this.container = ''; //插件的最外层容器
        this.listAllContainer = ''; //列举所有城市的容器
        this.retContainer = ''; //模糊搜索容器
        this.isContainerExist = false; //插件是否已存在
        this.searchTarget = ''; //模糊搜索的input
        //默认参数
        this.defaluts = {
            cities: {
                inner: {
                    'HOT': ['厦门|XM|xiamen', '福州|FOC|fuzhou', '杭州|HZH|hangzhou', '天津|TSN|tianjin', '北京|BJ|beijing'],
                    'C': ['长沙|CS|changsha', '成都|CD|chengdu', '长白山|CBS|changbaishan', '重庆|CQ|chongqing|'],
                    'D': ['大连|DL|dalian'],
                    'F': ['福州|FZ|fuzhou'],
                    'B': ['北海|BH|beihai', '百色|BS|baise', '北京|BJ|beijing'],
                    'G': ['广州|GZ|guangzhou', '桂林|GL|guilin'],
                    'H': ['海口|HK|haikou', '哈尔滨|HRB|haerbin', '淮安|HA|huaian', '杭州|HZH|hangzhou'],
                    'X': ['厦门|XM|xiamen'],
                    'T': ['天津|TSN|tianjin']
                },
                outer: {
                    'HOT': ['齐齐哈尔|qiqihaer|qqhe', '石家庄|shijiazhuang|sjz', '沈阳|shenyang|sy', '思茅|simao|sm'],
                    'A': ['澳门|AM|aomen', '爱丁堡|ADB|aidingbao', '阿尔山|YIE|aershan', '阿克苏|AKU|akesu'],
                    'B': ['巴厘岛|BLD|balidao', '巴塞罗那|BSLN|basailuona', '巴黎|BL|bali', '保山|BSD|baoshan'],
                    'F': ['福州|FZ|fuzhou'],
                    'D': ['大阪|DB|daban', '东京|DJ|dongjing'],
                    'G': ['广州|GZ|guangzhou', '桂林|GL|guilin'],
                    'H': ['海口|HK|haikou', '哈尔滨|HRB|haerbin', '淮安|HA|huaian']
                }
            }, //所有城市
            isCurrentSelectShow: true, //是否显示当前选择
            isHotShow: true, //是否显示热门城市
            isFuzzySearch: true //是否提供模糊搜索入口
        };
        //国内国外城市合并
        this.lists = [];
    }
    MobileCity.prototype = {
        "constructor": MobileCity,
        //初始化
        init: function (options) {
        	this.target.blur();
            if (!this.isValid(options))
                return;
            this.opts = $.extend({}, this.defaluts, options); //使用jQuery.extend 覆盖插件默认参数;
            this.isCurrentSelectShow = this.opts.isCurrentSelectShow; //是否显示当前选择
            this.isHotShow = this.opts.isHotShow; //是否显示热门城市
            this.isFuzzySearch = this.opts.isFuzzySearch; //是否提供模糊搜索入口
            this.inner = this.sortData(this.opts.cities.inner); //国内
            this.outer = this.sortData(this.opts.cities.outer); //国际
            this.combineCities(); //合并国内国际，模糊搜索时使用
            this.inner.type = 'Domestic';
            this.outer.type = 'International';
            this.createOuterContainer();
            this.toggleTab();
            this.searchLikeSth();
            this.fastPosition();
            this.cityselect();
        },
        //检测参数是否合法
        isValid: function (options) {
            return !options || (options && typeof options === "object") ? true : false;
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
        //将国内和国外城市合并
        combineCities: function () {
            for (var key in this.inner) {
                if (key !== 'hot') {
                    var arr = this.inner[key];
                    this.lists = this.lists.concat(arr);
                }
            }
            for (var key in this.outer) {
                if (key !== 'hot') {
                    var arr = this.outer[key];
                    this.lists = this.lists.concat(arr);
                }
            }
        },
        //最外层容器
        createOuterContainer: function () {
            this.container = ".citybox";
            var str = '';
            str += "<div class='citybox'>" +
                this.fuzzySearch() +
                this.listAllCity() +
                "</div>";
            $('body').append(str);
        },
        //列举所有城市列表
        listAllCity: function () {
            this.listAllContainer = '.citypanel';
            var str = '';
            str += "<div class='citypanel' "+this.stylePadAll +">" +
                "<ul class='city-type'> <li rel='Domestic' class='active'>国内</li>" +
                " <li rel='International'>国际/地区</li> </ul>" +
                this.currentCity() + this.regionalCity(this.inner) + this.regionalCity(this.outer)
            "</div>";
            return str;
        },
        //当前选择城市
        currentCity: function () {
            var currstr = '';
            if (this.isCurrentSelectShow) {
                currstr += "<div class='current-city'> <span>当前</span><ul>";
                currstr += "<li data-options='TSN'>天津</li><li data-options='AOG'>鞍山</li>";
                currstr += "</ul></div>";
            }
            return currstr;
        },
        //城市列表（含字母）和字母导航
        regionalCity: function (param) {
            // 城市列表
            var cities = '';
            var letterNav = '';
            var type = param.type;
            var isShow = (type == "Domestic" ? "style='display: block;'" : '');

            cities += "<div class='region-box' rel='" + type + "' " + isShow + ">";
            letterNav += "<div class='pos-nav' rel='" + type + "' " + isShow + "><ul>";

            if (this.isHotShow) {
                cities += this.hotCity(param.HOT);
                letterNav += "<li rel='hot'>热门</li>"
            }
            for (var key in param) {
                var data = param[key];
                if (key !== "HOT" && key !== 'type') {
                    cities += "<div class='list' rel='" + key + "'> <span class='letter'>" + key + "</span><ul>";
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        cities += "<li data-options='" + item.split('|')[1] + "'><a href=''>";
                        cities += "<span class='cityname'>" + item.split('|')[0] + "</span>" +
                            "<span class='citycode'>" + item.split('|')[1] + "</span>" +
                            "</a></li>";
                    }
                    cities += "</ul></div>";
                    letterNav += "<li rel='" + key + "'>" + key + "</li>";
                }
            }
            letterNav += "</ul></div>";
            cities += "</div>";

            var bigletter = '';
            bigletter += "<div class='big-letter'>A</div>";

            return cities + letterNav + bigletter;
        },
        //热门城市
        hotCity: function (data) {
            var hotcities = '';
            if (this.isHotShow) {
                hotcities += "<div class='hot-city' rel='hot'><span>热门</span><ul>";
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    hotcities += "<li data-options='" + item.split('|')[1] + "'>" + item.split('|')[0] + "</li>";
                }
                hotcities += "</ul></div>";
                return hotcities;
            }
            return '';
        },
        toggleTab: function () {
            var self = this;
            $('.city-type').on('click', 'li', function () {
                $(this).addClass('active').siblings().removeClass('active');
                var rel = $(this).attr('rel');
                self.cityType = rel;
                $('.region-box').hide();
                $('.region-box[rel="' + rel + '"]').show();
                $('.pos-nav').hide();
                $('.pos-nav[rel="' + rel + '"]').show();
            });
        },
        //快读滚动到字母所在位置
        fastPosition: function () {
            var self = this;
            $(".pos-nav").on('click', 'li', function (evt) {
                $(this).addClass('active').siblings().removeClass('active');
                var letter = $(this).attr('rel');
                $(".big-letter").fadeIn(200).html(letter);
                $(".big-letter").fadeOut(300);

                var scroll_offset = $(".region-box[rel='" + self.cityType + "'] div[rel='" + letter + "']").offset();
                $("body,html").animate({
                    scrollTop: scroll_offset.top - 10
                }, 100);
            });
        },
        fuzzySearch: function () {
            var seastr = '';
            this.stylePadList = "";
            this.stylePadAll = "";
            if (this.isFuzzySearch) {
                this.searchTarget = "#search-city-fast";
                seastr += "<div class='search-wrap'><input type='text' id='search-city-fast' class='form-input' style='width: 80%;margin: 10px auto;'></div>";
                this.stylePadList = "style='padding-top:50px;'";
                this.stylePadAll = "style='padding-top:100px;'";
            }
            return seastr;
        },
        //模糊查询
        searchLikeSth: function () {
            // $('body').on('focus',this.searchTarget,function () {
            //    alert('终于成功');
            // });
            $('body').on('input', this.searchTarget, function (evt) {
                var val = $.trim($(evt.target).val());
                var reg1 = /[^a-zA-Z\u4e00-\u9fff]/g; //只能是字母和汉字
                var str = val.replace(reg1, '');
                var hanzi = '';
                var letters = str;
                $(evt.target).val(str);
                if (str === '') {
                    return this.toggleShow('all');
                }
                if (/[\u4e00-\u9fff]/g.test(str)) { // 有汉字
                    hanzi = str.replace(/[^\u4e00-\u9fff]/g, ''); //输入框中的汉字
                    if (/[a-z][A-Z]/g.test(str)) {
                        letters = str.replace(/[\u4e00-\u9fff]/g, '').toLocaleLowerCase(); //输入框中的字母
                    } else {
                        letters = '1';
                    }
                } else if (/[a-z]|[A-Z]/g.test(str)) { //没有汉字
                    hanzi = '1';
                    letters = str.toLocaleLowerCase();
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
        //选择城市
        cityselect: function () {
            var self = this;
            $(this.listAllContainer).on('click', 'li', function (evt) {
                evt.preventDefault();
                var len1 = $(this).parents('.pos-nav').length;
                var len3 = $(this).find('.cityname').length;
                var len2 = $(this).parents('.city-type').length;
                if (!(len1 || len2)) {
                    if (len3 == 0) {
                        self.target.val($(this).text());
                        self.target.data('code', $(this).data('options'));
                    } else {
                        self.target.val($(this).find('.cityname').text());
                        self.target.data('code', $(this).find('.citycode').text());
                    }
                    $(self.container).hide();
                }
            });
        },
        //创建列表
        createCityList: function (params) {
            this.retContainer = '.citylist';
            var str = "";
            str += "<div class='citylist' "+this.stylePadList+">" + params + "</div>";
            this.toggleShow('list');
            if (!!$(this.container).has($(this.retContainer))[0]) {
                $(this.retContainer).html(params);
            } else {
                $(this.container).append(str);
                this.toggleShow('list');
                console.log('append成功');
            }
            $(".citylist").on('click', 'li', function (e) {
                var val = $(e.target).children('.cityname').html();
                var code = $(e.target).children('.citycode').html();
                this.target.val(val);
                this.target.data('code', code);
                $(this.searchTarget).val('');
                $(this.container).hide();
            }.bind(this));
        },
        //切换显示
        toggleShow: function (param) {
            if (param === 'all') {
                $(this.container).show();
                $(this.retContainer).hide();
                $(this.listAllContainer).show();
            } else if (param === 'list') {
                $(this.container).show();
                $(this.retContainer).show();
                $(this.listAllContainer).hide();
            }
        }
    }

    var mobilecity = null;
    $.fn.mobileCity = function (options) {
        var target = $(this);
        target.on('focus', function (e) {
            if (!mobilecity) {
                mobilecity = new MobileCity(target);
                mobilecity.init(options);
            }
            mobilecity.target = $(e.target);
            // mobilecity.container.show();
            mobilecity.toggleShow('all');
            mobilecity.target.blur();
        });
        return this;
    }
})(jQuery);