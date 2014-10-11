<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@ page import="java.io.*"%>
<%@ page import="javax.servlet.http.*" %>
<!DOCTYPE html>
<html>
<head>
</head>
<body>
<center>
<%
  //String path=request.getRealPath("/");
  String data=new String(request.getParameter("data_json").getBytes("utf-8"),"utf-8").toString();
  String path=new String(request.getParameter("path").getBytes("utf-8"),"utf-8").toString();
  File fp=new File(path,"data_json.txt");
  FileWriter fwriter=new FileWriter(fp);
  request.setCharacterEncoding("utf-8");  
  //String author=new String(request.getParameter("author").getBytes("ISO8859-1"),"GB2312").toString();
  fwriter.write(data);
  fwriter.close();
  out.println("已将内容成功写入到文件！"+path+"/data_json.txt");
%>
</center>
</body>
</html>