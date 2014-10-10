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
<div id="table" class="container ui-widget-content" style="margin-top:50px;padding:50px;width:90%;"></div>

<script type="text/javascript" src="./js/jquery-1.11.1.js"></script>
<script type="text/javascript" src="./js/jquery-ui.js"></script>
<script type="text/javascript" src="./jQuery.Excel/js/jQuery.excelFucntions.js"></script>
<script type="text/javascript" src="./jQuery.Excel/js/jQuery.excelPlugin.js"></script>
<script type="text/javascript">
$(document).ready(function(){
	$("#table").tableGenerate({
		"rows":6,
		"cols":8,
		"title":"alpha",
		"edit":true,
		"export":true,
		"sort":true,
		"dataType":"json",
	});
	$("#table").draggable();
});
</script>
</body>
</html>