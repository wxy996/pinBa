
var wenShang=angular.module("wenShang",["ngRoute"])

wenShang.controller("pCtrl",function($scope,$routeParams,$location,$http,$rootScope){

	var arr = $location.$$path.split("/");
	var str = arr.filter(function(v){return !!v;})[0];
	var newArr = arr.filter(function(v){return !!v;});
	var _scope = $scope;

	$scope.setNavFocus = function(leftNav){
		$scope.leftNav=''
		$scope.leftNav = leftNav || 'xzgl';
	};
	$scope.setNavFocus(str);

	$scope.handclk = function(sClass){
		$scope.setNavFocus(sClass);
		// console.log(sClass)
	}.bind($scope);

	$scope.role=window.localStorage.getItem("role")
	// console.log($scope.role)

	$scope.userInfo=JSON.parse(window.localStorage.getItem("userInfo"))
	// console.log($scope.userInfo)
	$scope.oUrl=oUrl

    // 获取县上所有镇以及镇上的村
    getCountyList(countyId,window.localStorage.getItem("tToken"))

    // console.log(countyId)

    // 获取职务列表
    getZw()
    // 获取部门列表
    getBm(countyId)

})


wenShang.config(function($routeProvider){
	$routeProvider.when("/xzgl",{ //乡镇管理
		templateUrl:"xzgl.html",
		controller: function($scope,$rootScope,$http){
			$scope.role=window.localStorage.getItem("role") //系统管理员0


			$scope.countyList=JSON.parse(window.localStorage.getItem("countyList"))
			$scope.countyId=$scope.countyList.county.CountyId

			// console.log($scope.countyList)

			$scope.townList=JSON.parse(window.localStorage.getItem("countyList")).county.Towns
			// 预览镇信息
			$scope.showVillages=function(list){
				$scope.showModal=true
				// console.log(list)
				$scope.showList=list
			}
			// 编辑镇信息
			$scope.editVillages=function(name,id){
				$scope.showZhenName=name
				$(".cunName").val(name)
				$scope.showZhenId=id
			}
			// 编辑镇 保存
			$(".save").click(function(params){
				var newName=$('.cunName').val()
				if($scope.showZhenName==''){
					alert('请输入镇名称')
					return false
				}else{
					var htime=timest() 
					var i=window.localStorage.getItem("uid")
					var t=window.localStorage.getItem("tToken")
					var town =$scope.showZhenId

					if(newName==''){
						newName=$scope.showZhenName
					}
	                $http({
						method: "put",
						url :oUrl+'/web/v1/town?htime='+htime+'&i='+i+'&t='+t+'&town='+town+'&name='+newName+'&isusing='+$('#ztWrap').val(),
						headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		                transformRequest: function (obj) {
		                    var str = [];
		                    for (var o in obj)
		                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
		                    return str.join("&");
		                },
					}).then(function(res){
						 if( res.data.code==200 && res.data.errcode == 200 ){
			
							console.log('token',res.data.data.token)  

						    // window.localStorage.setItem("tToken",res.data.data.token);

    						getCountyList(countyId,res.data.data.token)
							
							$scope.townList=JSON.parse(window.localStorage.getItem("countyList")).county.Towns

							$('#myModal3').modal({
					            show: false,
					            backdrop:'static'
					        })

					        alert('编辑乡镇成功')
					        

				        }else{    
				            alert('修改镇信息'+res.data.msg);
				        }
					});	

				}
				
		 	})
		 	// 新增镇
		 	$(".addCountBtn").click(function(params){
				var newName=$('.newCountyName').val()
				if(newName==''){
					alert('请输入镇名称')
				}else{
					var htime=timest() 
					var i=window.localStorage.getItem("uid")
					var t=window.localStorage.getItem("tToken")
					// var town =$scope.showZhenId

					
	                $http({
						method: "post",
						url :oUrl+'/web/v1/town?htime='+htime+'&i='+i+'&t='+t+'&county='+countyId+'&name='+newName
						+'&isusing=',
						headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		                transformRequest: function (obj) {
		                    var str = [];
		                    for (var o in obj)
		                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
		                    return str.join("&");
		                },
					}).then(function(res){
						// console.log(res.data.data.token)
						 if( res.data.code==200 && res.data.errcode == 200 ){

					        // console.log('token',res.data.data.token)  

    						getCountyList(countyId,res.data.data.token)
							
							$scope.townList=JSON.parse(window.localStorage.getItem("countyList")).county.Towns

							$('#newAddModal').modal({
					            show: false,
					            backdrop:'static'
					        })

				        }else{    
				            alert('新建镇'+res.data.msg);
				        }
					});	

				}
				
		 	})
		}
	}).when("/cgl",{//村管理
		templateUrl:"cgl.html",
		controller: function($scope,$rootScope,$http,$routeParams){
			
			$scope.role=window.localStorage.getItem("role") //系统管理员0
			$scope.oUrl=oUrl;

			// 获取县信息
			$scope.countyList=JSON.parse(window.localStorage.getItem("countyList"))
			// console.log($scope.countyList)
			// 获取镇
			$scope.townList=JSON.parse(window.localStorage.getItem("countyList")).county.Towns
			// console.log($scope.townList)
			for(var i=0;i<$scope.townList.length;i++){
				$('#townown').append('<option value="'+$scope.townList[i].TownId+'" class="townOption">'+$scope.townList[i].TownName+'</option>')
			}
			// 人员列表
			$scope.peopleList=JSON.parse(window.localStorage.getItem("peopleList"))
			// console.log($scope.peopleList)
			
			$scope.slectTown=function(){
				// console.log($scope.townSelect)
				$scope.cunList=$scope.townSelect.Villages
			}

			$scope.showVillages=function(id){
				$scope.cunId=id

				$scope.showCunDetail=[]
				for (var obj in $scope.peopleList ){
				  	// 将json对象转换为字符串
				  	var str = JSON.stringify($scope.peopleList[obj]);
				  	// 将json字符串转换为map
				 	var map = eval("("+str+")");

				  	if(map.PeopleInfo.VillageId==$scope.cunId){
				  		// console.log(map)
				  		$scope.showCunDetail.push(map)
				  	}

				 }
				 // console.log($scope.showCunDetail)
			}

			$scope.ajaxTypeBtn=function(type,p){
				// console.log(type)
				if(type=='add'){
					$scope.showText='新增村'
					$scope.ajaxType='add'
				}else{
					$scope.showText='编辑村'
					$scope.ajaxType='edit'
					$scope.showCunText=p.VillageName
					$scope.pCon=p
					// console.log(p)
					$(".cunName").val($scope.showCunText)

				}

				// console.log($scope.ajaxType)

			}
			// 保存
			$scope.saveBtn=function(){

				var newName=$('.cunName').val()

				if($scope.ajaxType=='add'){
					if(newName==''){
						alert('请输入镇名称')
					}else{
						var htime=timest() 
						var i=window.localStorage.getItem("uid")
						var t=window.localStorage.getItem("tToken")
						// var town =$scope.showZhenId
						
		                $http({
							method: "post",
							url :oUrl+'/web/v1/village?htime='+htime+'&i='+i+'&t='+t+'&county='+countyId+'&town='+$("#townown").val()+'&name='+$(".cunName").val(),
							headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			                transformRequest: function (obj) {
			                    var str = [];
			                    for (var o in obj)
			                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
			                    return str.join("&");
			                },
						}).then(function(res){
							// console.log(res.data.data.token)
							 if( res.data.code==200 && res.data.errcode == 200 ){
	
						        // console.log('token',res.data.data.token)  
					            alert('新建村成功');
								location.reload()

					        }else{    
					            alert('新建村'+res.data.msg);
					        }
						});	

					}
				}else{
					if(newName==''){
						alert('请输入村名称')
					}else{
						var htime=timest() 
						var i=window.localStorage.getItem("uid")
						var t=window.localStorage.getItem("tToken")
						// var town =$scope.showZhenId
						
		                $http({
							method: "put",
							url :oUrl+'/web/v1/village?htime='+htime+'&i='+i+'&t='+t+'&name='+$(".cunName").val()+'&villid='+$scope.pCon.VillageId+'&isusing='+$("#ztWrap").val(),
							headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			                transformRequest: function (obj) {
			                    var str = [];
			                    for (var o in obj)
			                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
			                    return str.join("&");
			                },
						}).then(function(res){
							// console.log(res.data.data.token)
							 if( res.data.code==200 && res.data.errcode == 200 ){
	
						        // console.log('token',res.data.data.token)  
					            alert('编辑村成功');
								location.reload()

					        }else{    
					            alert('编辑村'+res.data.msg);
					        }
						});	

					}
				}

				
			}
		}
	}).when("/rygl",{//人员管理
		templateUrl:"rygl.html",
		controller: function($scope,$rootScope,$http){
			$scope.role=window.localStorage.getItem("role") //系统管理员0
			$scope.imgUrl=oUrl+'/'
			// 获取县信息
			$scope.countyList=JSON.parse(window.localStorage.getItem("countyList"))
			// console.log($scope.countyList.county)
			$('.county').val($scope.countyList.county.CountyName)
			$('.countyIdID').val(countyId)

			getPeopleList($scope.countyList.county.CountyId,'','','')

			$scope.peopleListAll=JSON.parse(window.localStorage.getItem("peopleShowList"))
			// console.log($scope.peopleListAll)

			if ($scope.peopleListAll!=null) {
				for(var i=0;i<$scope.peopleListAll.length;i++){
				 	if($scope.peopleListAll[i].PeopleInfo.PicData!=''){
				 		$scope.peopleListAll[i].PeopleInfo.PicDataAll=oUrl+'/'+$scope.peopleListAll[i].PeopleInfo.PicData
				 	}else{
				 		$scope.peopleListAll[i].PeopleInfo.PicDataAll=''
				 	}
				 }
			}
					
			
			$scope.peopleList=$scope.peopleListAll
			// console.log($scope.peopleList)

			// 获取镇
			$scope.townList=JSON.parse(window.localStorage.getItem("countyList")).county.Towns
			// 遍历镇
			for(var i=0;i<$scope.townList.length;i++){
				var oPtions='<option value="'+$scope.townList[i].TownId+'" class="townOption">'+$scope.townList[i].TownName+'</option>'
				$('.townForm').append(oPtions)
			}
			$scope.townList.unshift({'TownName':'全部','TownId':-1,'Villages':''})
			$scope.townSelect=$scope.townList[0]
		
			
			

			// 召唤新增面板
			$scope.newAddPeopleBtn=function(type,p){

				
				// 职务
				var zwList=JSON.parse(window.localStorage.getItem("dutyList"))
				for(var i=0;i<zwList.length;i++){
					var oPtions='<option value="'+zwList[i].DutyId+'" class="townOption">'+zwList[i].DutyName+'</option>'
					$('.zwFrom').append(oPtions)
				}
				// bumen
				var bmList=JSON.parse(window.localStorage.getItem("bmList"))
				var newBmList=[]
				for (var obj in bmList ){
				  	// 将json对象转换为字符串
				  	var str = JSON.stringify(bmList[obj]);
				  	// 将json字符串转换为map
				 	var map = eval("("+str+")");

				  	if(map.TownId==-1&&map.VillageId==-1&&map.CountyId==countyId){
					  		// console.log(map)
				  		newBmList.push(map)
				  	}
				}	

				for(var i=0;i<newBmList.length;i++){
					var oPtions='<option value="'+newBmList[i].DepId+'" class="townOption">'+newBmList[i].DepName+'</option>'
					$('.bmFrom').append(oPtions)
				}


				$("#image").change(function (e) {
					
					var _name, _fileName, personsFile;
				    personsFile = document.getElementById("image");
				    _name = personsFile.value;
				    _fileName = _name.substring(_name.lastIndexOf(".") + 1).toLowerCase();
				    if (_fileName !== "png" && _fileName !== "jpg" && _fileName !== "jpeg") {
				        alert("上传图片格式不正确，请重新上传");
				    }
					 var file = this.files[0];

					 var formData = new FormData();
					 // console.log( $('#image')[0].files[0])
					 formData.append('image', $('#image')[0].files[0]);
					 // console.log(formData)

				   		$.ajax({
						    url:oUrl+ '/web/v1/upload',
						    type: 'POST',
						    cache: false,
						    data: formData,
						    processData: false,
						    contentType: false
						}).success(function(res) {
							// console.log(res)
							if(res.code==200&&res.errcode==200){
								// window.localStorage.setItem("img"+num,res.file_path)
								// console.log(res.data.image_save_url)

								$("#image1").val(res.data.image_save_url)
							}else{
								alert(res.msg)
							}
						}).done(function(res) {}).fail(function(res) {});
				});	
				// 新建人员 添加村select
				$(".townForm").change(function(){
					var tId=$(this).val() //选中的镇id
					$scope.ttid=tId
					$('.villFrom').html('')
					var cunList
					for (var obj in $scope.townList ){
					  	// 将json对象转换为字符串
					  	var str = JSON.stringify($scope.townList[obj]);
					  	// 将json字符串转换为map
					 	var map = eval("("+str+")");

					  	if(map.TownId==tId){
					  		// console.log(map.Villages)
					  		var aa=map.Villages
					  		aa.unshift({VillageId:'',VillageName:'暂不选择'})
					  		cunList=aa
					  		// console.log(cunList)

				  			for(var i=0;i<cunList.length;i++){
								var oPtions='<option value="'+cunList[i].VillageId+'" class="townOption">'+cunList[i].VillageName+'</option>'
								$('.villFrom').append(oPtions)
							}
					  		
						}

					 }
					 // console.log(cunList)
					
					var newBmList=[]

					for (var obj in bmList ){
					  	var str = JSON.stringify(bmList[obj]);
					 	var map = eval("("+str+")");

					  	if(map.TownId==tId && map.VillageId==-1 && map.CountyId==countyId){
				  			newBmList.push(map)
				  		}
					}
					$(".bmFrom").html('')
					for(var i=0;i<newBmList.length;i++){
						var oPtions='<option value="'+newBmList[i].DepId+'" class="townOption">'+newBmList[i].DepName+'</option>'
						$('.bmFrom').append(oPtions)
					}
				});
				$(".villFrom").change(function(){
					// console.log($(".villFrom").val())
					var villId=$(".villFrom").val()
					var newBmList=[]

					for (var obj in bmList ){
					  	var str = JSON.stringify(bmList[obj]);
					 	var map = eval("("+str+")");

					  	if(map.TownId==$scope.ttid && map.VillageId==villId && map.CountyId==countyId){
				  			newBmList.push(map)
				  		}
					}
					$(".bmFrom").html('')
					for(var i=0;i<newBmList.length;i++){
						var oPtions='<option value="'+newBmList[i].DepId+'" class="townOption">'+newBmList[i].DepName+'</option>'
						$('.bmFrom').append(oPtions)
					}
				})

				// console.log(type)

				$("#newAddModal").show()

				if(type=='add'){
					$scope.formType='post'
					$scope.formtext='新建人员成功'
					$("#myModalLabel").html('新增人员')
					$("#peopleIdID").attr('name','')

				}else{
					$scope.formType='put'
					$scope.formtext='编辑人员成功'


					// console.log(p)
					$("input[name='name']").val(p.PeopleInfo.PpName)

					$("#townown option[value='"+p.PeopleInfo.TownId+"']").attr("selected","selected"); 
					$("#cuncun option[value='"+p.PeopleInfo.VillageId+"']").attr("selected","selected"); 
					$("#bumenSelectId option[value='"+p.PeopleInfo.DepId+"']").attr("selected","selected"); 
					$("#zhiwuId option[value='"+p.PeopleInfo.MainDutyId+"']").attr("selected","selected"); 


					$("input[name='birth']").val(p.PeopleInfo.Birth)
					$("input[name='political']").val(p.PeopleInfo.Political)
					$("input[name='phone']").val(p.PeopleInfo.Phone)

					$("input[name='pic']").val(p.PeopleInfo.PicData)
					$("input[value="+ p.PeopleInfo.Sex +"]").attr("checked",'checked');

		
					// $("#peopleForm").append('<input type="hidden" id="peopleIdID" class="form-control" name="peopleid" value="'+p.PeopleInfo.PpId+'">')
					$("#peopleIdID").val(p.PeopleInfo.PpId)
					$("#peopleIdID").attr('name','peopleid')
					// pic

					// $("input[name='Name']").val(data.data.Name)

				}
			}

			$scope.closeModal=function(){
				$("#newAddModal").hide()

				$("input[name='name']").val('')
				$("input[name='birth']").val('')
				$("input[name='political']").val('')
				$("input[name='phone']").val('')

				$("input[name='pic']").val('')

				$("#newAddModal .townForm").html('<option value="" class="townOption">暂不选择</option>')
				$("#newAddModal .villFrom").html('<option value="" class="townOption">暂不选择</option>')

				$("#newAddModal .bmFrom").html('')
				$("#newAddModal .zwFrom").html('')		

			}
			$scope.cunBol='fff'

			// 获取展示列表    获取选中镇id
			$scope.slectTown=function(){

				// console.log($scope.townSelect.Villages)
				$scope.TownId=$scope.townSelect.TownId
				$scope.villList=$scope.townSelect.Villages
				$scope.villSelect=$scope.villList[0]

				// getPeopleList($scope.countyList.county.CountyId,$scope.TownId,'','')
				if($scope.TownId==-1){
					$scope.peopleList=$scope.peopleListAll
					$scope.cunBol='fff'
				}else{
					if($scope.villList==''||$scope.villList==null){
						$scope.cunBol='fff'
					}else{
						$scope.cunBol='ttt'
					}
					var ppList=[]
					for (var obj in $scope.peopleListAll ){
					  	// 将json对象转换为字符串
					  	var str = JSON.stringify($scope.peopleListAll[obj]);
					  	// 将json字符串转换为map
					 	var map = eval("("+str+")");
					 	console.log(map)
					  	if(map.TownId==$scope.TownId){
					  		// console.log(map)
							ppList.push(map)
						}
					 }
					 // console.log(ppList)
					 $scope.peopleList=ppList
				}
				// console.log($scope.peopleList)
				
			}
			// 获取选中村id
			$scope.slectVillage=function(){
				// console.log($scope.villSelect)
				if($scope.villSelect!=null){
					$scope.villId=$scope.villSelect.VillageId

					var ppList=[]
					for (var obj in $scope.peopleListAll ){
					  	// 将json对象转换为字符串
					  	var str = JSON.stringify($scope.peopleListAll[obj]);
					  	// 将json字符串转换为map
					 	var map = eval("("+str+")");
					 	console.log(map)
					  	if(map.TownId==$scope.TownId&&map.VillageId==$scope.villId){
					  		// console.log(map)
							ppList.push(map)
						}

					 }
					 // console.log(ppList)
					 $scope.peopleList=ppList
				}

			}

			// $('#datetimepicker').datetimepicker('show');

			// 日期控件
			$('#datetimepicker').datetimepicker({ 

			　　minView: "month", //选择日期后，不会再跳转去选择时分秒 

			　　format: "yyyy-mm-dd", //选择日期后，文本框显示的日期格式 

			　　language: 'zh-CN', //汉化 

			　　autoclose:true,

			});


			$(".addPeopleBtn").click(function(){
			  	// console.log('点保存了')
			  	// console.log($scope.formType)

					var htime =timest() 
		            var i=window.localStorage.getItem("uid")
					var role = window.localStorage.getItem("role")
		            var t=window.localStorage.getItem("tToken")
		            var ajaxUrl
		            if($scope.formType=='post'){
						ajaxUrl= oUrl+'/web/v1/people?htime='+htime+'&i='+i+'&t='+t
		            }else{
						ajaxUrl= oUrl+'/web/v1/people?htime='+htime+'&i='+i+'&t='+t+'&isusing='+$("#ztWrap").val()
		            }

			      	var options = {
			      		type:$scope.formType,
			      		dataType:'json',  
		                url:ajaxUrl,
		              
		                success: function (res) {
		                	// console.log(res)
		                 	 if( res.code==200 && res.errcode == 200 ){

					            alert($scope.formtext);

					 			location.reload()

					        }else{    
					            alert('修改镇信息'+res.msg);
					        }
     
	                    },
	                    file:function(res){
	                    	// console.log(res)
	                    }

	                };
                	$("#peopleForm").ajaxForm(options);

		 	})


		}
	}).when("/zwrygl",{//职务人员管理
		templateUrl:"zwrygl.html",
		controller: function($scope,$rootScope,$http){
			
			$scope.role=window.localStorage.getItem("role") //系统管理员0
			// 获取县信息
			$scope.countyList=JSON.parse(window.localStorage.getItem("countyList"))
			// console.log($scope.countyList.county)
			$('.county').html($scope.countyList.county.CountyName)
			$('.county').val($scope.countyList.county.CountyId)

				// 获取镇
			$scope.xName=JSON.parse(window.localStorage.getItem("countyList")).county.CountyName

			// $scope.xSelect=$scope.xList[0]
			$scope.townList=JSON.parse(window.localStorage.getItem("countyList")).county.Towns

			$scope.townList.unshift({'TownName':'请选择','TownId':-1})
			$scope.townSelect=$scope.townList[0]
			$scope.villList=[{'VillageName':'请选择','VillageId':-1}]
			$scope.villSelect=$scope.villList[0]

			getPeopleList(countyId,-1,-1,-1)

			$scope.peopleList=JSON.parse(window.localStorage.getItem("peopleShowList"))
			// console.log($scope.peopleList)

			var zwPeople=[]
			for (var obj in $scope.peopleList){
			  	// 将json对象转换为字符串
			  	var str = JSON.stringify($scope.peopleList[obj]);
			  	// 将json字符串转换为map
			 	var map = eval("("+str+")");

			  	if(map.Dutys!=null&&map.Dutys!=''){
			  		console.log(map)
			  		zwPeople.push(map)
			  	}
			}

			console.log(zwPeople)
			for(var i=0;i<zwPeople.length;i++){
			 	if(zwPeople[i].PeopleInfo.PicData!=''){
			 		zwPeople[i].PeopleInfo.PicData=oUrl+'/'+zwPeople[i].PeopleInfo.PicData
			 	}
			}

			$scope.zwAllPeople=zwPeople
			var xPeople=[]
			for (var obj in $scope.zwAllPeople){
			  	// 将json对象转换为字符串
			  	var str = JSON.stringify($scope.zwAllPeople[obj]);
			  	// 将json字符串转换为map
			 	var map = eval("("+str+")");

			  	if(map.PeopleInfo.TownId==-1&&map.PeopleInfo.VillageId==-1){
			  		console.log(map)
			  		xPeople.push(map)
			  	}
			}
			$scope.xPeople=xPeople
			$scope.zwPeople=xPeople



				// 获取选中镇id
			$scope.slectTown=function(){

				// console.log($scope.townSelect.TownId)
				$scope.TownId=$scope.townSelect.TownId

				if($scope.TownId==-1){ //全部
					$scope.zwPeople=$scope.xPeople

					$scope.villList=[{'VillageName':'请选择','VillageId':-1}]
					$scope.villSelect=$scope.villList[0]
				}else{
					var zwPeople=[]
					for (var obj in $scope.zwAllPeople){
				  	// 将json对象转换为字符串
					  	var str = JSON.stringify($scope.zwAllPeople[obj]);
					  	// 将json字符串转换为map
					 	var map = eval("("+str+")");

					  	if(map.PeopleInfo.TownId==$scope.TownId){
					  		console.log(map)
					  		zwPeople.push(map)
					  	}

					}
					$scope.zwPeople=zwPeople
					$scope.townPeople=$scope.zwPeople

					// console.log($scope.townSelect.Villages)

					if($scope.townSelect.Villages==null||$scope.townSelect.Villages==''){
						// console.log("没有村")
						$scope.villList=[{'VillageName':'请选择','VillageId':-1}]
						$scope.villSelect=$scope.villList[0]
					}else{
						$scope.villList=$scope.townSelect.Villages
						$scope.villList.unshift({'VillageName':'请选择','VillageId':-1})
						$scope.villSelect=$scope.villList[0]
					}
					
				}
				
			}
			// // 获取选中村id
			$scope.slectVillage=function(){
				// console.log($scope.villSelect)
				// if($scope.villSelect!=null){
				$scope.villId=$scope.villSelect.VillageId
					
				// }
				if($scope.villId==-1){ //全部
					$scope.zwPeople=$scope.townPeople

				}else{
					var cunPeople=[]
					for (var obj in $scope.townPeople){
				  	// 将json对象转换为字符串
					  	var str = JSON.stringify($scope.townPeople[obj]);
					  	// 将json字符串转换为map
					 	var map = eval("("+str+")");

					  	if(map.PeopleInfo.VillageId==$scope.villId){
					  		console.log(map)
					  		cunPeople.push(map)
					  	}

					}
					$scope.zwPeople=cunPeople
					
				}
				
			}
			// 删除职务
			$scope.delZhiwu=function(peopleId,zhiwuId){
				var htime =timest() 
			    var i=window.localStorage.getItem("uid")
				 var t=window.localStorage.getItem("tToken")


				 $http({
					method: "delete",
					url :oUrl+'/web/v1/people/duty?htime='+htime+'&i='+i+'&t='+t+'&peopleid='+peopleId+'&dutyid='+zhiwuId,
					headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
				}).then(function(res){
					// console.log(res)
					 if( res.data.code==200 && res.data.errcode == 200 ){
		
						alert('删除人员职务成功')
						location.reload()

			        }else{    
			            alert('删除人员职务信息'+res.data.msg);
			        }
				});
			}
		}
	}).when("/zwryxz",{//职务人员新增
		templateUrl:"zwryxz.html",
		controller: function($scope,$rootScope,$http){
			$scope.role=window.localStorage.getItem("role") //系统管理员0
			// 获取县信息
			$scope.countyList=JSON.parse(window.localStorage.getItem("countyList"))
			// console.log($scope.countyList.county)
			$('.county').html($scope.countyList.county.CountyName)
			$('.county').val($scope.countyList.county.CountyId)

				// 获取镇
			$scope.townList=JSON.parse(window.localStorage.getItem("countyList")).county.Towns

			$scope.townList.unshift({'TownName':'全部','TownId':-1})
			$scope.townSelect=$scope.townList[0]
			$scope.villList=[{'VillageName':'全部','VillageId':-1}]
			$scope.villSelect=$scope.villList[0]

			getPeopleList(countyId,-1,-1,-1)

			$scope.peopleList=JSON.parse(window.localStorage.getItem("peopleShowList"))
			// console.log($scope.peopleList)

			var zwPeople=[]
			var noZwPeople=[]
			for (var obj in $scope.peopleList){
			  	// 将json对象转换为字符串
			  	var str = JSON.stringify($scope.peopleList[obj]);
			  	// 将json字符串转换为map
			 	var map = eval("("+str+")");

			  	if(map.Dutys!=null&&map.Dutys!=''){
			  		console.log(map)
			  		zwPeople.push(map)
			  	}else{
			  		noZwPeople.push(map)
			  	}

			 }
			 var pTpeople=[] //普通
			 for (var obj in $scope.peopleList){
			  	// 将json对象转换为字符串
			  	var str = JSON.stringify($scope.peopleList[obj]);
			  	// 将json字符串转换为map
			 	var map = eval("("+str+")");

			  	if(map.PeopleInfo.MainDutyId<0||map.PeopleInfo.MainDutyId==''){
			  		// console.log(map)
			  		pTpeople.push(map)
			  	}
			 }
			 $scope.pTpeople=pTpeople
			 // console.log(pTpeople)
			 // console.log(zwPeople)
			 for(var i=0;i<zwPeople.length;i++){
			 	if(zwPeople[i].PeopleInfo.PicData!=''){
			 		zwPeople[i].PeopleInfo.PicData=oUrl+'/'+zwPeople[i].PeopleInfo.PicData
			 	}
			 }
			 for(var i=0;i<noZwPeople.length;i++){
			 	if(noZwPeople[i].PeopleInfo.PicData!=''){
			 		noZwPeople[i].PeopleInfo.PicData=oUrl+'/'+noZwPeople[i].PeopleInfo.PicData
			 	}
			 }

			 $scope.zwAllPeople=zwPeople
			 $scope.zwPeople=$scope.zwAllPeople
			  $scope.noZwAllPeople=noZwPeople
			 $scope.noZwPeople=$scope.noZwAllPeople

			 $scope.zwList=JSON.parse(window.localStorage.getItem("dutyList"))
			 $scope.zwBtnList =$scope.zwList
			 console.log($scope.zwList)
			 for(var i=0;i< $scope.zwList.length;i++){
			 	$("#zwWrap").append('<option value="'+$scope.zwList[i].DutyId+'">'+$scope.zwList[i].DutyName+'</option>')
			 }

			// 获取选中镇id
			$scope.slectTown=function(){

				// console.log($scope.townSelect.TownId)
				$scope.TownId=$scope.townSelect.TownId

				if($scope.TownId==-1){ //全部
					$scope.zwPeople=$scope.zwAllPeople

					$scope.villList=[{'VillageName':'全部','VillageId':-1}]
					$scope.villSelect=$scope.villList[0]
				}else{
					var zwPeople=[]
					for (var obj in $scope.zwAllPeople){
				  	// 将json对象转换为字符串
					  	var str = JSON.stringify($scope.zwAllPeople[obj]);
					  	// 将json字符串转换为map
					 	var map = eval("("+str+")");

					  	if(map.PeopleInfo.TownId==$scope.TownId){
					  		console.log(map)
					  		zwPeople.push(map)
					  	}

					}
					$scope.zwPeople=zwPeople
					$scope.townPeople=$scope.zwPeople

					// console.log($scope.townSelect.Villages)

					if($scope.townSelect.Villages==null||$scope.townSelect.Villages==''){
						// console.log("没有村")
						$scope.villList=[{'VillageName':'全部','VillageId':-1}]
						$scope.villSelect=$scope.villList[0]
					}else{
						$scope.villList=$scope.townSelect.Villages
						$scope.villList.unshift({'VillageName':'全部','VillageId':-1})
						$scope.villSelect=$scope.villList[0]
					}
					
				}
				
			}
			// $scope.slectZw=function(){
			// 	$scope.DutyId=$scope.zwSelect.DutyId
			// }
			// // 获取选中村id
			$scope.slectVillage=function(){
				// console.log($scope.villSelect)
				// if($scope.villSelect!=null){
				$scope.villId=$scope.villSelect.VillageId
					
				// }
				if($scope.villId==-1){ //全部
					$scope.zwPeople=$scope.townPeople

				}else{
					var cunPeople=[]
					for (var obj in $scope.townPeople){
				  	// 将json对象转换为字符串
					  	var str = JSON.stringify($scope.townPeople[obj]);
					  	// 将json字符串转换为map
					 	var map = eval("("+str+")");

					  	if(map.PeopleInfo.VillageId==$scope.villId){
					  		console.log(map)
					  		cunPeople.push(map)
					  	}

					}
					$scope.zwPeople=cunPeople
					
				}
				
			}
			// 搜索
			$("#searchBtn").click(function(){
				var seaName=$("#searchInput").val()
				if(seaName!=''){
					var newList=[]
					for (var obj in $scope.noZwAllPeople ){
					  	var str = JSON.stringify($scope.noZwAllPeople[obj]);
					 	var map = eval("("+str+")");
					 	// console.log(map.MeetRoomInfo.m_room_name.indexOf(seaName))
					  	if(map.PeopleInfo.PpName.indexOf(seaName)!=-1){
					  		newList.push(map)
					  	}
					}
					// console.log(newList)

					$scope.noZwPeople=newList
					$scope.$apply();

				}else{
					alert('请输入会议室名称')
				}
				
			})
			$("#allBtn").click(function(){
				$scope.noZwPeople=$scope.noZwAllPeople
				$scope.$apply();
			})
			// 添加职务
			$scope.getModalAdd=function(id){
				$scope.peopleAddId=id
			}
			$scope.saveBtn=function(){
				var htime =timest() 
			    var i=window.localStorage.getItem("uid")
				var t=window.localStorage.getItem("tToken")

				$http({
					method: "post",
					url :oUrl+'/web/v1/people/duty?htime='+htime+'&i='+i+'&t='+t+'&peopleid='+$scope.peopleAddId+'&dutyid='+$("#zwWrap").val(),
					headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
				}).then(function(res){
					// console.log(res)
					 if( res.data.code==200 && res.data.errcode == 200 ){
		
						alert('新建人员职务成功')
						location.reload()

			        }else{    
			            alert('新建人员职务信息'+res.data.msg);
			        }
				});
			}
			// 删除职务
			$scope.delZhiwu=function(peopleId,zhiwuId){
				var htime =timest() 
			    var i=window.localStorage.getItem("uid")
				 var t=window.localStorage.getItem("tToken")


				 $http({
					method: "delete",
					url :oUrl+'/web/v1/people/duty?htime='+htime+'&i='+i+'&t='+t+'&peopleid='+peopleId+'&dutyid='+zhiwuId,
					headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
				}).then(function(res){
					// console.log(res)
					 if( res.data.code==200 && res.data.errcode == 200 ){
		
						alert('删除人员职务成功')
						location.reload()

			        }else{    
			            alert('删除人员职务信息'+res.data.msg);
			        }
				});
			}
			
		}
	}).when("/xzzlgl",{//乡镇资料管理
		templateUrl:"xzzlgl.html",
		controller: function($scope,$rootScope,$http){
			$scope.oUrl=oUrl
			// 获取镇资料类型
			var htime=timest() 
			var i=window.localStorage.getItem("uid")
			var t=window.localStorage.getItem("tToken")
		  	$http({
				method: "get",
				url :oUrl+'/web/v1/doc/type/town?htime='+htime+'&i='+i+'&t='+t,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				async : false,
                transformRequest: function (obj) {
                    var str = [];
                    for (var o in obj)
                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
                    return str.join("&");
                },
			}).then(function(res){
				 if( res.data.code==200 && res.data.errcode == 200 ){
					// console.log('token',res.data.data.token)
					// console.log(res.data.data)  
				    // window.localStorage.setItem("tToken",res.data.data.token);
					getCountyList(countyId,res.data.data.token)
					
					$scope.zlTypeList=res.data.data.doctype

					$scope.typeSelect = $scope.zlTypeList[0]
					// console.log('type111111111111', $scope.typeSelect)
					
		        }else{    
		            alert('获取镇资料类型'+res.data.msg);
		        }
			}).then(function(){
				$scope.zwList=JSON.parse(window.localStorage.getItem("countyList")).county.Towns
				console.log($scope.zwList)
				// 获取镇
				// $scope.townList=JSON.parse(window.localStorage.getItem("countyList")).county.Towns
				// // 遍历镇
				// for(var i=0;i<$scope.townList.length;i++){
				// 	var oPtions='<option value="'+$scope.townList[i].TownId+'" class="townOption">'+$scope.townList[i].TownName+'</option>'
				// 	$('.townForm').append(oPtions)
				// }
				// $scope.townList.unshift({'TownName':'全部','TownId':-1,'Villages':''})
				// $scope.townSelect=$scope.townList[0]
		
				// console.log($scope.zwList)
				$scope.dwSelect=$scope.zwList[0]
				$scope.dwId=$scope.dwSelect.TownId
				// console.log('type', $scope.zlTypeList)

				$scope.typeId= $scope.zlTypeList[0].DocTypeId
				// console.log('type', $scope.zlTypeList[0])
				// getZLList(countyId,typeId,dwId,townId,villId)
				$scope.zlShowList=getZLList(countyId,$scope.typeId,-1,$scope.dwId,'').docs

				// console.log($scope.zlShowList)
				$scope.zlShowAllList=$scope.zlShowList
				// 单位选择事件
				$scope.slectdwType=function(){
					// console.log($scope.dwSelect)
					$scope.dwId=$scope.dwSelect.TownId

					$scope.zlShowList=getZLList(countyId,$scope.typeId,-1,$scope.dwId,'').docs

					$scope.zlShowAllList=$scope.zlShowList

					$("#showType option").attr("selected", false)
					$("#showType option[value=0]").attr("selected", true)

				}
				// 类型选择事件
				$scope.slectzlType=function(){
					// console.log($scope.typeSelect)
					$scope.typeId=$scope.typeSelect.DocTypeId

					$scope.zlShowList=getZLList(countyId,$scope.typeId,-1,$scope.dwId,'').docs

					$scope.zlShowAllList=$scope.zlShowList

					$("#showType option").attr("selected", false)
					$("#showType option[value=0]").attr("selected", true)

				}

				$("#showType").change(function(){
					// console.log($scope.zlShowAllList)
					var list=[]
					if($("#showType").val()==1){
						for (var obj in $scope.zlShowAllList ){
						  	var str = JSON.stringify($scope.zlShowAllList[obj]);
						 	var map = eval("("+str+")");
						  	if(map.IsUsing==1){
						  		// console.log(map)
						  		list.push(map)
						  	}
						}
					}else if($("#showType").val()==-1){
						for (var obj in $scope.zlShowAllList ){
						  	var str = JSON.stringify($scope.zlShowAllList[obj]);
						 	var map = eval("("+str+")");
						  	if(map.IsUsing!=1){
						  		// console.log(map)
						  		list.push(map)
						  	}
						}
					}else if($("#showType").val()==0){
						list=$scope.zlShowAllList
					}

					$scope.zlShowList=list
					$scope.$apply();

					// console.log(list)
				})

				$scope.goEdit=function(p){
					window.localStorage.setItem("editCon",JSON.stringify(p))
					// location.href='editPage.html?go=town&type=edit&zlId='+p.DocId
					window.open('editPage.html?go=town&type=edit&zlId='+p.DocId)
				}

				
				$scope.yulan=function(p){
					$scope.showHtml=p.DocData
					$(".aaaa").html(p.DocData)
				}
			})

			
			
		}
	}).when("/czl",{//村资料管理
		templateUrl:"czl.html",
		controller: function($scope,$rootScope,$http){
			$scope.role=window.localStorage.getItem("role") //系统管理员0
			// 获取县信息
			$scope.countyList=JSON.parse(window.localStorage.getItem("countyList"))
			// console.log($scope.countyList.county)
			$scope.townList=JSON.parse(window.localStorage.getItem("countyList")).county.Towns
			$scope.townList.unshift({'TownName':'全部','TownId':-1})
			$scope.townSelect=$scope.townList[0] //给镇加初始值
			// console.log($scope.townList)

			// 获取村资料类型
			var htime=timest() 
			var i=window.localStorage.getItem("uid")
			var t=window.localStorage.getItem("tToken")

			$scope.showBol=false

		  	$http({
				method: "get",
				url :oUrl+'/web/v1/doc/type/village?htime='+htime+'&i='+i+'&t='+t,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var o in obj)
                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
                    return str.join("&");
                },
			}).then(function(res){
				 if( res.data.code==200 && res.data.errcode == 200 ){
					// console.log('token',res.data.data.token)
					// console.log(res.data.data)  
				    // window.localStorage.setItem("tToken",res.data.data.token);
					getCountyList(countyId,res.data.data.token)
					
					$scope.zlTypeList=res.data.data.doctype

					$scope.typeSelect = $scope.zlTypeList[0]
					$scope.typeId=$scope.typeSelect.DocTypeId
		        }else{    
		            alert('获取镇资料类型'+res.data.msg);
		        }
			}).then(function(){
				$scope.zlShowList=getZLList(countyId,$scope.typeId,-1,-1,-1).docs
					// 获取选中镇id
				$scope.slectTown=function(){

					// console.log($scope.townSelect.Villages)
					if($scope.townSelect.Villages==undefined||$scope.townSelect.Villages==''){ //没村
						$scope.showBol=false
						$scope.TownId=-1
						$scope.villList=[]
					}else{ //有村
						$scope.showBol=true
						$scope.TownId=$scope.townSelect.TownId

						$scope.villList=$scope.townSelect.Villages
						$scope.villList.unshift({'VillageName':'全部','VillageId':-1})
						$scope.villSelect=$scope.villList[0]
					}

					$scope.zlShowList=getZLList(countyId,$scope.typeId,-1,$scope.TownId,-1).docs
					$("#showType option").attr("selected", false)
					$("#showType option[value=0]").attr("selected", true)
					$scope.zlShowAllList=$scope.zlShowList
					
				}
				// 获取选中村id
				$scope.slectVillage=function(){
					// console.log($scope.villList)
					// console.log($scope.villSelect)
					if($scope.villSelect!=null){
						$scope.villId=$scope.villSelect.VillageId

					}else{
						$scope.villId=-1
					}

					$scope.zlShowList=getZLList(countyId,$scope.typeId,-1,$scope.TownId,$scope.villId).docs


					$scope.zlShowAllList=$scope.zlShowList

					$("#showType option").attr("selected", false)
					$("#showType option[value=0]").attr("selected", true)
					
				}
				$scope.slectzlType=function(){
					// console.log($scope.typeSelect)
					$scope.typeId=$scope.typeSelect.DocTypeId

					$scope.zlShowList=getZLList(countyId,$scope.typeId,-1,$scope.TownId,$scope.villId).docs
				}

				$("#showType").change(function(){
					// console.log($scope.zlShowAllList)
					var list=[]
					if($("#showType").val()==1){
						for (var obj in $scope.zlShowAllList ){
						  	var str = JSON.stringify($scope.zlShowAllList[obj]);
						 	var map = eval("("+str+")");
						  	if(map.IsUsing==1){
						  		// console.log(map)
						  		list.push(map)
						  	}
						}
					}else if($("#showType").val()==-1){
						for (var obj in $scope.zlShowAllList ){
						  	var str = JSON.stringify($scope.zlShowAllList[obj]);
						 	var map = eval("("+str+")");
						  	if(map.IsUsing!=1){
						  		// console.log(map)
						  		list.push(map)
						  	}
						}
					}else if($("#showType").val()==0){
						list=$scope.zlShowAllList
					}

					$scope.zlShowList=list
					$scope.$apply();

					// console.log(list)
				})

				
				$scope.yulan=function(p){
					$scope.showHtml=p.DocData
					$(".aaaa").html(p.DocData)
				}
				$scope.goEdit=function(p){
					window.localStorage.setItem("editCon",JSON.stringify(p))
					// location.href='editPage.html?go=vill&type=edit&zlId='+p.DocId
					window.open('editPage.html?go=vill&type=edit&zlId='+p.DocId)
				}

			});



		
			
		}
	}).when("/hmzcgl",{//惠民政策管理
		templateUrl:"hmzcgl.html",
		controller: function($scope,$rootScope,$http){
			 var allType=getAllTypeList(countyId)
			 $scope.hmzcList=getHmzcList(countyId,'')
			 // console.log( $scope.hmzcList)
			 allType.hmzc.unshift({'DocTypeName':'全部','DocTypeId':''})
			 $scope.hmzlType=allType.hmzc
			 // console.log(allType)
			 $scope.juWeiSelect=$scope.hmzlType[0]

			 $scope.hmzcAllList=$scope.hmzcList


			 $scope.slectJw=function(){
				// console.log($scope.juWeiSelect)
				if($scope.juWeiSelect.DocTypeName=='全部'){
					$scope.dwId=''
				}else{
					$scope.dwId=$scope.juWeiSelect.DocTypeName
				}

				$scope.hmzcList=getHmzcList(countyId,$scope.dwId)

				$scope.hmzcAllList=$scope.hmzcList

				$("#showType option").attr("selected", false)
				$("#showType option[value=0]").attr("selected", true)

			}

			$("#showType").change(function(){
				// console.log($scope.hmzcAllList)
				var list=[]
				if($("#showType").val()==1){
					for (var obj in $scope.hmzcAllList ){
					  	var str = JSON.stringify($scope.hmzcAllList[obj]);
					 	var map = eval("("+str+")");
					  	if(map.IsUsing==1){
					  		// console.log(map)
					  		list.push(map)
					  	}
					}
				}else if($("#showType").val()==-1){
					for (var obj in $scope.hmzcAllList ){
					  	var str = JSON.stringify($scope.hmzcAllList[obj]);
					 	var map = eval("("+str+")");
					  	if(map.IsUsing!=1){
					  		// console.log(map)
					  		list.push(map)
					  	}
					}
				}else if($("#showType").val()==0){
					list=$scope.hmzcAllList
				}

				$scope.hmzcList=list
				$scope.$apply();

				// console.log(list)
			})

			
			$scope.yulan=function(p){
				$scope.showHtml=p.DocData
				$(".aaaa").html(p.DocData)
			}
			$scope.goEdit=function(p){
				window.localStorage.setItem("editCon",JSON.stringify(p))
				// location.href='editPage.html?go=hmzc&type=edit&zlId='+p.DocId
				window.open('editPage.html?go=hmzc&type=edit&zlId='+p.DocId)
			}



			
		}
	}).when("/syspgl",{//首页视频管理
		templateUrl:"syspgl.html",
		controller: function($scope,$rootScope,$http, $sce){
			var docid
			var htime=timest() 
			var i=window.localStorage.getItem("uid")
			var t=window.localStorage.getItem("tToken")
		  	$http({
				method: "get",
				url :oUrl+'/web/v1/video/main?htime='+htime+'&i='+i+'&t='+t+'&county='+countyId+'&town=-1',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				async : false,
                transformRequest: function (obj) {
                    var str = [];
                    for (var o in obj)
                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
                    return str.join("&");
                },
			}).then(function(res){
				 if( res.data.code==200 && res.data.errcode == 200 ){
					// console.log('token',res.data.data.token)
					// console.log(res.data.data.doc)  
					var str=oUrl+'/'+res.data.data.doc.DocData
					// console.log(str)
					$scope.videoUrl=str
					docid=res.data.data.doc.DocId

					// $("#videoShow").attr('src',str)

					 $scope.videoUrlFun = function(url){
				        //$sce.trustAsResourceUrl方法把普通路径处理加工成一个angular环境可识别，并认为是安全的路径来使用
				        var urlFun = $sce.trustAsResourceUrl(url);
				        return urlFun;
				    };

					
		        }else{    
		            alert('获取镇资料类型'+res.data.msg);
		        }
			})

			//上传视频

			 var xhr;//异步请求对象
		    var ot; //时间
		    var oloaded;//大小
		    //上传文件方法
		    $('#file').change(function (e) {
		        var fileObj = document.getElementById("file").files[0]; // js 获取文件对象
		        if(fileObj.name){
		            $(".el-upload-list").css("display","block");
		            $(".el-upload-list li").css("border","1px solid #20a0ff");
		            $("#videoName").text(fileObj.name);
		        }else{
		            alert("请选择文件");
		        }
		    })
		    /*点击取消*/
		    function del(){
		        $("#file").val('');
		        $(".el-upload-list").css("display","none");
		    }
		    /*点击提交*/
		    $('.shangchuan').click(function(){
		        var fileObj = document.getElementById("file").files[0]; // js 获取文件对象
		        if(fileObj==undefined||fileObj==""){
		            alert("请选择文件");
		            return false;
		        };

		      //  var docid=1380465284349952
		      //  var url = oUrl+'/web/v1/video/main?htime='+htime+'&i='+i+'&t='+t+'&docid='+docid; // 接收上传文件的后台地址 

		        var url = oUrl+'/web/v1/upload/video'

		        var form = new FormData(); // FormData 对象
		        form.append("video", fileObj); // 文件对象 
		        // form.append("title", title); // 标题
		        xhr = new XMLHttpRequest(); // XMLHttpRequest 对象
		        xhr.open("post", url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
		        xhr.onload = uploadComplete; //请求完成
		        xhr.onerror = uploadFailed; //请求失败
		        xhr.upload.onprogress = progressFunction; //【上传进度调用方法实现】
		        xhr.upload.onloadstart = function() { //上传开始执行方法
		            ot = new Date().getTime(); //设置上传开始时间
		            oloaded = 0; //设置上传开始时，以上传的文件大小为0
		        };
		        xhr.send(form); //开始上传，发送form数据
		    })
		    
		    //上传进度实现方法，上传过程中会频繁调用该方法
		    function progressFunction(evt) { 
		        // event.total是需要传输的总字节，event.loaded是已经传输的字节。如果event.lengthComputable不为真，则event.total等于0
		        if(evt.lengthComputable) {
		            $(".el-progress--line").css("display","block");
		            /*进度条显示进度*/
		            $(".el-progress-bar__inner").css("width", Math.round(evt.loaded / evt.total * 100) + "%");
		            $(".el-progress__text").html(Math.round(evt.loaded / evt.total * 100)+"%");   
		        }

		        var time = document.getElementById("time");
		        var nt = new Date().getTime(); //获取当前时间
		        var pertime = (nt - ot) / 1000; //计算出上次调用该方法时到现在的时间差，单位为s
		        ot = new Date().getTime(); //重新赋值时间，用于下次计算

		        var perload = evt.loaded - oloaded; //计算该分段上传的文件大小，单位b 
		        oloaded = evt.loaded; //重新赋值已上传文件大小，用以下次计算

		        //上传速度计算
		        var speed = perload / pertime; //单位b/s
		        var bspeed = speed;
		        var units = 'b/s'; //单位名称
		        if(speed / 1024 > 1) {
		            speed = speed / 1024;
		            units = 'k/s';
		        }
		        if(speed / 1024 > 1) {
		            speed = speed / 1024;
		            units = 'M/s';
		        }
		        speed = speed.toFixed(1);
		        //剩余时间
		        var resttime = ((evt.total - evt.loaded) / bspeed).toFixed(1);
		        time.innerHTML = '上传速度：' + speed + units + ',剩余时间：' + resttime + 's';
		        if(bspeed == 0)
		            time.innerHTML = '上传已取消';
		    }
		    //上传成功响应
		    function uploadComplete(evt) {
		        //服务断接收完文件返回的结果  注意返回的字符串要去掉双引号
		        if(evt.target.responseText){

		        	// console.log(evt.currentTarget.response)

		        	var res= JSON.parse(evt.currentTarget.response)
		        	// console.log(res)

	        		if( res.code==200 && res.errcode == 200 ){
						// console.log(res.data)

						var htime =timest() 
			            var i=window.localStorage.getItem("uid")
						var role = window.localStorage.getItem("role")
			            var t=window.localStorage.getItem("tToken")


		           //     	var url= oUrl+'/web/v1/video/main?htime='+htime+'&i='+i+'&t='+t+'&docid='+docid
		           //        var form2 = new FormData(); // FormData 对象
					        // form2.append("videourl ", res.data.video_save_url); // 文件对象 
					        // // form.append("title", title); // 标题
					        // xhr = new XMLHttpRequest(); // XMLHttpRequest 对象
					        // xhr.open("put", url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
					        // xhr.onload = uploadComplete2; //请求完成
					        // // xhr.onerror = uploadFailed; //请求失败
					        // // xhr.upload.onprogress = progressFunction; //【上传进度调用方法实现】
					        // // xhr.upload.onloadstart = function() { //上传开始执行方法
					        //     // ot = new Date().getTime(); //设置上传开始时间
					        //     // oloaded = 0; //设置上传开始时，以上传的文件大小为0
					        // // };
					        // xhr.send(form2); //开始上传，发送form数据

					    $.ajax({
							type: "put",
							url :  oUrl+'/web/v1/video/main?htime='+htime+'&i='+i+'&t='+t+'&docid='+docid+'&videourl='+res.data.video_save_url,
							async : false,
							success : function(res){
								 if( res.code==200 && res.errcode == 200 ){ 
								    // console.log(res.data)
						        }else{    
						            alert(res.msg);  
						        }    
							},
						     error : function() {    
						           alert('获取人员信息'+res.msg);  
						     }  
						})


			        }else{    
			            alert('编辑视频'+res.data.msg);
			        }
		            
		            // alert("上传成功！");
		           
		        }else{
		            alert("上传失败");
		        }
		    }

		    //上传失败
		    function uploadFailed(evt) {
		        alert("上传失败！");
		    }
		}
	}).when("/qcjsck",{//纪实管理
		templateUrl:"qcjsck.html",
		controller: function($scope,$rootScope,$http){
			$scope.role=window.localStorage.getItem("role") //系统管理员0
			// 获取县信息
			$scope.countyList=JSON.parse(window.localStorage.getItem("countyList"))
			// console.log($scope.countyList.county)
			$scope.townList=JSON.parse(window.localStorage.getItem("countyList")).county.Towns
			$scope.townList.unshift({'TownName':'全部','TownId':-1})

			$scope.townSelect=$scope.townList[0] //给镇加初始值
			$scope.townId=-1
			$scope.villId=-1

			// console.log($scope.townList)
			
			// console.log($scope.townSelect)

			var list=getqcjsTypeList(countyId)
			// console.log(list)

			$scope.qcjsType=list.types
			$scope.qcjsType.unshift({type_id: -1,typename: "全部"})
			// console.log($scope.qcjsType)
			$scope.qcjsYt=list.issues
			$scope.qcjsYt.unshift({issues_id: -1,issuesname: "全部"})


			$scope.typeSelect=$scope.qcjsType[0]
			$scope.typeId=$scope.qcjsType[0].type_id

			$scope.ytSelect=$scope.qcjsYt[0]
			$scope.ytId=$scope.qcjsYt[0].issues_id

			$scope.villList=[{'VillageName':'全部','VillageId':-1}]

			$scope.villSelect=$scope.villList[0]

			$scope.qcjsList=getqcjsList(countyId,$scope.townId,$scope.villId,$scope.typeId,$scope.ytId)
			// console.log($scope.qcjsList)

			$scope.slectTown=function(){

				// console.log($scope.townSelect.Villages)
				$scope.townId=$scope.townSelect.TownId
				// $scope.townName=$scope.townSelect.Town

				if($scope.townSelect.Villages==undefined||$scope.townSelect.Villages==null){
					$scope.villList=[{'VillageName':'全部','VillageId':-1}]
				}else{
					$scope.villList=$scope.townSelect.Villages
					$scope.villList.unshift({'VillageName':'全部','VillageId':-1})

					$scope.villSelect=$scope.villList[0]
				}
				
				$scope.qcjsList=getqcjsList(countyId,$scope.townId,$scope.villId,$scope.typeId,$scope.ytId)
				// console.log($scope.villList)

				// $scope.showBol=true
			}
			// 获取选中村id
			$scope.slectVillage=function(){
				// console.log($scope.villSelect)
				if($scope.villSelect!=null){
					$scope.villId=$scope.villSelect.VillageId
					
					$scope.qcjsList=getqcjsList(countyId,$scope.townId,$scope.villId,$scope.typeId,$scope.ytId)			
				}else{
					$scope.villId=-1
					$scope.qcjsList=getqcjsList(countyId,$scope.townId,$scope.villId,$scope.typeId,$scope.ytId)	
				}

			}
			// 获取会议类型
			$scope.slectType=function(){
				// console.log($scope.typeSelect)
				if($scope.typeSelect!=null){
					$scope.typeId=$scope.typeSelect.type_id
					
					$scope.qcjsList=getqcjsList(countyId,$scope.townId,$scope.villId,$scope.typeId,$scope.ytId)			
				}else{
					$scope.typeId=-1
					$scope.qcjsList=getqcjsList(countyId,$scope.townId,$scope.villId,$scope.typeId,$scope.ytId)	
				}

			}
			// 获取会议议题
			$scope.slectYt=function(){
				// console.log($scope.ytSelect)
				if($scope.ytSelect!=null){
					$scope.ytId=$scope.ytSelect.issues_id
					
					$scope.qcjsList=getqcjsList(countyId,$scope.townId,$scope.villId,$scope.typeId,$scope.ytId)			
				}else{
					$scope.ytId=-1
					$scope.qcjsList=getqcjsList(countyId,$scope.townId,$scope.villId,$scope.typeId,$scope.ytId)	
				}

			}

			
		}
	}).when("/hygl",{//会议中会议管理
		templateUrl:"hygl.html",
		controller: function($scope,$rootScope,$http){

			$scope.hyglList=getMettingList()
			$scope.roomAllList=$scope.hyglList

			$("#typeWrap").change(function(){
				$scope.hyglList=getSbList($("#typeWrap").val())
				$scope.$apply();
			})

			$("#searchBtn").click(function(){
				var seaName=$("#searchInput").val()
				if(seaName!=''){
					var newList=[]
					for (var obj in $scope.roomAllList ){
					  	var str = JSON.stringify($scope.roomAllList[obj]);
					 	var map = eval("("+str+")");
					 	// console.log(map.MeetRoomInfo.m_room_name.indexOf(seaName))
					  	if(map.MeetRoomInfo.m_room_name.indexOf(seaName)!=-1){
					  		newList.push(map)
					  	}
					}
					// console.log(newList)

					$scope.hyglList=newList
					$scope.$apply();

				}else{
					alert('请输入会议室名称')
				}
				
			})

			function getSbList(select1){
				// console.log(select1)
				roomList=[]
				if(select1==0){ //两个都是全部
					roomList=$scope.roomAllList
				}else if(select1==1){
					for (var obj in $scope.roomAllList ){
					  	var str = JSON.stringify($scope.roomAllList[obj]);
					 	var map = eval("("+str+")");
					  	if(map.MeetRoomInfo.m_room_id>0){
					  		roomList.push(map)
					  	}
					}
				}else if(select1==-1){ //type在线 查看 全部
					for (var obj in $scope.roomAllList ){
					  	var str = JSON.stringify($scope.roomAllList[obj]);
					 	var map = eval("("+str+")");
					  	if(map.MeetRoomInfo.m_room_id<0){
					  		roomList.push(map)
					  	}
					}
				}
				
				return roomList
			}

			
		}
	}).when("/gdhysck",{//固定会议室管理
		templateUrl:"gdhysck.html",
		controller: function($scope,$rootScope,$http){
			$scope.roomList=getMetRoomList('')
			$scope.roomAllList=$scope.roomList

			$scope.townList=JSON.parse(window.localStorage.getItem("countyList")).county.Towns
			// console.log($scope.townList)
			$scope.townList.unshift({'TownName':'全部','TownId':-1})
			$scope.townSelect=$scope.townList[0] //给镇加初始值

			$scope.slectTown=function(){
	
				$scope.TownId=$scope.townSelect.TownId

				$scope.roomList=getMetRoomList($scope.TownId)
				$scope.roomAllList=$scope.roomList
				$("#typeWrap option[value='0']").attr('selected','selected')
				$("#showType option[value='0']").attr('selected','selected')

				getSbList(0,0)

			}
			$("#typeWrap").change(function(){
				$scope.roomList=getSbList($("#typeWrap").val(),$("#showType").val())
				$scope.$apply();
			})
			$("#showType").change(function(){
				$scope.roomList=getSbList($("#typeWrap").val(),$("#showType").val())
				$scope.$apply();
			})
			// console.log($scope.roomAllList)

			$("#searchBtn").click(function(){
				var seaName=$("#searchInput").val()
				if(seaName!=''){
					var newList=[]
					for (var obj in $scope.roomAllList ){
					  	var str = JSON.stringify($scope.roomAllList[obj]);
					 	var map = eval("("+str+")");
					 	// console.log(map.MeetRoomInfo.m_room_name.indexOf(seaName))
					  	if(map.MeetRoomInfo.m_room_name.indexOf(seaName)!=-1){
					  		newList.push(map)
					  	}
					}
					// console.log(newList)

					$scope.roomList=newList
					$scope.$apply();

				}else{
					alert('请输入会议室名称')
				}
				
			})


			function getSbList(select1,select2){
				// console.log(select1,select2)
				roomList=[]
				if(select1==0&&select2==0){ //两个都是全部
					roomList=$scope.roomAllList
				}else if(select1==0&&select2==1){ //type全部 查看 已启用
					// console.log($scope.roomAllList)
					for (var obj in $scope.roomAllList ){
					  	var str = JSON.stringify($scope.roomAllList[obj]);
					  	console.log(Str)
					 	var map = eval("("+str+")");
					  	if(map.MeetRoomInfo.is_using==1){
					  		// console.log(map)
					  		roomList.push(map)
					  	}
					}
					// $scope.roomList=roomList
				}else if(select1==0&&select2==-1){ //type全部 查看 已启用
					for (var obj in $scope.roomAllList ){
					  	var str =JSON.stringify($scope.roomAllList[obj]);
					 	var map = eval("("+str+")");
					  	if(map.MeetRoomInfo.is_using!=1){
					  		// console.log(map)
					  		roomList.push(map)
					  	}
					}
					// $scope.roomList=roomList
				}else if(select1==1&&select2==0){ //type在线 查看 全部
					for (var obj in $scope.roomAllList ){
					  	var str = JSON.stringify($scope.roomAllList[obj]);
					 	var map = eval("("+str+")");
					  	if(map.MeetRoomInfo.m_room_id>0){
					  		roomList.push(map)
					  	}
					}
				}else if(select1==-1&&select2==0){ //type在线 查看 全部
					for (var obj in $scope.roomAllList ){
					  	var str = JSON.stringify($scope.roomAllList[obj]);
					 	var map = eval("("+str+")");
					  	if(map.MeetRoomInfo.m_room_id<0){
					  		roomList.push(map)
					  	}
					}
				}else if(select1==-1&&select2==-1){ //type在线 查看 全部
					for (var obj in $scope.roomAllList ){
					  	var str =JSON.stringify($scope.roomAllList[obj]);
					 	var map = eval("("+str+")");
					  	if(map.MeetRoomInfo.m_room_id<0 && map.MeetRoomInfo.is_using!=1){
					  		roomList.push(map)
					  	}
					}

				}
				return roomList
			}

			var bmList=JSON.parse(window.localStorage.getItem("bmList"))
			// console.log(bmList)
			$scope.userInfo=JSON.parse(window.localStorage.getItem("userInfo"))
			// console.log($scope.userInfo)
			$scope.oUrl=oUrl

			var newBmList=[]
			$scope.role=window.localStorage.getItem("role") //系统
			if($scope.role==0){
				for (var obj in bmList ){
				  	// 将json对象转换为字符串
				  	var str = JSON.stringify(bmList[obj]);
				  	// 将json字符串转换为map
				 	var map = eval("("+str+")");

				  	if(map.TownId==-1&&map.VillageId==-1&&map.CountyId==countyId){
					  		// console.log(map)
				  		newBmList.push(map)
				  	}
				}
				
			}else{
				for (var obj in bmList ){
				  	// 将json对象转换为字符串
				  	var str = JSON.stringify(bmList[obj]);
				  	// 将json字符串转换为map
				 	var map = eval("("+str+")");

				  	if(map.TownId==$scope.userInfo.PeopleInfo.TownId&&map.VillageId==$scope.userInfo.PeopleInfo.VillageId&&map.CountyId==$scope.userInfo.PeopleInfo.CountyId){
			  		// console.log(map)
			  			newBmList.push(map)
			  		}
				}
			}
			
			 var forBmList=newBmList
			 // console.log(forBmList)

			for(var i=0;i<forBmList.length;i++){
				$("#bmWrap").append('<option value="'+forBmList[i].DepId+'">'+forBmList[i].DepName+'</option>')
			}

			$scope.getModal=function(type,p){
				if(type=='add'){
					$scope.ajaxType='add'
				}else{
					$scope.ajaxType='edit'
					$scope.ajaxCon=p

					// console.log(p)

					// var a=p.m_room_name
					$("#roomName").val(p.MeetRoomInfo.m_room_name)


				}
				// console.log($scope.ajaxType)
			}

			$scope.saveFn=function(){
				var htime=timest() 
				var i=window.localStorage.getItem("uid")
				var t=window.localStorage.getItem("tToken")
				if($("#roomName").val()!=''){
					if($scope.ajaxType=='add'){ //新增
						 $http({
							method: "post",
							url :oUrl+'/web/v1/meet/room?htime='+htime+'&i='+i+'&t='+t+'&dep='+$("#bmWrap").val()+'&name='+$("#roomName").val(),
							headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			                transformRequest: function (obj) {
			                    var str = [];
			                    for (var o in obj)
			                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
			                    return str.join("&");
			                },
						}).then(function(res){
							 if( res.data.code==200 && res.data.errcode == 200 ){
						        alert('新建会议室成功')
						        location.reload()
					        }else{    
					            alert('新建会议室'+res.data.msg);
						        location.reload()
					        }
						});	
					}else{
						$http({
							method: "put",
							url :oUrl+'/web/v1/meet/room?htime='+htime+'&i='+i+'&t='+t+'&dep='+$("#bmWrap").val()+'&name='+$("#roomName").val()+'&meetroomid='+$scope.ajaxCon.m_room_id+'&isusing='+$("#ztWrap").val(),
							headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			                transformRequest: function (obj) {
			                    var str = [];
			                    for (var o in obj)
			                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
			                    return str.join("&");
			                },
						}).then(function(res){
							 if( res.data.code==200 && res.data.errcode == 200 ){
						        alert('编辑会议室成功')
						        location.reload()
					        }else{    
					            alert('编辑会议室'+res.data.msg);
						        location.reload()
					        }
						});	
					}
				}else{
					alert("请填写会议室名称")
				}
				
			}
			// 获取出席方
			$scope.phoneAllList=getTelList(countyId)

			$("#searchBtn2").click(function(){
				var seaName=$("#searchInput2").val()
				if(seaName!=''){
					var newList=[]
					for (var obj in $scope.phoneAllList ){
					  	var str = JSON.stringify($scope.phoneAllList[obj]);
					 	var map = eval("("+str+")");
					
					  	if(map.HardwareInfo.HName.indexOf(seaName)!=-1){
					  		newList.push(map)
					  	}
					}
					// console.log(newList)

					$scope.phoneAllList=newList
					$scope.$apply();

				}else{
					alert('请输入硬件名称')
				}
			})

			$scope.myModal2=false
			$scope.addAttend=function(id,name){
				// console.log('111')
				$scope.titNAme=name
				$scope.roomId=id

				$scope.phoneAllShowList=getBolList($scope.phoneAllList,id)
				// console.log($scope.phoneAllShowList)


				$("#myModal2").show()

			}

			function getBolList(allList,id){
				var htime =timest() 
			    var i=window.localStorage.getItem("uid")
				var role = window.localStorage.getItem("role")
				var t=window.localStorage.getItem("tToken")

			    $.ajax({
					type: "get",
					url : oUrl+'/web/v1/meet/room/attend?htime='+htime+'&i='+i+'&t='+t+'&meetroomid='+id,
					async : false,
					success : function(res){
						 if( res.code==200 && res.errcode == 200 ){ 
							var sbList=res.data.attend
							// -1 未选 1 已选
							if(sbList==null||sbList==''){
								for(var i=0;i<allList.length;i++){
									allList[i].type='-1'
								}
							}else{
								var a=[]
								for(var i=0;i<allList.length;i++){
									allList[i].type='-1'
									for(var j=0;j<sbList.length;j++){
										if(allList[i].HardwareInfo.HCode==sbList[j]){
											allList[i].type='1'
										}
									}
								}
							}
						
				        }else{    
				            alert(res.msg);  
				        }    
					},
				     error : function(res) {    
				           alert('网络故障');  
				     }  
				})

				return allList

			}
			$scope.addYjBtn=function(hcode){
				var htime=timest() 
				var i=window.localStorage.getItem("uid")
				var t=window.localStorage.getItem("tToken")
				$http({
					method: "post",
					url :oUrl+'/web/v1/meet/room/attend?htime='+htime+'&i='+i+'&t='+t+'&roomid='+$scope.roomId+'&hcode='+hcode,
					headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
				}).then(function(res){
					 if( res.data.code==200 && res.data.errcode == 200 ){
						
						$scope.phoneAllShowList=getBolList($scope.phoneAllList,$scope.roomId)
						// console.log($scope.phoneAllShowList)
						alert("添加出席方成功")
						return false

			        }else{    
			            alert('添加出席方'+res.data.msg);
				        location.reload()
			        }
				});	
			}
			$scope.delYjBtn=function(hcode){
				var htime=timest() 
				var i=window.localStorage.getItem("uid")
				var t=window.localStorage.getItem("tToken")
				$http({
					method: "delete",
					url :oUrl+'/web/v1/meet/room/attend?htime='+htime+'&i='+i+'&t='+t+'&roomid='+$scope.roomId+'&hcode='+hcode,
					headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
				}).then(function(res){
					 if( res.data.code==200 && res.data.errcode == 200 ){
						
						$scope.phoneAllShowList=getBolList($scope.phoneAllList,$scope.roomId)
						// console.log($scope.phoneAllShowList)
						alert("删除出席方成功")
						return false

			        }else{    
			            alert('删除出席方'+res.data.msg);
				        location.reload()
			        }
				});	
			}
			$scope.closeFn=function(){
				$("#myModal2").hide()

				$scope.roomList=getMetRoomList('')

			}
			
		}
	}).when("/lshyck",{//历史会议查看
		templateUrl:"lshyck.html",
		controller: function($scope,$rootScope,$http){
			// console.log(getMetRecordList(-1))

			$scope.roomList=getMetRecordList(-1)
			$scope.allAllroomList=$scope.roomList
			$scope.roomAllList=$scope.roomList

			$scope.townList=JSON.parse(window.localStorage.getItem("countyList")).county.Towns
			$scope.townList.unshift({'TownName':'全部','TownId':-1})
			$scope.townSelect=$scope.townList[0] //给镇加初始值

			$scope.slectTown=function(){
	
				$scope.TownId=$scope.townSelect.TownId

				$scope.roomList=getMetRecordList($scope.TownId)
				$scope.roomAllList=$scope.roomList
				$("#typeWrap option[value='0']").attr('selected','selected')
				// console.log($scope.roomList)
				if($scope.roomList!=''||$scope.roomList!=null){
					getSbList(0)
				}

			}
			$("#typeWrap").change(function(){
				$scope.roomList=getSbList($("#typeWrap").val())
				$scope.$apply();
			})

			$scope.showAll=function(){
				$scope.roomList=getMetRecordList(-1)
				$scope.roomAllList=$scope.roomList

				$scope.townList=JSON.parse(window.localStorage.getItem("countyList")).county.Towns
				$scope.townList.unshift({'TownName':'全部','TownId':-1})
				$scope.townSelect=$scope.townList[0] //给镇加初始值
				
				$("#townWrapId option[value='-1']").attr('selected','selected')
				$("#typeWrap option[value='0']").attr('selected','selected')
				getSbList(0)
			}

			// console.log($scope.roomAllList)
			$("#searchBtn").click(function(){
				var seaName=$("#searchInput").val()
				if(seaName!=''){
					var newList=[]
					for (var obj in $scope.allAllroomList ){
					  	var str = JSON.stringify($scope.allAllroomList[obj]);
					 	var map = eval("("+str+")");
					 	// console.log(map.MeetRoomInfo.m_room_name.indexOf(seaName))
					  	if(map.MeetRoomInfo.m_room_name.indexOf(seaName)!=-1){
					  		newList.push(map)
					  	}
					}
					// console.log(newList)

					$scope.roomList=newList
					$scope.$apply();

				}else{
					alert('请输入会议室名称')
				}
				
			})



			function getSbList(select1){
				// console.log(select1)
				roomList=[]
				if(select1==0){ //两个都是全部
					roomList=$scope.roomAllList
				}else if(select1==1){
					for (var obj in $scope.roomAllList ){
					  	var str = JSON.stringify($scope.roomAllList[obj]);
					 	var map = eval("("+str+")");
					  	if(map.MeetRoomInfo.m_room_id>0){
					  		roomList.push(map)
					  	}
					}
				}else if(select1==-1){ //type在线 查看 全部
					for (var obj in $scope.roomAllList ){
					  	var str = JSON.stringify($scope.roomAllList[obj]);
					 	var map = eval("("+str+")");
					  	if(map.MeetRoomInfo.m_room_id<0){
					  		roomList.push(map)
					  	}
					}
				}
				
				return roomList
			}

			
		}
	}).when("/zbqdsz",{//坐班签到设置
		templateUrl:"zbqdsz.html",
		controller: function($scope,$rootScope,$http){
			
			
		}
	}).when("/zbqdck",{//坐班签到查看
		templateUrl:"zbqdck.html",
		controller: function($scope,$rootScope,$http){
			
			
		}
	}).when("/qdsbgl",{//前端设备管理
		templateUrl:"qdsbgl.html",
		controller: function($scope,$rootScope,$http){
			// 部门列表
			$scope.bmList=JSON.parse(window.localStorage.getItem("bmList"))
			// 设备列表
			$scope.phoneAllList=getTelList(countyId)
			// console.log($scope.phoneAllList)
			$scope.phoneList=$scope.phoneAllList

			$('.select1').change(function(){
			  	$scope.phoneList=getSbList($('.select1').val(),$('.select2').val())
			  	// console.log($scope.phoneList)
			  	$scope.$apply();
			});
			$('.select2').change(function(){
			  	$scope.phoneList=getSbList($('.select1').val(),$('.select2').val())
			  	// console.log($scope.phoneList)
			  	$scope.$apply();
			});

			$scope.searchName=""
			$scope.$watch("searchName",function (value) {
				// console.log(value)

		        // if(value.indexOf("枪")!=-1)

		        // {

		        //   alert("输入内容含有敏感字");

		        //   $scope.name="";

		        // }

		        // else

		        // {

		        //   $scope.search2=$scope.name;

		        // }

		      })

			function getSbList(select1,select2){
				// console.log(select1,select2)
				phoneList=[]
				if(select1==0&&select2==0){ //两个都是全部
					phoneList=$scope.phoneAllList
				}else if(select1==0&&select2==1){ //状态全部 查看 已启用
					for (var obj in $scope.phoneAllList ){
					  	var str = JSON.stringify($scope.phoneAllList[obj]);
					 	var map = eval("("+str+")");
					  	if(map.HardwareInfo.IsUsing==1){
					  		// console.log(map)
					  		phoneList.push(map)
					  	}
					}
					// $scope.phoneList=phoneList
				}else if(select1==0&&select2==-1){ //状态全部 查看 已启用
					for (var obj in $scope.phoneAllList ){
					  	var str = JSON.stringify($scope.phoneAllList[obj]);
					 	var map = eval("("+str+")");
					  	if(map.HardwareInfo.IsUsing!=1){
					  		// console.log(map)
					  		phoneList.push(map)
					  	}
					}
					// $scope.phoneList=phoneList
				}else if(select1==1&&select2==0){ //状态在线 查看 全部
					for (var obj in $scope.phoneAllList ){
					  	var str = JSON.stringify($scope.phoneAllList[obj]);
					 	var map = eval("("+str+")");
					  	if(map.HardwareInfo.StatOnline==1){
					  		phoneList.push(map)
					  	}
					}
					// $scope.phoneList=phoneList
					console.log($scope.phoneList)
				}else if(select1==-1&&select2==0){ //状态在线 查看 全部
					for (var obj in $scope.phoneAllList ){
					  	var str = JSON.stringify($scope.phoneAllList[obj]);
					 	var map = eval("("+str+")");
					  	if(map.HardwareInfo.StatOnline!=1){
					  		phoneList.push(map)
					  	}
					}
					// $scope.phoneList=phoneList
				}else if(select1==-1&&select2==-1){ //状态在线 查看 全部
					for (var obj in $scope.phoneAllList ){
					  	var str = JSON.stringify($scope.phoneAllList[obj]);
					 	var map = eval("("+str+")");
					  	if(map.HardwareInfo.StatOnline!=1 && map.HardwareInfo.IsUsing!=1){
					  		phoneList.push(map)
					  	}
					}
					// $scope.phoneList=phoneList

				}
				
				return phoneList
			}

			

			for(var i=0;i<$scope.bmList.length;i++){
				$("#bmWrap").append('<option value="'+$scope.bmList[i].DepId+'">'+$scope.bmList[i].DepName+'</option>')
			}

			$scope.getModal=function(type,p){
				$("#newAddModal").show()

				if(type=='add'){
					$scope.ajaxType='add'
				}else{
					$scope.ajaxType='edit'
					$scope.editCon=p
					$("#adress").val(p.HardwareInfo.HCode)
					$("#yjName").val(p.HardwareInfo.HName)

					$("#bmWrap option[value='"+p.HardwareInfo.DepId+"']").attr("selected", true);

				}
				// console.log($scope.ajaxType)
			}

			$scope.closeModal=function(){
				$("#newAddModal").hide()

			}

			$scope.save=function(){
				var htime=timest() 
				var i=window.localStorage.getItem("uid")
				var t=window.localStorage.getItem("tToken")

				if($("#adress").val()!=''&&$("#yjName").val()!=''){
					if($scope.ajaxType=='add'){
						 $http({
							method: "post",
							url :oUrl+'/web/v1/hardware?htime='+htime+'&i='+i+'&t='+t+'&hcode='+$("#adress").val()+'&name='+$("#yjName").val()+'&dep='+$("#bmWrap").val(),
							headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			                transformRequest: function (obj) {
			                    var str = [];
			                    for (var o in obj)
			                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
			                    return str.join("&");
			                },
						}).then(function(res){
							 if( res.data.code==200 && res.data.errcode == 200 ){
						        alert('新建设备成功')
						        location.reload()
					        }else{    
					            alert('新建设备'+res.data.msg);
						        location.reload()
					        }
						});	
					}else{

						 $http({
							method: "put",
							url :oUrl+'/web/v1/hardware?htime='+htime+'&i='+i+'&t='+t+'&hcode='+$("#adress").val()+'&name='+$("#yjName").val()+'&dep='+$("#bmWrap").val()+'&isusing='+$("#ztWrap").val(),
							headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			                transformRequest: function (obj) {
			                    var str = [];
			                    for (var o in obj)
			                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
			                    return str.join("&");
			                },
						}).then(function(res){
							 if( res.data.code==200 && res.data.errcode == 200 ){
						        alert('编辑设备成功')
						        location.reload()
					        }else{    
					            alert('编辑设备'+res.data.msg);
						        // location.reload()
					        }
						});	
					}
				}else{
					if($("#adress").val()==''){
						alert("请填写硬件地址")
						return false
					}else if($("#yjName").val()==''){
						alert("请填写硬件名称")
						return false
					}
				}
			}


		}
	}).when("/gl",{//管理
		templateUrl:"gl.html",
		controller: function($scope,$rootScope,$http){
			$scope.role=window.localStorage.getItem("role") //系统管理员0
			// 获取县信息
			$scope.countyList=JSON.parse(window.localStorage.getItem("countyList"))
			// console.log($scope.countyList.county)
			$scope.townList=JSON.parse(window.localStorage.getItem("countyList")).county.Towns
			$scope.townList.unshift({'TownName':'全部','TownId':-1})
			$scope.townSelect=$scope.townList[0] //给镇加初始值
			// console.log($scope.townList)

			// 获取村资料类型
			var htime=timest() 
			var i=window.localStorage.getItem("uid")
			var t=window.localStorage.getItem("tToken")

		  	$http({
				method: "get",
				url :oUrl+'/web/v1/msg/type?htime='+htime+'&i='+i+'&t='+t,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var o in obj)
                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
                    return str.join("&");
                },
			}).then(function(res){
				 if( res.data.code==200 && res.data.errcode == 200 ){
					// console.log('token',res.data.data.token)
					// console.log(res.data.data)  
				    // window.localStorage.setItem("tToken",res.data.data.token);

					$scope.zlTypeList=res.data.data.type
					$scope.ajaxzlTypeList=$scope.zlTypeList
					for(var i=0;i<$scope.ajaxzlTypeList.length;i++){
						$("#mesTypeWrap").append('<option value="'+$scope.ajaxzlTypeList[i].MsgTypeId+'" class="county">'+$scope.ajaxzlTypeList[i].MsgTypeName+'</option>')
					}
					
					$scope.zlTypeList.unshift({'MsgTypeName':'全部','MsgTypeId':-1})

					$scope.typeSelect = $scope.zlTypeList[0]
					$scope.typeId=$scope.typeSelect.MsgTypeId

					$scope.TownId=-1
					$scope.villId=-1

					
		        }else{    
		            alert('获取镇资料类型'+res.data.msg);
		        }
			}).then(function(){
				$scope.zlShowList=getMesList($scope.TownId,$scope.villId,$scope.typeId)
				// console.log($scope.zlShowList)
				$scope.villList=[{'VillageName':'全部','VillageId':-1}]
				$scope.villSelect=$scope.villList[0]
					// 获取选中镇id
				$scope.slectTown=function(){

					// console.log($scope.townSelect.Villages)
					$scope.TownId=$scope.townSelect.TownId
					$scope.showBol=true

					if($scope.townSelect.Villages==null||$scope.townSelect.Villages==undefined){
						$scope.villList=[{'VillageName':'全部','VillageId':-1}]
						$scope.villSelect=$scope.villList[0]
					}else{
						$scope.villList=$scope.townSelect.Villages
						$scope.villList.unshift({'VillageName':'全部','VillageId':-1})
						$scope.villSelect=$scope.villList[0]

					}

				
					$scope.zlShowList=getMesList($scope.TownId,$scope.villId,$scope.typeId)
					// getZLList(countyId,$scope.typeId,$scope.dwId,$scope.TownId,-1).docs
					
				}
				// 获取选中村id
				$scope.slectVillage=function(){
					// console.log($scope.villList)
					// console.log($scope.villSelect)
					if($scope.villSelect!=null){
						$scope.villId=$scope.villSelect.VillageId

						$scope.zlShowList=getMesList($scope.TownId,$scope.villId,$scope.typeId)
						// getZLList(countyId,$scope.typeId,$scope.dwId,$scope.TownId,$scope.villId).docs
					}
					
				}
				$scope.slectzlType=function(){
					// console.log($scope.typeSelect)
					$scope.typeId=$scope.typeSelect.MsgTypeId

					$scope.zlShowList=getMesList($scope.TownId,$scope.villId,$scope.typeId)
				}

			});
			$scope.closeModal=function(){
				$("#newAddModal").hide()
				$("#mesTit").val('')
				$("#mesCon").val('')
			}

			$scope.newAddPeopleBtn=function(type,p){
				$("#newAddModal").show()
				if (type=='add') {
					$scope.ajaxType='add'
					$scope.showTit='新建信息与通知'
				}else{
					$scope.ajaxType='edit'
					$scope.showTit='编辑信息与通知'
					$scope.editWrap=p
					$("#mesTit").val($scope.editWrap.MsgInfo.MsgTitle)
					$("#mesCon").val($scope.editWrap.MsgInfo.MsgContent)
					$("#ztWrap option[value='"+$scope.editWrap.MsgInfo.IsUsing+"']").attr('selected','selected')
				}
			}


	        $(".save").click(function(){
					var htime =timest() 
		            var i=window.localStorage.getItem("uid")
					var role = window.localStorage.getItem("role")
		            var t=window.localStorage.getItem("tToken")

		            // console.log($("#mesTypeWrap").val());

		            if($("#mesTit").val()!=''&&$("#mexCon").val()!=''){

			            if($scope.ajaxType=='add'){

							var options = {
					      		type:'POST',
					      		dataType:'json',  
				                url: oUrl+'/web/v1/msg?htime='+htime+'&i='+i+'&t='+t+'&type='+$("#mesTypeWrap").val(),
				              
				                success: function (res) {
				                 	 if( res.code==200 && res.errcode == 200 ){
						
										// console.log('token',res.data.token)  

									    // window.localStorage.setItem("tToken",res.data.token);

							            alert('新建信息与通知成功');
										location.reload()

							        }else{    
							            alert('新建信息与通知'+res.msg);
										location.reload()
							        }
             
			                    },

			                };
			                $("#from1").ajaxForm(options);
			            }else{

			     //        	if($('#mesTypeWrap').val()==-1){
			     //        		$scope.ttId=$scope.zlTypeList[1].MsgTypeId
			     //        	}else{
								// $scope.ttId=$('#ztWrap').val()
			     //        	}
							var options = {
					      		type:'put',
					      		dataType:'json',  
				                url: oUrl+'/web/v1/msg?htime='+htime+'&i='+i+'&t='+t+'&type='+$('#mesTypeWrap').val()+'&msgid='+$scope.editWrap.MsgInfo.MsgId+'&isusing='+$('#ztWrap').val(),
				              
				                success: function (res) {
				                 	 if( res.code==200 && res.errcode == 200 ){
						
										// console.log('token',res.data.token)  

									    // window.localStorage.setItem("tToken",res.data.token);

							            alert('编辑信息与通知成功');
										location.reload()

							        }else{    
							            alert('编辑信息与通知'+res.msg);
										location.reload()
							        }
             
			                    },

			                };
			                $("#from1").ajaxForm(options);
			            }
			        }else{
			        	if($("#mesTit").val()==''){
			        		alert("请填写标题")
			        		return false;
			        	}else if($("#mexCon").val()==''){
			        		alert("请填写内容")
			        		return false;

			        	}
			        }

			      	

		 	})



			
		}
	}).when("/dspdgl",{//电视频道管理
		templateUrl:"dspdgl.html",
		controller: function($scope,$rootScope,$http){
			$scope.role=window.localStorage.getItem("role") //系统管理员0

			// console.log(countyId)
			var htime=timest() 
			var i=window.localStorage.getItem("uid")
			var t=window.localStorage.getItem("tToken")

			 $http({
				method: "get",
				url :oUrl+'/web/v1/tv?htime='+htime+'&i='+i+'&t='+t+'&county='+countyId,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var o in obj)
                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
                    return str.join("&");
                },
			}).then(function(res){
				// console.log(res)
				 if( res.data.code==200 && res.data.errcode == 200 ){
	
					// console.log('token',res.data.data.token)  

				    // window.localStorage.setItem("tToken",res.data.data.token);

				    $scope.tvList=res.data.data.tvs
			        

		        }else{    
		            alert('修改镇信息'+res.data.msg);
		        }
			});


			$(".addtvBtn").click(function(){
				var tvName=$(".tvName").val()
				var tvUrl=$(".tvUrl").val()

				if(tvName==''||tvUrl==''){
					if(tvName==''){
						alert("请输入频道名称")
					}else{
						alert("请输入频道地址")
					}
				}else{
					var htime=timest() 
					var i=window.localStorage.getItem("uid")
					var t=window.localStorage.getItem("tToken")

					var options = {
			      		type:'POST',
			      		dataType:'json',  
		                url:oUrl+'/web/v1/tv?htime='+htime+'&i='+i+'&t='+t+'&county='+countyId+'&name='+tvName,
		              
		                success: function (res) {
		                 	 if( res.code==200 && res.errcode == 200 ){
				
								// console.log('token',res.data.token)  

							    // window.localStorage.setItem("tToken",res.data.token);

					            alert('新建电视频道成功');
								location.reload()

					        }else{    
					            alert('新建电视频道'+res.msg);
					        }
     
	                    },

	                };
	                $("#form1").ajaxForm(options);

				 // var form = $('<form></form>');    // 设置属性   
				 // form.attr('target', '_self')
				 // form.attr('action', oUrl+'/web/v1/tv?htime='+htime+'&i='+i+'&t='+t+'&county='+countyId+'&name='+tvName);   
				 //  form.attr('method', 'post');    // form的target属性决定form在哪个页面提交    // _self -> 当前页面 _blank -> 新页面   
				 //   form.attr('target', '_self');    // 创建Input    
				 //   var my_input = $('<input type="text" name="address" value="'+tvUrl+'"/>');   
				 //   // my_input.attr('address',tvUrl);    // 附加到Form  
				 //     form.append(my_input);    // 提交表单    
				 //      $(document.body).append(form);
				 //     form.submit();    // 注意
				 //     return false //取消链接的默认动作


				}
			})

			$scope.editTv=function(p){
				// console.log(p)
				$scope.docid=p.DocId
				$(".tvName2").val(p.DocTitle)
				$(".tvUrl2").val(p.DocData)
			}

			$(".edittvBtn").click(function(){
				var tvName=$(".tvName2").val()
				var tvUrl=$(".tvUr2l").val()

				if(tvName==''||tvUrl==''){
					if(tvName==''){
						alert("请输入频道名称")
					}else{
						alert("请输入频道地址")
					}
				}else{
					var htime=timest() 
					var i=window.localStorage.getItem("uid")
					var t=window.localStorage.getItem("tToken")

					var options = {
			      		type:'put',
			      		dataType:'json',  
		                url:oUrl+'/web/v1/tv?htime='+htime+'&i='+i+'&t='+t+'&county='+countyId+'&name='+tvName+'&docid='+$scope.docid,        
		                success: function (res) {
		                 	 if( res.code==200 && res.errcode == 200 ){			
								// console.log('token',res.data.token)  
							    // window.localStorage.setItem("tToken",res.data.token);

					            alert('编辑电视频道成功');
								location.reload()

					        }else{    
					            alert('编辑电视频道'+res.msg);
					        }
     
	                    },

	                };
	                $("#form2").ajaxForm(options);

				}
			})
			
			$scope.delTv=function(id){
				var htime=timest() 
				var i=window.localStorage.getItem("uid")
				var t=window.localStorage.getItem("tToken")

				 $http({
					method: "delete",
					url :oUrl+'/web/v1/tv?htime='+htime+'&i='+i+'&t='+t+'&docid='+id,
					headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
				}).then(function(res){
					// console.log(res)
					 if( res.data.code==200 && res.data.errcode == 200 ){
		
						alert('删除成功')
						location.reload()
				        

			        }else{    
			            alert('删除'+res.data.msg);
			        }
				});

			}
			
		}
	}).when("/spdbgl",{//视频点播管理
		templateUrl:"spdbgl.html",
		controller: function($scope,$rootScope,$http,$sce){
			var allType=getAllTypeList(countyId)
			// console.log(allType)
			$scope.videoType=allType.video
			$scope.videoSelect=$scope.videoType[0]
			// console.log($scope.videoSelect)
			$scope.typeid=$scope.videoSelect.DocTypeId
			getList($scope.typeid)
			// $scope.ajaxUrl=oUrl+'/'

			$scope.slectVideo=function(){
				// console.log($scope.videoSelect)
				
				$scope.typeid=$scope.videoSelect.DocTypeId

				getList($scope.typeid)
			
			}

			 $scope.videoUrlFun = function(url){
				        //$sce.trustAsResourceUrl方法把普通路径处理加工成一个angular环境可识别，并认为是安全的路径来使用
				        var urlFun = $sce.trustAsResourceUrl(url);
				        return urlFun;
				    };

			$scope.showVideoModal=function(url){
				// console.log(url)
				if(url==''){
					$scope.showVideoBol=true
				}else{
					$scope.showVideoBol=false

					$scope.videoYlurl=oUrl+'/'+url
					// console.log($scope.videoYlurl)
				}
				
			}

			function getList(id){
				var htime=timest() 
				var i=window.localStorage.getItem("uid")
				var t=window.localStorage.getItem("tToken")
					$http({
					method: "get",
					url :oUrl+'/web/v1/video?htime='+htime+'&i='+i+'&t='+t+'&county='+countyId+'&type='+id,
					headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
				}).then(function(res){
					// console.log(res)
					 if( res.data.code==200 && res.data.errcode == 200 ){
		
						// console.log('token',res.data.data)  

					    // window.localStorage.setItem("tToken",res.data.data.token);

					    $scope.videoList=res.data.data.videos
				        

			        }else{    
			            alert('修改镇信息'+res.data.msg);
			        }
				});

			}

			$scope.closeModal=function(){
				$("#newAddModal").hide()	

			}

			$scope.addVideo=function(type,p){
				$('#newAddModal').show()

				
				if(type=='add'){
					$scope.showText='新建'
					$scope.ajaxType='add'

					$("#text").html('')
					$("input[name='name']").val('')
					$("input[name='videourl']").val('')
					$("input[name='pic']").val('')
					$("#videoName").html('')


					
				}else{
					$scope.showText='编辑'
					// console.log(p)
					$("#videoName").html('视频1')
					$scope.ajaxType='edit'

					$scope.docid=p.DocId

					$("#text").html('img')
					$("input[name='name']").val(p.DocTitle)
					$("input[name='videourl']").val(p.DocData)
					$("input[name='pic']").val(p.DocPicData)


				}

			}

			$("#image").change(function (e) {
					$("#text").html($("#image").val());
					var _name, _fileName, personsFile;
				    personsFile = document.getElementById("image");
				    _name = personsFile.value;
				    _fileName = _name.substring(_name.lastIndexOf(".") + 1).toLowerCase();
				    if (_fileName !== "png" && _fileName !== "jpg" && _fileName !== "jpeg") {
				        alert("上传图片格式不正确，请重新上传");
				    }

					var  uploadFile = e.target.files[0];
				    var  reader = new FileReader();
				    reader.readAsDataURL(uploadFile);
				    reader.onloadend = function() {
				       var  base64 = reader.result; // base64就是图片的转换的结果 
				       // console.log(base64)
				       $("#image1").val(base64)
				    };	

			});	


			var xhr;//异步请求对象
		    var ot; //时间
		    var oloaded;//大小
		    //上传文件方法
		    $('#file').change(function (e) {
		        var fileObj = document.getElementById("file").files[0]; // js 获取文件对象
		        if(fileObj.name){
		            $(".el-upload-list").css("display","block");
		            $(".el-upload-list li").css("border","1px solid #20a0ff");
		            $("#videoName").text(fileObj.name);
		        }else{
		            alert("请选择文件");
		        }
		    })
		    /*点击取消*/
		    function del(){
		        $("#file").val('');
		        $(".el-upload-list").css("display","none");
		    }
		    /*点击提交 视频*/
		    $('.shangchuan').click(function(){
		        var fileObj = document.getElementById("file").files[0]; // js 获取文件对象
		        if(fileObj==undefined||fileObj==""){
		            alert("请选择文件");
		            return false;
		        };

		      //  var docid=1380465284349952
		      //  var url = oUrl+'/web/v1/video/main?htime='+htime+'&i='+i+'&t='+t+'&docid='+docid; // 接收上传文件的后台地址 

		        var url = oUrl+'/web/v1/upload/video'

		        var form = new FormData(); // FormData 对象
		        form.append("video", fileObj); // 文件对象 
		        // form.append("title", title); // 标题
		        xhr = new XMLHttpRequest(); // XMLHttpRequest 对象
		        xhr.open("post", url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
		        xhr.onload = uploadComplete; //请求完成
		        xhr.onerror = uploadFailed; //请求失败
		        xhr.upload.onprogress = progressFunction; //【上传进度调用方法实现】
		        xhr.upload.onloadstart = function() { //上传开始执行方法
		            ot = new Date().getTime(); //设置上传开始时间
		            oloaded = 0; //设置上传开始时，以上传的文件大小为0
		        };
		        xhr.send(form); //开始上传，发送form数据
		    })
		    
		    //上传进度实现方法，上传过程中会频繁调用该方法
		    function progressFunction(evt) { 
		        // event.total是需要传输的总字节，event.loaded是已经传输的字节。如果event.lengthComputable不为真，则event.total等于0
		        if(evt.lengthComputable) {
		            $(".el-progress--line").css("display","inline-block");
		            /*进度条显示进度*/
		            $(".el-progress-bar__inner").css("width", Math.round(evt.loaded / evt.total * 100) + "%");
		            $(".el-progress__text").html(Math.round(evt.loaded / evt.total * 100)+"%");   
		        }

		        var time = document.getElementById("time");
		        var nt = new Date().getTime(); //获取当前时间
		        var pertime = (nt - ot) / 1000; //计算出上次调用该方法时到现在的时间差，单位为s
		        ot = new Date().getTime(); //重新赋值时间，用于下次计算

		        var perload = evt.loaded - oloaded; //计算该分段上传的文件大小，单位b 
		        oloaded = evt.loaded; //重新赋值已上传文件大小，用以下次计算

		        //上传速度计算
		        var speed = perload / pertime; //单位b/s
		        var bspeed = speed;
		        var units = 'b/s'; //单位名称
		        if(speed / 1024 > 1) {
		            speed = speed / 1024;
		            units = 'k/s';
		        }
		        if(speed / 1024 > 1) {
		            speed = speed / 1024;
		            units = 'M/s';
		        }
		        speed = speed.toFixed(1);
		        //剩余时间
		        var resttime = ((evt.total - evt.loaded) / bspeed).toFixed(1);
		        // time.innerHTML = '上传速度：' + speed + units + ',剩余时间：' + resttime + 's';
		        time.innerHTML ='预计剩余时间：' + resttime + 's';

		        if(bspeed == 0)
		            time.innerHTML = '上传已取消';
		    }
		    //上传成功响应
		    function uploadComplete(evt) {
		        //服务断接收完文件返回的结果  注意返回的字符串要去掉双引号
		        if(evt.target.responseText){

		        	// console.log(evt.currentTarget.response)

		        	var res= JSON.parse(evt.currentTarget.response)
		        	// console.log(res)

	        		if( res.code==200 && res.errcode == 200 ){
						// console.log(res.data)

						$('#video').val(res.data.video_save_url)


			        }else{    
			            alert('编辑视频'+res.data.msg);
			        }
		            
		            // alert("上传成功！");
		           
		        }else{
		            alert("上传失败");
		        }
		    }

		    //上传失败
		    function uploadFailed(evt) {
		        alert("上传失败！");
		    }

		    $(".addVideoBtn").click(function(){
		    	console.log($scope.showText)
		      	var videoUrlText=$("#video").val()
		      	var imgUrlText=$("#image1").val()
		      	var videoName=$("#videoName222").val()

		      	if(videoUrlText!=''&&imgUrlText!=''&&videoName!=''){

					var htime =timest() 
		            var i=window.localStorage.getItem("uid")
					var role = window.localStorage.getItem("role")
		            var t=window.localStorage.getItem("tToken")

		            if($scope.ajaxType=='add'){
				    	var options = {
				      		type:'POST',
				      		dataType:'json',  
			                url: oUrl+'/web/v1/video?htime='+htime+'&i='+i+'&t='+t+'&county='+countyId+'&type='+$scope.typeid,
			              
			                success: function (res) {
			                 	 if( res.code==200 && res.errcode == 200 ){
									// console.log('token',res.data.token)  
								    // window.localStorage.setItem("tToken",res.data.token);
							    	alert('新建视频点播成功');
									location.reload()
						        }else{    
							    	alert('新建视频点播'+res.msg);
									location.reload()
						        }
         
		                    },

		                };
		                $("#videoForm").ajaxForm(options);

				    }else{
				    	var options = {
				      		type:'put',
				      		dataType:'json',  
			                url: oUrl+'/web/v1/video?htime='+htime+'&i='+i+'&t='+t+'&county='+countyId+'&type='+$scope.typeid+'&docid='+$scope.docid,
			                success: function (res) {
			                 	 if( res.code==200 && res.errcode == 200 ){
									// console.log('token',res.data.token)  
								    // window.localStorage.setItem("tToken",res.data.token);
							    	alert('编辑视频点播成功');
									location.reload()
						        }else{    
							    	alert('编辑视频点播'+res.msg);
									location.reload()
						        }
         
		                    },

		                };
		                $("#videoForm").ajaxForm(options);
				    }

			      	
	            }else{

	            	if(videoUrlText==''){
	            		alert('请上传视频')
	            		return false
	            	}else if(imgUrlText==''){
						alert('请选择封面图片')
	            		return false

	            	}else if(videoName==''){
	            		alert('请填写名称')
	            		return false

	            	}
	            }

		 	})

		 	$scope.delVideo=function(p){
		 		var docid=p.DocId
		 		// console.log(docid)

	 			var htime=timest() 
				var i=window.localStorage.getItem("uid")
				var t=window.localStorage.getItem("tToken")

		 		 $http({
					method: "delete",
					url :oUrl+'/web/v1/video?htime='+htime+'&i='+i+'&t='+t+'&docid='+docid,
					headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
				}).then(function(res){
					// console.log(res)
					 if( res.data.code==200 && res.data.errcode == 200 ){
		
						alert('删除视频点播成功')
						location.reload()

			        }else{    
			            alert('删除视频点播'+res.data.msg);
			        }
				});
		 	}
		}
	}).when("/setPsd",{//修改密码
		templateUrl:"setPsd.html",
		controller: function($scope,$rootScope,$http){
			$scope.userInfo=JSON.parse(window.localStorage.getItem("userInfo"))
			// console.log($scope.userInfo)


	        $(".save").click(function(){
					var htime =timest() 
		            var i=window.localStorage.getItem("uid")
					var role = window.localStorage.getItem("role")
		            var t=window.localStorage.getItem("tToken")

		      	var options = {
		      		type:'POST',
		      		dataType:'json',  
	                url: oUrl+'/web/v1/user/changepw?htime='+htime+'&i='+i+'&t='+t,
	              
	                success: function (res) {
	                 	 if( res.code==200 && res.errcode == 200 ){
			
							// console.log('token',res.data.token)  

						    window.localStorage.setItem("tToken",res.data.token);

				            alert('修改密码成功');

				        }else{    
				            alert('修改镇信息'+res.msg);
				        }
 
                    },

                };
                $("#form1").ajaxForm(options);

		 	})


			
		}
	})

})