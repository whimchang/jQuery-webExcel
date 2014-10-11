;(function($,window,document,undefined){
	var functionClass=function(ele,opt){
		this.$element=ele;
		this.defaults={
				"rows":"5",			//type is number
				"cols":"8",			//type is number
				"theams":"office",	//office
				"title":"alpha",	//alpha,number
				"creat":false,		//false,true
				"edit":true,		//false,true
				"export":false,		//false,ture
				"dataType":"json",	//json,xml,array
				"rowEdit":false,		//false,true
				"colEdit":false,		//false,true
				"trDel":false,		//false,true
				"sort":false,
		};
		this.options=$.extend({},this.defaults,opt);
		this.alpha=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
		this.number=['0','1','2','3','4','5','6','7','8','9'];		
		this.table;
		this.caption;
		this.trSet;
		this.tdSet;
		this.export_json='';
		this.export_array;
		this.sortIndex;
		this.orderFlag=0;
	};
	functionClass.prototype={
		//生成表格
		tableGenerate:function(){	
			var tit=this;
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
			this.table=$("table");
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
			//删除一行
			if(this.options.trDel){
				$(this.trSet).each(function(key){
					if(key>0){
						tit.tableDeleteRow(this);
					}
				});
			}
			/*$.each(this.trSet,function(key,val){
				if(key>0){
					tit.tableDeleteRow(this);
				}
			});*/
		},
		
		//新建表格
		tableCreat:function(){
			if(this.options.creat){
				//alert("creat");
				var tit=this;
				$(this.caption).append('　　<span class="glyphicon glyphicon-plus" data-toggle="tooltip" title="New table"></span>');
				$(this.caption).children('.glyphicon-plus').on({
					"click":function(){
						var r=confirm("该操作会丢失当前数据，您确定要新建表格吗？");
						if (r==true){
							//alert("creat");
							window.location='http://localhost:8080/jqueryExcel/test.jsp';
						}else{
							//alert("not leave");
						}
					},
					"mouseover":function(){
						$(this).css({"cursor":"pointer"});
						$(this).tooltip(); 
					}
				});
			}
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
								"path":tit.options.path,
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
		
		//表格导入
		tableImport:function(){
			if(this.options.import){
				//alert("dsfdf");
				var tit=this;
				$(this.caption).append('　　<span class="glyphicon glyphicon-import" data-toggle="tooltip" title="Import"></span>');
				$(this.caption).children('.glyphicon-import').on({
					"click":function(){
						//询问确认 是否导入表格
						var r=confirm("该操作会丢失当前数据，您确定需要导入表格吗");
						if(r==true){
							//导入表格
							$.ajax({
								url:'./data/local/data_test.txt',//这里是由后台给出的json数据存储地址
								type:'GET',
								success:function(data){
									//console.log(data);
									var jsObj=eval('('+data+')');
									//判断现有表格行和列是否满足将要导入的表格数据的要求
									var trNum=Object.keys(jsObj).length;
									$.each(jsObj,function(keyTr,val){
										var rowIndex=parseInt(keyTr.charAt(keyTr.length-1));
										var tdNum=val.length;	
										if(tdNum!=tit.options.cols || trNum!=tit.options.rows){
											$(tit.table).remove();
											//重新生成新的表格
											tit.options.cols=tdNum;
											tit.options.rows=trNum;
											tit.tableGenerate();
											tit.tableExport();
											tit.tableImport();
											tit.tableSet();
											tit.tableSort();
											tit.tableCreat();
											//写入表格内容
											$.each(val,function(keyTd,value){
												$(tit.tdSet[rowIndex*(tdNum+1)+(keyTd+1)]).text(value);
												//console.log(rowIndex+' : '+value);
											});
										}else{
											$.each(val,function(keyTd,value){
												$(tit.tdSet[rowIndex*(tdNum+1)+(keyTd+1)]).text(value);
												//console.log(rowIndex+' : '+value);
											});	
										}																										
									});
								},
								error:function(){
									console.log("get failed");
								}
							});
						}else{
							
						}						
					},
					"mouseover":function(){
						$(this).css({"cursor":"pointer"});
						$(this).tooltip(); 
					}
				});
			}
		},		
		
		//增加or删除一列 ;增加一行
		tableSet:function(){
			//增加一列 or 删除一列
			if(this.options.rowEdit){
				var tit=this;	
				//增加一列
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
						var index=tit.options.cols+1;
						tit.options.cols+=1;
						tit.tdSet=$("td");
						tit.trSet=$("tr");
						$(tit.trSet[0]).children('td').last().on({
							"click":function(){
								tit.tableSelectCol(index);
							}
						});							
					},
					"mouseenter":function(){
						$(this).css({"cursor":"pointer",});
						$(this).tooltip(); 
					}
				});		
				//删除一列
				$(this.caption).append('　　<span class="glyphicon glyphicon-arrow-left" data-toggle="tooltip" title="Delete Column"></span>');
				$(this.caption).children('.glyphicon-arrow-left').on({
					"click":function(){
						tit.trSet.each(function(){
							$(this).children("td").last().remove();
						});
						tit.options.cols-=1;
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
				//增加一行
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
						tit.tableDeleteRow($(tit.trSet).last());
					},
					"mouseenter":function(){
						$(this).css({"cursor":"pointer",});
						$(this).tooltip(); 
					}
				});
				//tit.tableDeleteRow();
			}else{
				alert("您的设置不支持行编辑，请联系网站管理员");
			}			
		},
		
		
		//删除一行  -- 每一行都有删除的链接
		tableDeleteRow:function(ele){
			var tit=this;
			var eletmp=ele;
			//alert("delete row");
			$(ele).children('td').first().on({
				"click":function(){
					var txt=$(eletmp).children('td').first().text();
					//alert(txt);
					$.each($(eletmp).nextAll(),function(key,val){
						$(this).children('td').first().text(txt);
						txt++;
					});
					$(eletmp).remove();					
					tit.options.rows-=1;
					tit.trSet=$("tr");
					//调整左边列的显示序号
					
				},
				"mouseenter":function(){
					$(this).css({"cursor":"pointer"});
					$(this).append('<span class="glyphicon glyphicon-remove"></span>');
				},
				"mouseleave":function(){
					$(this).children('span').remove();
				},
			});		
		},
				
		//表格排序 -- 按列
		tableSort:function(){			
			if(this.options.sort){
				var tit=this;			
				var tdFirstRow=$(this.trSet[0]).children('td');
				//选中需要排序的一列
				tdFirstRow.each(function(){
					if($(this).index()>0){
						$(this).on({
							"click":function(){
								tit.sortIndex=$(this).index();
								tit.tableSelectCol(tit.sortIndex);
								//console.log(tit.sortIndex);
							}						
						});
					};					
				});//end 选中一列
				var orderFlag=0;
				this.caption.append('　　<span class="glyphicon glyphicon-sort" data-toggle="tooltip" title="Sort"></span>');
				$(this.caption).children(".glyphicon-sort").on({
					"click":function(){						
						if($(".bgcolor").length==0 || $(".bgcolor").length>tit.options.rows+1){
							alert("没有满足条件的排序内容");
						}else{
							var tdVal=[];
							$.each(tit.tdSet,function(key,val){
								if($(this).index()==tit.sortIndex && $(this).text()!=null){
									tdVal[key]=$(this).text();
								}
							});
							$.each(tit.trSet,function(key,val){
								if(key>0){
									$(this).attr('flag',tdVal[key*(tit.options.cols+1)+tit.sortIndex]);
								}								
							});
							if(orderFlag==0){//降序
								for(var j=0;j<tit.options.rows;j++){
									for(var i=1;i<tit.options.rows-j;i++){									
										if($(tit.trSet[i+1]).attr('flag')>$(tit.trSet[i]).attr('flag')){
											$(tit.trSet[i-1]).after(tit.trSet[i+1]);
											tit.trSet=$("tr");
											tit.tdSet=$("td");
										}
									}									
								}
								orderFlag=1;
							}else{//升序
								for(var j=0;j<tit.options.rows;j++){
									for(var i=1;i<tit.options.rows-j;i++){									
										if($(tit.trSet[i+1]).attr('flag')<$(tit.trSet[i]).attr('flag')){
											$(tit.trSet[i-1]).after(tit.trSet[i+1]);
											tit.trSet=$("tr");
											tit.tdSet=$("td");
										}
									}									
								}
								orderFlag=0;
							}
							//排序结束，重新设置左边一栏的显示序号
							$.each(tit.trSet,function(key,val){
								if(key>0){
									$(this).children('td').first().text(key);
								}
							});
						}
					},
					"mouseenter":function(){
						$(this).css({"cursor":"pointer",});
						$(this).tooltip(); 
					}
				});				
			}
		},		

		//选中一列
		tableSelectCol:function(colIndex){
			$.each(this.tdSet,function(key,val){
				if($(this).index()==colIndex){
					$(this).toggleClass("bgcolor");
				}
			});
		},
	};	
	
	//插件 -- jQuery webExcel
	$.fn.tableGenerate=function(options){
		var functionSets=new functionClass(this,options);
		//return functionSets.tableGenerate();
		functionSets.tableGenerate();
		functionSets.tableExport();
		functionSets.tableImport();
		functionSets.tableSet();
		functionSets.tableSort();
		functionSets.tableCreat();
		return;
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
})(jQuery,window,document);