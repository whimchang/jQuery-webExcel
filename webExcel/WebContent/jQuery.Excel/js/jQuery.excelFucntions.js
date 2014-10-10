;(function($,window,document,undefined){
	var functionClass=function(ele,opt){
		this.$element=ele;
		this.defaults={
				"rows":"5",			//type is number
				"cols":"8",			//type is number
				"theams":"office",	//office
				"title":"alpha",	//alpha,number
				"edit":false,		//false,true
				"export":false,		//false,ture
				"dataType":"json",	//json,xml,array
				"rowEdit":true,		//false,true
				"colEdit":true,		//false,true
				"sort":false,
		};
		this.options=$.extend({},this.defaults,opt);
		this.alpha=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
		this.number=['0','1','2','3','4','5','6','7','8','9'];		
		this.caption;
		this.trSet;
		this.tdSet;
		this.export_json='';
		this.export_array;
	};
	functionClass.prototype={
		//随机生成表格
		tableGenerate:function(){	
			//表头  -- 名称和导出按钮
			var headObj='<caption>tableTitle'
						+'　　<a href="javascript:$.titleEdit();"><span class="glyphicon glyphicon-edit"></span></a>'
						+'</caption>';
			var trObj='<tr>',tableObj='<table>'+headObj;
			for(var i=0;i<this.options.cols+1;i++){
				trObj+='<td></td>';
			}
			trObj+='</tr>';
			for(var i=0;i<this.options.rows+1;i++){
				tableObj+=trObj;
			}
			tableObj+='</table>';
			this.$element.append(tableObj);
			this.caption=$("caption");
			//表格tr单元集合
			this.trSet=$("tr");
			//表格td单元集合
			this.tdSet=$("td");
			//可编辑表格
			if(this.options.edit){				
				for(var i=1;i<=this.options.rows;i++){
					for(var j=1;j<=this.options.cols;j++){
						var count=i*(this.options.cols+1)+j;
						//console.log('$tdSets['+count+'] = '+$(this.tdSet[count]).text());
						$(this.tdSet[count]).tdEdit();
					}
				}
			}
			//设定表格首航 -- 字母//数字
			if(this.options.title.match("alpha")){	
				for(var i=1;i<=this.options.cols;i++){
					$(this.tdSet[i]).text(this.alpha[i-1]);
				}
			}else{
				for(var i=1;i<=this.options.cols;i++){
					$(this.tdSet[i]).text(i);
				}
			}
			//设置表格最左一栏的显示顺序格式
			for(var i=1;i<=this.options.rows;i++){
				$(this.tdSet[i*(this.options.cols+1)]).text(this.number[i]);
			}
			//编辑表格名称
			$(headObj).tdEdit();
		},
		
		//表格导出
		tableExport:function(){
			if(this.options.export){
				$(this.caption).append('　　<span class="glyphicon glyphicon-export" data-toggle="tooltip" title="Export"></span>');
				var tit=this;
				//this.$element.append(exportObj);
				$(this.caption).children('.glyphicon-export').on({
					"click":function(){
						tit.export_json='{';
						for(var i=1;i<=tit.options.rows;i++){
							var colString='[';
							tit.export_json+='"row'+i+'":';
							for(var j=1;j<=tit.options.cols;j++){
								var count=i*(tit.options.cols+1)+j;
								colString+='"'+$(tit.tdSet[count]).text()+'",';
							}
							colString=colString.substring(0, colString.length-1);
							colString+='],';
							tit.export_json+=colString;
						}
						tit.export_json=tit.export_json.substring(0, tit.export_json.length-1)+'}';
						$.ajax({
							url:"Servlet/FileWriteServlet.jsp",
							type:"post",
							data:{
								"data_json":tit.export_json,
							},
							success:function(){
								console.log(tit.export_json);
							},
							error:function(){
								console.log();
							}
						});
					},
					"mouseenter":function(){
						$(this).css({"cursor":"pointer"});
						$(this).tooltip(); 
					}
				});					
			}else{
				alert("您的设置不支持表格导出功能，请联系网站管理员");
			}
		},
		
		//增加or删除行和列		
		tableSet:function(){
			//增加一列
			if(this.options.rowEdit){
				var tit=this;			
				$(this.caption).append('　　<span class="glyphicon glyphicon-arrow-right" data-toggle="tooltip" title="Add Column"></span>');
				$(this.caption).children('.glyphicon-arrow-right').on({
					"click":function(){
						//alert("add row");
						$(tit.trSet).each(function(){
							if($(this).index()==0){
								$(this).append('<td></td>');
								if(tit.options.title=='alpha'){
									$(this).children("td").last().text(tit.alpha[tit.options.cols%26]);									
								}else{
									$(this).children("td").last().text(tit.options.cols+1);
								}
							}else{
								$(this).append('<td></td>');
								$(this).children("td").last().tdEdit();
							}
						});
						tit.options.cols+=1;
						tit.tdSet=$("td");
						tit.trSet=$("tr");
					},
					"mouseenter":function(){
						$(this).css({"cursor":"pointer",});
						$(this).tooltip(); 
					}
				});				
			}else{
				alert("您的设置不支持列编辑，请联系网站管理员");
			}
			//增加一行
			if(this.options.colEdit){
				var tit=this;			
				$(this.caption).append('　　<span class="glyphicon glyphicon-arrow-down" data-toggle="tooltip" title="Add Row"></span>');
				$(this.caption).children('.glyphicon-arrow-down').on({
					"click":function(){
						$(tit.trSet[tit.options.rows]).after('<tr></tr>');
						tit.trSet=$("tr");
						for(var i=0;i<=tit.options.cols;i++){
							if(i==0){
								$(tit.trSet).last().append('<td></td>');
								$(tit.trSet).last().children('td').eq(i).text(tit.options.rows+1);
							}else{
								$(tit.trSet).last().append('<td></td>');
								$(tit.trSet).last().children('td').eq(i).tdEdit();
							}
						}
						tit.options.rows+=1;
						tit.tdSet=$("td");
						tit.trSet=$("tr");
					},
					"mouseenter":function(){
						$(this).css({"cursor":"pointer",});
						$(this).tooltip(); 
					}
				});
			}else{
				alert("您的设置不支持行编辑，请联系网站管理员");
			}
			
		},
		
		//表格排序 -- 按列
		tableSort:function(){
			var tit=this;
			var tdFirstRow=$(this.trSet[0]).children('td');
			if(this.options.sort){
				this.caption.append('　　<span class="glyphicon glyphicon-sort" data-toggle="tooltip" title="Sort"></span>');
				$(this.caption).children(".glyphicon-sort").on({
					"click":function(){
						//alert("sort");
						if($(".bgcolor").length==0 || $(".bgcolor").length>tit.options.rows+1){
							alert("没有满足条件的排序内容");
						}else{
							//alert("sort");
							
						}
					},
					"mouseenter":function(){
						$(this).css({"cursor":"pointer",});
						$(this).tooltip(); 
					},
				});
				//选中一列
				tdFirstRow.each(function(){
					if($(this).index()>0){
						$(this).on({
							"click":function(){
								var index=$(this).index();
								$(tit.tdSet).each(function(){
									if($(this).index()==index){
										$(this).toggleClass("bgcolor");
									}
								});								
							},							
						});
					};					
				});//end 选中一列
			}
		},		

		//表格选中一列
		tableSelectCol:function(colId){
			
		},
	};	
	
	//插件 -- 随机生成表格
	$.fn.tableGenerate=function(options){
		var functionSets=new functionClass(this,options);
		//return functionSets.tableGenerate();
		functionSets.tableGenerate();
		functionSets.tableExport();
		functionSets.tableSet();
		functionSets.tableSort();
	};
	
	//插件  -- 导出表格成为json格式
	$.fn.tableExport=function(options){
		var functionSets=new functionClass(this,options);
		functionSets.tableExport();		
	};
	
	//可编辑表格单元
	$.fn.tdEdit=function(){
		$(this).on({
			"click":function(){
				//alert("edit cilck");
				var currentTd=$(this);
				if (currentTd.children("input").length > 0) { 
			         //如果当前td中已包含有文本框元素，则不执行click事件 
			         return false; 
			    }
				var tdtext = currentTd.html();
				currentTd.html("");
				var inputOjb = $("<input type='text' />").css("border-width", "0")
               				.css("background-color", currentTd.css("background-color"))
               				.css("width",currentTd.css("width"))
               				.val(tdtext).appendTo(currentTd); 
				inputOjb.click(function() {
					return false;
				}); 
				inputOjb.trigger("focus").trigger("select");
				inputOjb.keyup(function(){
					var keyCode = event.which;
					if (keyCode == 13){
						var inputText=$(this).val();
						currentTd.html(inputText);
					}
					if (keyCode == 27){
						currentTd.html(tdtext);
					}
				});
				inputOjb.blur(function(){
					var inputText=$(this).val();
					currentTd.html(inputText);
				});
			}
		});
	};
	//选中一列
	$.fn.selectCol=function(colId){
		
	};

	//DOM元素绑定事件集合
	$.extend({
		//编辑表格名称
		titleEdit:function(){			
			alert("title edit");
		},
		//导出表格
		/*tableExport:function(){
			//alert("table export");
		},*/
	});
})(jQuery,window,document);