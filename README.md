#app-temp 基于jQuery的模板引擎插件
##[demo](http://wangxing218.github.io/app-temp/test/demo.html)


```html
<!-- 引用jQuery 和 app-temp.js -->

<!-- 单条信息 -->
<div id="info">
    <script type="text/html">
        <h2 class="title"> {{row.title}} </h2>
        <h6 class="title-ext"> 作者：{{row.author}}  发布于：{{row.postTime}} 评论：{{row.comments}}条 </h6>
        <div class="content">
            {{row.content}}
        </div>
    </script>
</div>

<!-- 列表 -->
<ul class="list-group" id="grid">
</ul>
<script type="text/html" id="list_temp_1">
    <li class="list-group-item">
        <a href="{{row.href}}"> <b>{{_no + '.'}}</b> {{row.title}}</a>
    </li>
</noscript>
<script type="text/html" id="list_temp_2">
    <a href="{{row.href}}" class="list-group-item"><b>{{_no + '.'}}</b> {{row.title}} <span class="badge" title="评论数">{{row.comments}}</span></a>
</script>

```

```javascript
//配置参数 $('#info').app_temp(options) 中的options：
{
    src: null, //数据源，可以是一个url或者一个json数据
    tempId: null, //模板id，如'#temp',默认在实例对象里面寻找script[type='text/html']
    data: null, //同ajax的data
    type: 'GET', //同ajax的type
    dataType: 'JSON', //同ajax的dataType
    filter: null, //得到数据后，在渲染之前的处理函数
    final: null, //替换变量后将数据渲染到页面前的处理函数，常用于添加头尾的html标签
    complete: null, //所有渲染完成的回调函数
    dataKey: 'app-temp', //实例化后的data键值，方便后续通过data('app-temp')取出；
};
//options也可以为字符串，相当于设置了options.src;

//模板说明
// 如：{{row.filed}},两个大括号中间的为js代码，可使用三元运算，自定义函数。
// 除了row，还有data,原始数据：options.src或请求回来的json，_no，列表循环时的序号，从1开始。

// 单条信息渲染
var info = $('#info').app_temp('./data/info_1.json');

// 列表
var grid = $('#grid').app_temp({
    src: './data/list_1.json',
    tempId: '#list_temp_2'
});


// API

// grid.render(src)          //无参数则为刷新，有参数则替换options.src再刷新；
// grid.setTemp(tempSrc)        //设置模板，可以为tempId，也可以为模板字符串变量，返回自身实例，可用于链式操作;

```
###更多示例请见 [demo](http://wangxing218.github.io/app-temp/test/demo.html)
##作者
###网站： <a href="http://www.boyxing.com/" target="_blank">www.boyxing.com 星仔博客</a>
### QQ ： <a href="http://wpa.qq.com/msgrd?v=3&uin=1263996779&site=qq&menu=yes" target="_blank">1263996779</a>



