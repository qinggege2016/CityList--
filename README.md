CityList
==
CityList是我第一次上手封装的jquery插件，参考了前辈们的思路，寻找各方需求，后台是之前项目写好的接口，在这里使用的是相同结构的JSON，方法还是有缺陷，这是第一版，以后成长之后发现不足再改正。
+  ### 移动端 ###
```
<input type="text" class='form-input' id='book'>
<script src='js/jquery-1.10.2.min.js'></script>
<script src='js/mobile-city.js'></script>
<script>
    var options = {
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
    }
    $('#book').mobileCity();
</script>
```


+  ### PC 端 ###
```
options: {
  cities: {} //同移动端
  isKeySelect: true //是否启动上下键选择
}
```
