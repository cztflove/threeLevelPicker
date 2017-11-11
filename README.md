## threeLevelPicker
分别有pc版和移动版的三级选择器，通过json文件获取数据，扩展性强
demo展示以三级城市选择为示例

## 开始使用
#### 加载插件

```
<link href="css/normalize.css" rel="stylesheet">
<link href="css/threeLevelPicker.css" rel="stylesheet">

<script src="http://cdn.bootcss.com/jquery/2.2.1/jquery.min.js"></script>
<script src="js/threeLevelPicker.js"></script> 
```
#### html内容
```
<input type="text" name="area" readonly="readonly" value="" data-id="" id="picker">
```
#### 初始化autoLoadMore

```
<script type="text/javascript">
    var picker = new threeLevelPicker()
</script>
```

## 配置选项

| Option | 类型 | 默认值 | 说明 |
| ------------- |:-------------:|:-------------:| :-------------|
trigger | string | #picker | 触发选择的input元素id |
levelName | array | ['省份', '城市', '县区'] | 三级选择的级别命名 |
dataPath | string | js/area.json | 获取数据json的路径 |
seperator | string |  | 分割三级选择的符号 |


