<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>表格生成器</title>

<link rel="stylesheet" href="./css/jquery-ui.css">
<link rel="stylesheet" href="./css/jquery-ui.structure.css">
<link rel="stylesheet" href="./css/jquery-ui.theme.css">
<link rel="stylesheet" href="./css/bootstrap.min-baidulib.css">
<link rel="stylesheet" href="./jQuery.Excel/theams/office/office.css">
</head>
<body>
<div id="table" class="container ui-widget-content" style="margin-top:100px;padding:50px;width:90%;"></div>

<script type="text/javascript" src="./js/jquery-1.11.1.js"></script>
<script type="text/javascript" src="./js/jquery-ui.js"></script>
<script type="text/javascript" src="./jQuery.Excel/js/jQuery.excelFucntions.js"></script>
<script type="text/javascript" src="./jQuery.Excel/js/jQuery.excelPlugin.js"></script>
<script type="text/javascript">
$(document).ready(function(){
	$("#table").tableGenerate({
		"rows":3,			//设置行数,默认值为5
		"cols":4,			//设置列数,默认值为8
		"title":"alpha",	//head格式,默认显示为alpha
		"edit":true,		//可编辑,默认为true
		"creat":true, 		//新建表格,默认为false
		"export":true,		//导出,默认为false
		"import":true,		//导入,默认为false
		"rowEdit":true,		//增加行,默认为false
		"trDel":true,		//删除行,默认为false
		"colEdit":true,		//增加和删除列,默认为false
		"sort":true,		//排序,默认为false
		"dataType":"json",	//导出数据格式
		"path":"C:/Disk/Software/Enviroment/apache-tomcat-6.0.41/jqueryExcel/WebContent/data/up", //json文件保存路径		
	});
	$("#table").draggable();
});
</script>
</body>
</html>