var shop=angular.module("shop",["ngRoute"]);

shop.directive("navBar",function(){
	return {
		templateUrl:"page/left.html",
		controller: function($scope,$rootScope,$http){
			// $rootScope.footH=$("footer").height()
		}
	};
});
shop.directive("navTop",function(){
	return {
		templateUrl:"page/top.html",
		controller: function($scope,$rootScope,$http){
			// $rootScope.footH=$("footer").height()
		console.log(JSON.parse(window.localStorage.getItem("userInfo")))
			$scope.userInfo=JSON.parse(window.localStorage.getItem("userInfo"))

			$scope.signOut=function(){
				location.href='signIndex.html#/'
				window.localStorage.setItem("userInfo",'')
			}

		}
	};
});

shop.controller("pCtrl",function($scope,$routeParams,$location,$http){

	var arr = $location.$$path.split("/");
	var str = arr.filter(function(v){return !!v;})[0];
	var newArr = arr.filter(function(v){return !!v;});
	var _scope = $scope;

	$scope.setNavFocus = function(leftNav){
		$scope.leftNav=''
		$scope.leftNav = leftNav || '';
	};
	$scope.setNavFocus(str);

	$scope.handclk = function(sClass){
		$scope.setNavFocus(sClass);
		// console.log(sClass)
	}.bind($scope);

	if(window.localStorage.getItem("userInfo")==null||window.localStorage.getItem("userInfo")==''||window.localStorage.getItem("userInfo")==undefined){
		location.href='signIndex.html#/'
	}

	$scope.leftInfoPt=JSON.parse(window.localStorage.getItem("leftInfoPt"))
})
////////// layui date 
	shop.directive('defLaydate', function() {
	　　 return {
	　　　　require: '?ngModel',
	　　　　restrict: 'A',
	　　　　scope: {
	　　　　　　ngModel: '=',　　
	　　　　},
	　　　　link: function(scope, element, attr, ngModel) {
				console.log(attr)
	　　　　　　var _date = null,_config={};
	　　　　　　// 初始化参数（具体参数可以查看API:http://www.layui.com/doc/modules/laydate.html）
	　　　　　　_config = {
	　　　　　　　　lang: 'cn',
	　　　　　　　　elem: element[0],
	　　　　　　　　btns:['confirm'],
	　　　　　　　　format: !!attr.format ? attr.format : 'yyyy-MM-dd',
	　　　　　　　　range: attr.range,
	　　　　　　　　done: function(value, date, endDate) {
	　　　　　　　　　　ngModel.$setViewValue(value);
	　　　　　　　　}
	　　　　　　};
	　　　　　　!!attr.typeDate && (_config.type = attr.typeDate);

	　　　　　　// 初始化
	　　　　　　 _date = laydate.render(_config);
	　　　　　　// 模型值同步到视图上
	　　　　　　ngModel.$render = function() {
	　　　　　　　　element.val(ngModel.$viewValue || '');
	　　　　　　};
	　　　　}
	　　 }
	})


shop.directive('line', function() {
	return {
		scope: {
			id: "@",
			legend: "=",
			item: "=",
			data: "="
		},
		restrict: 'E',
		template: '<div style="height:400px;winth:90%;"></div>',
		replace: true,
		link: function($scope, element, attrs, controller) {
			console.log($scope, element, attrs, controller)
			var option = {
				// 提示框，鼠标悬浮交互时的信息提示
				tooltip: {
					show: true,
					trigger: 'item'
				},
				// 图例
				legend: {
					data: $scope.legend
				},
				// 横轴坐标轴
				xAxis: [{
					type: 'category',
					data: $scope.item
				}],
				// 纵轴坐标轴
				yAxis: [{
					type: 'value'
				}],
				// 数据内容数组
				series: function(){
					var serie=[];
					for(var i=0;i<1;i++){
						var item = {
							name : $scope.legend[i],
							type: 'line',
							data: $scope.data[i]
						};
						serie.push(item);
					}
					return serie;
				}()
			};
			var myChart = echarts.init(document.getElementById($scope.id),'macarons');
			myChart.setOption(option);
		}
	};
});

////////////////
shop.config(function($routeProvider){
	$routeProvider.when("/overView",{
		templateUrl:"page/overView.html",
		controller: function($scope,$rootScope,$http){
			$rootScope.showLeft='show'
			if(window.localStorage.getItem("userInfo")==''||window.localStorage.getItem("userInfo")==undefined){
				location.href='#/'
			}
			// $scope.carList=JSON.parse(window.localStorage.getItem("leftInfo"))

			console.log($scope.showLeft)

			$("#iWrap").html('<iframe id="mainIframe" style="width: 100%;height:500px" name="mainIframe" src="page/map.html" frameborder="0" scrolling="auto" ></iframe>')

			$scope.showLoad=true
			$.ajax({
				type: "get",
				url : oUrl+'plat/overview',
				async : false,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					// 'access-token':window.localStorage.getItem("token")
					'Authorization':'Bearer '+window.localStorage.getItem("token")
				},
				success : function(res){
					console.log(res)
					$scope.showLoad=false


					if( res.status_code==200){
						$scope.con=res.data
						$scope.map=res.data.trade_shop_map //地图
						$scope.user=res.data.new_custom_user //新增用户趋势
						$scope.shop=res.data.new_trade_shop //新增用户趋势

						$scope.legend = ["商户"];
						$scope.item=[]
						var data1=[]
						for(var i=0;i<$scope.shop.length;i++){
							$scope.item.push($scope.shop[i].days)
							data1.push($scope.shop[i].cnt)
						}
						$scope.data=[]
						$scope.data.push(data1)

						$scope.legend2 = ["用户"];
						$scope.item2=[]
						var data2=[]
						for(var i=0;i<$scope.user.length;i++){
							$scope.item2.push($scope.user[i].days)
							data2.push($scope.user[i].cnt)
						}
						$scope.data2=[]
						$scope.data2.push(data2)
						
					}
				
				},error:function(res){
					if(res.responseJSON.status_code==422){
						alert(res.responseJSON.errors[0].error)
					}else{
						alert(res.responseJSON.errors)
					};
				}
			})



		}
			
	}).when("/staff",{ // 员工管理
		templateUrl:"page/staff.html",
		controller: function($scope,$rootScope,$http){
			$rootScope.showLeft='show'
			$scope.showLoad=true
		    $scope.addQxName=''
		    if(window.localStorage.getItem("userInfo")==''||window.localStorage.getItem("userInfo")==undefined){
				location.href='#/'
			}
			console.log($scope.showLeft)
			$scope.modalShow=false // 新建编辑
			$scope.delmodalShow=false //删除
			$scope.qxmodalShow=false //权限
			// 初始页面
			$scope.total_pages =1;
			$scope.group_pages=1
			$scope.log_pages=1
			groupToPages()
			userGroupPages()
			logPages()

			//  用户modal
			$scope.peopleBtn=function(type,p){
				console.log(type)
				$scope.peopleType=type
				$scope.modalShow=true
				grop()

				if(type=='add'){
					$scope.addUserName=''
					$scope.addUserZh=''
					$scope.addUserTel=''
				}else{
					$scope.addUserName=p.realname
					$scope.addUserZh=p.username
					$scope.addUserTel=p.mobile
					$scope.uuId=p.id

					$("#groupAddUser option[value='"+p.group_id+"']").attr('selected','selected')

					// $("#ztWrap option[value='"+ v +"']").attr('selected','selected')

				}
				console.log($scope.modalShow)
			}
			
			//召唤 权限modal 
			$scope.quanxianBtn=function(type,p){
		    	$scope.addQxName=''
				$scope.quanxianType=type

		       	$scope.editUserGroup={
					OVERVIEW_SYS:false,
					EMPLOYEE_SYS:false,
					AD_CHECK:false,
					BUSINESS_SYS:false,
					WITHDRAW_SYS:false,
					PUSH_SYS:false,
					USER_CLIENT_SYS:false,
					TRADE_SYS:false,
					INFORMATION_SYS:false,
					AD_SYS:false,
					SUGGEST_SYS:false
				}

		    	if(type=='add'){
		    		$scope.ajaxMethod='post'
					$scope.qxmodalShow=true

		    	}else{
		    		$scope.ajaxMethod='PATCH'
		    		$scope.editUserGroup=p.power_info
		    		$scope.addQxName=p.group_name
		    		if(p.id==1){
						$scope.qxmodalShow=false
						alert("超级管理员用户组不可编辑")
		    		}else{
						$scope.qxmodalShow=true
		    		}
					$scope.quanxianId=p.id

		    	}

		    	

				console.log(type)
			}
			$scope.delBtn=function(p){
				$scope.delmodalShow=true
				$scope.sureDel=function(){

		            $http({
						method:'DELETE',
						url :oUrl+'plat/employee',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':'Bearer '+window.localStorage.getItem("token")
						},
		                transformRequest: function (obj) {
		                    var str = [];
		                    for (var o in obj)
		                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
		                    return str.join("&");
		                },
		                data:{
		                	id:p.id
		                },
					}).success(function(res){
						console.log(res)
						if( res.status_code==200){
							$scope.delmodalShow=false

							groupToPages()
							alert("删除用户成功")
						}
					}).error(function(res){
						if(res.status_code==422){
							alert(res.errors[0].error)
						}else{
							alert(res.errors)
						}
					});
				}
			}
			$scope.closeBtn=function(){
				$scope.modalShow=false
				console.log($scope.modalShow)
			}
			$scope.closeBtnAlert=function(){
				$scope.delmodalShow=false
			}
			$scope.closeqxBtn=function(){
				$scope.qxmodalShow=false
			}


			
			
			$scope.range = function (start, end) {
		        var ret = [];
		        if (!end) {
		            end = start;
		            start = 0;
		        }
		        for (var i = start; i < end; i++) {
		            ret.push(i);
		        }
		        return ret;
		    };

		    $scope.prevPage = function () {
		        if ($scope.total_pages > 1) {
		            $scope.total_pages--;
					groupToPages()
		        }
		    };
		    
		    $scope.nextPage = function () {
		        if ($scope.total_pages < $scope.userCount.total_pages) {
		            $scope.total_pages++;
					groupToPages()
		        }
		    };
		    
		    $scope.setPage = function (page) {
		    	console.log(page)
		        $scope.total_pages = page;
				groupToPages()
		    };
		    // 用户组
		     $scope.prevPageGroup = function () {
		        if ($scope.group_pages > 1) {
		            $scope.group_pages--;
					userGroupPages()
		        }
		    };
		    
		    $scope.nextPageGroup = function () {
		        if ($scope.group_pages < $scope.groupCount.total_pages) {
		            $scope.group_pages++;
					userGroupPages()

		    		console.log($scope.group_pages)

		        }
		    };
		    
		    $scope.setPageGroup = function (page) {
		    	console.log(page)
		        $scope.group_pages = page;
				userGroupPages()
		    };
		     // 操作日志
		     $scope.prevPagelog = function () {
		        if ($scope.log_pages > 1) {
		            $scope.log_pages--;
					logPages()
		        }
		    };
		    
		    $scope.nextPagelog = function () {
		        if ($scope.log_pages < $scope.logCount.total_pages) {
		            $scope.log_pages++;
					logPages()

		    		console.log($scope.log_pages)

		        }
		    };
		    
		    $scope.setPagelog = function (page) {
		    	console.log(page)
		        $scope.log_pages = page;
				logPages()
		    };
		    $scope.addUserZh=''
		    $scope.addUserName=''
		    $scope.addUserPas=''
		    $scope.addUserTel=''
		    // 新增用户
		    $scope.userAddBtn=function(){
		    	//$("#groupAddUser")
		    	if($scope.addUserName==''||$scope.addUserZh==''|| $scope.addUserTel==''||$scope.addUserZh.length<6){
		    		if($scope.addUserZh==''){
		    			alert('员工账号不能为空')
		    		}else if($scope.addUserZh.length<6){
		    			alert('员工账号不能小于6个字符')
		    		}else if($scope.addUserName==''){
		    			alert('员工姓名不能为空')
		    		}else if($scope.addUserTel==''){
		    			alert('手机号不能为空')
		    		}
		    	}else{
		    		
		            var data
		            if($scope.peopleType=='add'){
		            	data={
		            		'realname':$scope.addUserName,
		            		'username':$scope.addUserZh,
		            		'group_id':$("#groupAddUser").val(),
		            		'mobile':$scope.addUserTel
		            	}
		            	alertTExt='新建员工成功'
		            	$scope.ajaxMethod='post'
		            }else{
		            	data={
		            		'realname':$scope.addUserName,
		            		'username':$scope.addUserZh,
		            		'group_id':$("#groupAddUser").val(),
		            		'mobile':$scope.addUserTel,
		            		'id':$scope.uuId
		            	}
		            	alertTExt='编辑员工成功'
		            	$scope.ajaxMethod='PATCH'
		            }

		            $http({
						method:$scope.ajaxMethod,
						url :oUrl+'plat/employee',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':'Bearer '+window.localStorage.getItem("token")
						},
		                transformRequest: function (obj) {
		                    var str = [];
		                    for (var o in obj)
		                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
		                    return str.join("&");
		                },
		                data:data
					}).success(function(res){
						console.log(res)
						if( res.status_code==200){
							$scope.modalShow=false
							groupToPages()

							alert(alertTExt)

						}
					}).error(function(res){
						if(res.status_code==422){
							alert(res.errors[0].error)
						}else{
							alert(res.errors)
						}
					});
		    	}
        
		    }
		    // 新增权限组
		    $scope.addQx=function(){
		    	// qxzName
		    	if($scope.addQxName==''){
		    		alert('用户组名称不能为空')
		    	}else{
		    		var num=0
		    		var alertTExt
		            $.each($('input[name=qxzName]:checkbox:checked'),function(){
		                // window.alert("你选了："+
		                // $('input[name=qxzName]:checked').length+"个，其中有："+$(this).val());
		                num=(Number(num)+Number($(this).val())).toFixed(0)
		            });
		            var data
		            if($scope.quanxianType=='add'){
		            	data={
		            		'group_name':$scope.addQxName,
		                	'power':num,
		            	}
		            	alertTExt='新建用户组成功'
		            }else{
		            	data={
		            		'group_name':$scope.addQxName,
		                	'power':num,
		                	'id':$scope.quanxianId
		            	}
		            	alertTExt='编辑用户组成功'
		            }

		            $http({
						method:$scope.ajaxMethod,
						url :oUrl+'plat/group',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':'Bearer '+window.localStorage.getItem("token")
						},
		                transformRequest: function (obj) {
		                    var str = [];
		                    for (var o in obj)
		                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
		                    return str.join("&");
		                },
		                data:data
					}).success(function(res){
						console.log(res)
						if( res.status_code==200){
							$scope.qxmodalShow=false
							userGroupPages()

							alert(alertTExt)

						}
					}).error(function(res){
						if(res.status_code==422){
							alert(res.errors[0].error)
						}else{
							alert(res.errors)
						}
					});
		    	}
		    	
	            console.log(num)
        
		    }
		    // 员工
		    function groupToPages() {
				$http({
					method: "get",
					url :oUrl+'plat/employee',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("token")
					},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
	                params:{
	                	'p':$scope.total_pages,
	                	'perPage':10,
	                }
				}).success(function(res){
					console.log(res)
					if( res.status_code==200){
						$scope.peopleList=res.data
						$scope.userCount=res.meta.pagination

						$scope.showLoad=false

					}
				}).error(function(res){
					if(res.status_code==422){
						alert(res.errors[0].error)
					}else{
						alert(res.errors)
					}
				});
		    };
		    // 用户
		    function userGroupPages() {
		    	console.log($scope.group_pages)
				$http({
					method: "get",
					url :oUrl+'plat/group',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("token")
					},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
	                params:{
	                	'p':$scope.group_pages,
	                	'perPage':10,
	                }
				}).success(function(res){
					console.log(res)
					if( res.status_code==200){

						$scope.showLoad=false

						$scope.groupList=res.data
						$scope.groupCount=res.meta.pagination
					}
				}).error(function(res){
					if(res.status_code==422){
						alert(res.errors[0].error)
					}else{
						alert(res.errors)
					}
				});
		    };
		    // 全部
		    function grop(){
				$.ajax({
					type: "get",
					url : oUrl+'plat/group',
					async : false,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("token")
					},
					data:{
	                	'p':1,
	                	'perPage':999,
	                },
					success : function(res){
						console.log(res)
						if( res.status_code==200){
							$("#groupAddUser").html('')
							for(var i=0;i<res.data.length;i++){
								$("#groupAddUser").append('<option value="'+ res.data[i].id +'">'+res.data[i].group_name+'</option>')
							}
						}else{
							alert(res.message)
						}
					},error:function(res){
						if(res.responseJSON.status_code==422){
							alert(res.responseJSON.errors[0].error)
						}else{
							alert(res.responseJSON.errors)
						};
					}
				})
		    }
		    // caouzo
		    function logPages() {
		    	console.log($scope.group_pages)
				$http({
					method: "get",
					url :oUrl+'plat/log',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("token")
					},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
	                params:{
	                	'p':$scope.log_pages,
	                	'perPage':10,
	                }
				}).success(function(res){
					console.log(res)
					if( res.status_code==200){

						$scope.showLoad=false

						$scope.logList=res.data
						$scope.logCount=res.meta.pagination
					}
				}).error(function(res){
					if(res.status_code==422){
						alert(res.errors[0].error)
					}else{
						alert(res.errors)
					}
				});
		    };
		}
			
	}).when("/poster",{ //广告审核
		templateUrl:"page/poster.html",
		controller: function($scope,$rootScope,$http){
			$rootScope.showLeft='show'
			$scope.total_pages =1;
			$scope.is_history=0
			if(window.localStorage.getItem("userInfo")==''||window.localStorage.getItem("userInfo")==undefined){
				location.href='#/'
			}
			groupToPages($scope.is_history)

			console.log($scope.showLeft)
			$scope.navType="nav0"
			// 切换导航
			$scope.navBtn=function(type){
				$scope.navType='nav'+type
				$scope.is_history=type
				$scope.total_pages =1;
				groupToPages($scope.is_history)
			}
			// 拒绝
			$scope.nomodalShow=false
			$scope.noBtn=function(id){
				$scope.jjText=''
				$scope.nomodalShow=true
				$scope.jjBtn=function(){
					if($scope.jjText!=''){
						$http({
							method: "patch",
							url :oUrl+'plat/ad/reject',
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded',
								'Authorization':'Bearer '+window.localStorage.getItem("token")
							},
			                transformRequest: function (obj) {
			                    var str = [];
			                    for (var o in obj)
			                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
			                    return str.join("&");
			                },
			                params:{
			                	id:id,
			                	reject_reason:$scope.jjText
			                }
						}).success(function(res){
							console.log(res)
							if( res.status_code==200){
								$scope.nomodalShow=false
								groupToPages($scope.is_history)
								alert('拒绝成功')
							}
						}).error(function(res){
							if(res.status_code==422){
								alert(res.errors[0].error)
							}else{
								alert(res.errors)
							}
						});
					}else{
						alert('拒绝原因不能为空')
					}
					
				}
			}

			$scope.closeNoModal=function(){
				$scope.nomodalShow=false
			}
			$scope.openmodalShow=false
			$scope.openModal=function(id){
				$scope.openmodalShow=true

				$scope.sureOpen=function(){
					$http({
						method: "PATCH",
						url :oUrl+'plat/ad/pass',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':'Bearer '+window.localStorage.getItem("token")
						},
		                transformRequest: function (obj) {
		                    var str = [];
		                    for (var o in obj)
		                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
		                    return str.join("&");
		                },
		                params:{
		                	id:id
		                }
					}).success(function(res){
						console.log(res)
						if( res.status_code==200){
							$scope.openmodalShow=false
							groupToPages($scope.is_history)
							alert('开通成功')
						}
					}).error(function(res){
						if(res.status_code==422){
							alert(res.errors[0].error)
						}else{
							alert(res.errors)
						}
					});
				}
			}



			
			
			$scope.range = function (start, end) {
		        var ret = [];
		        if (!end) {
		            end = start;
		            start = 0;
		        }
		        for (var i = start; i < end; i++) {
		            ret.push(i);
		        }
		        return ret;
		    };

		    $scope.prevPage = function () {
		        if ($scope.total_pages > 1) {
		            $scope.total_pages--;
					groupToPages($scope.is_history)
		        }
		    };
		    
		    $scope.nextPage = function () {
		        if ($scope.total_pages < $scope.userCount.total_pages) {
		            $scope.total_pages++;
					groupToPages($scope.is_history)
		        }
		    };
		    
		    $scope.setPage = function (page) {
		    	console.log(page)
		        $scope.total_pages = page;
				groupToPages($scope.is_history)
		    };

		      // 广告审核列表
		    function groupToPages(is_history) {
				$http({
					method: "get",
					url :oUrl+'plat/ad',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("token")
					},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
	                params:{
	                	'p':$scope.total_pages,
	                	'perPage':10,
	                	'is_history':is_history //0 false 1 true
	                }
				}).success(function(res){
					console.log(res)
					if( res.status_code==200){
						$scope.adList=res.data
						$scope.userCount=res.meta.pagination

						$scope.showLoad=false

					}
				}).error(function(res){
					if(res.status_code==422){
						alert(res.errors[0].error)
					}else{
						alert(res.errors)
					}
				});
		    };

		}
			
	}).when("/merchant",{ //商户审核
		templateUrl:"page/merchant.html",
		controller: function($scope,$rootScope,$http){
			$rootScope.showLeft='show'
			if(window.localStorage.getItem("userInfo")==''||window.localStorage.getItem("userInfo")==undefined){
				location.href='#/'
			}
			console.log($scope.showLeft)
			// $scope.navType="nav1"
			$scope.total_pages =1;
			$scope.is_history=0

			groupToPages($scope.is_history)

			console.log($scope.showLeft)
			$scope.navType="nav0"
			// 切换导航
			$scope.navBtn=function(type){
				$scope.navType='nav'+type
				$scope.is_history=type
				$scope.total_pages =1;
				groupToPages($scope.is_history)
			}



			$scope.openmodalShow=false
			$scope.closeopenAlert=function(){
				$scope.openmodalShow=false
			}
			$scope.openModal=function(id){
				$scope.openmodalShow=true

				$scope.sureOpen=function(){
					$http({
						method: "PATCH",
						url :oUrl+'plat/business/pass',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':'Bearer '+window.localStorage.getItem("token")
						},
		                transformRequest: function (obj) {
		                    var str = [];
		                    for (var o in obj)
		                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
		                    return str.join("&");
		                },
		                params:{
		                	id:id
		                }
					}).success(function(res){
						console.log(res)
						if( res.status_code==200){
							$scope.openmodalShow=false
							groupToPages($scope.is_history)
							alert('开通成功')
						}
					}).error(function(res){
						$scope.openmodalShow=false

						if(res.status_code==422){
							alert(res.errors[0].error)
						}else{
							alert(res.errors)
						}
					});
				}
			}
			$scope.dtmodalShow=false
			$scope.changeDt=function(id,dtid){
				$scope.dtmodalShow=true
				$("#groupAddUser").html('')

				getDtList(id,dtid)


				$scope.userdtAddBtn=function(){

					$http({
						method: "patch",
						url :oUrl+'plat/business/push',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':'Bearer '+window.localStorage.getItem("token")
						},
		                transformRequest: function (obj) {
		                    var str = [];
		                    for (var o in obj)
		                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
		                    return str.join("&");
		                },
		                params:{
		                	id:id,
		                	plat_push_user_id:$("#groupAddUser").val()
		                }
					}).success(function(res){
						console.log(res)
						if( res.status_code==200){
							$scope.dtmodalShow=false
							groupToPages($scope.is_history)

							alert("修改地推人员成功")
						}
					}).error(function(res){
						$scope.dtmodalShow=false

						if(res.status_code==422){
							alert(res.errors[0].error)
						}else{
							alert(res.errors)
						}
					});
				}

			}
			$scope.closedtBtn=function(){
				$scope.dtmodalShow=false
			}
			// 获取递推人员列表
			function getDtList(id,dtid){
				$http({
					method: "get",
					url :oUrl+'plat/business/push',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("token")
					},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
	                params:{
	                	id:id
	                }
				}).success(function(res){
					console.log(res)
					if( res.status_code==200){
						$scope.dtList=res.data
						// $("#groupAddUser option[value='"+p.group_id+"']").attr('selected','selected')
						for(var i=0;i<res.data.length;i++){
							$("#groupAddUser").append('<option value="'+ res.data[i].id +'">'+res.data[i].username+'</option>')
						}

						$("#groupAddUser option[value='"+dtid+"']").attr('selected','selected')

					}
				}).error(function(res){

					if(res.status_code==422){
						alert(res.errors[0].error)
					}else{
						alert(res.errors)
					}
				});
			}


			// 驳回
			$scope.cfText=''
			$scope.nomodalShow=false
			$scope.noBtn=function(id){
				$scope.nomodalShow=true

				$scope.jjBtn=function(){
					if($scope.cfText==''){
						alert('驳回原因不能为空')
					}else{
						$http({
							method: "patch",
							url :oUrl+'plat/business/reject',
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded',
								'Authorization':'Bearer '+window.localStorage.getItem("token")
							},
			                transformRequest: function (obj) {
			                    var str = [];
			                    for (var o in obj)
			                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
			                    return str.join("&");
			                },
			                params:{
			                	id:id,
			                	reject_reason:$scope.cfText
			                }
						}).success(function(res){
							console.log(res)
							if( res.status_code==200){
								$scope.nomodalShow=false
								groupToPages($scope.is_history)
								alert('驳回成功')
							}
						}).error(function(res){
							$scope.nomodalShow=false

							if(res.status_code==422){
								alert(res.errors[0].error)
							}else{
								alert(res.errors)
							}
						});
					}
					
				}
			}

			$scope.closeNoModal=function(){
				$scope.nomodalShow=false
			}
			$scope.bl=''
			$scope.xx=''
			$scope.editExtract=function(id,bl,xx){
				$scope.extractmodalShow=true
				$scope.bl=bl
				$scope.xx=xx
				$scope.sBl=''
				$scope.sXx=''


				$scope.yesExt=function(){
					if($scope.sBl==''||$scope.sXx==''){
						if($scope.sBl==''){
							alert('抽成比例不能为空')
						}else{
							alert('提现下限不能为空')
						}
					}else{
						$http({
							method: "patch",
							url :oUrl+'plat/business/draw-scale',
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded',
								'Authorization':'Bearer '+window.localStorage.getItem("token")
							},
			                transformRequest: function (obj) {
			                    var str = [];
			                    for (var o in obj)
			                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
			                    return str.join("&");
			                },
			                params:{
			                	id:id,
			                	draw_scale:$scope.sBl,
			                	limit_money_lower:$scope.sXx
			                }
						}).success(function(res){
							console.log(res)
							if( res.status_code==200){
								$scope.extractmodalShow=false
								groupToPages($scope.is_history)
								alert('修改成功')
							}
						}).error(function(res){
							$scope.extractmodalShow=false

							if(res.status_code==422){
								alert(res.errors[0].error)
							}else{
								alert(res.errors)
							}
						});
					}
					
				}
			}
			$scope.closeExtract=function(){
				$scope.extractmodalShow=false
			}

			$scope.range = function (start, end) {
		        var ret = [];
		        if (!end) {
		            end = start;
		            start = 0;
		        }
		        for (var i = start; i < end; i++) {
		            ret.push(i);
		        }
		        return ret;
		    };

		    $scope.prevPage = function () {
		        if ($scope.total_pages > 1) {
		            $scope.total_pages--;
					groupToPages()
		        }
		    };
		    
		    $scope.nextPage = function () {
		        if ($scope.total_pages < $scope.userCount.total_pages) {
		            $scope.total_pages++;
					groupToPages()
		        }
		    };
		    
		    $scope.setPage = function (page) {
		    	console.log(page)
		        $scope.total_pages = page;
				groupToPages()
		    };

		      // 广告审核列表
		    function groupToPages(is_history) {
				$http({
					method: "get",
					url :oUrl+'plat/business',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("token")
					},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
	                params:{
	                	'p':$scope.total_pages,
	                	'perPage':10,
	                	'is_history':is_history //0 false 1 true
	                }
				}).success(function(res){
					console.log(res)
					if( res.status_code==200){
						$scope.shopList=res.data
						$scope.userCount=res.meta.pagination

						$scope.showLoad=false

					}
				}).error(function(res){

					if(res.status_code==422){
						alert(res.errors[0].error)
					}else{
						alert(res.errors)
					}
				});
		    };
		}
			
	}).when("/putForward",{ //提现审核
		templateUrl:"page/putForward.html",
		controller: function($scope,$rootScope,$http){
			$rootScope.showLeft='show'
			$scope.detailmodalShow=false
			$scope.status=99

			if(window.localStorage.getItem("userInfo")==''||window.localStorage.getItem("userInfo")==undefined){
				location.href='#/'
			}

			$http({
				method: "get",
				url :oUrl+'plat/withdraw/statistic',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Authorization':'Bearer '+window.localStorage.getItem("token")
				},
                transformRequest: function (obj) {
                    var str = [];
                    for (var o in obj)
                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
                    return str.join("&");
                },
			}).success(function(res){
				console.log(res)
				if( res.status_code==200){
					$scope.topCon=res.data
				}
			}).error(function(res){
				if(res.status_code==422){
					alert(res.errors[0].error)
				}else{
					alert(res.errors)
				}
			});
			// 驳回
			$scope.cfText=''
			$scope.nomodalShow=false
			$scope.noBtn=function(id){
				$scope.nomodalShow=true

				$scope.jjBtn=function(){
					if($scope.cfText==''){
						alert('驳回原因不能为空')
					}else{
						$http({
							method: "patch",
							url :oUrl+'plat/withdraw/status/reject',
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded',
								'Authorization':'Bearer '+window.localStorage.getItem("token")
							},
			                transformRequest: function (obj) {
			                    var str = [];
			                    for (var o in obj)
			                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
			                    return str.join("&");
			                },
			                params:{
			                	id:id,
			                	reject_reason:$scope.cfText
			                }
						}).success(function(res){
							console.log(res)
							if( res.status_code==200){
								$scope.nomodalShow=false
								groupToPages()
								alert('驳回成功')
							}
						}).error(function(res){
							$scope.nomodalShow=false

							if(res.status_code==422){
								alert(res.errors[0].error)
							}else{
								alert(res.errors)
							}
						});
					}
					
				}
			}
			$scope.closeNoModal=function(){
				$scope.nomodalShow=false
			}


			// 确认未支付
			$scope.openmodalShow=false
			$scope.closeopenAlert=function(){
				$scope.openmodalShow=false
			}
			$scope.openModal=function(id,ajaxUrl,txt){
				$scope.openmodalShow=true
				$scope.txt=txt

				$scope.sureOpen=function(){
					$http({
						method: "PATCH",
						url :oUrl+'plat/withdraw/status/'+ajaxUrl,
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':'Bearer '+window.localStorage.getItem("token")
						},
		                transformRequest: function (obj) {
		                    var str = [];
		                    for (var o in obj)
		                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
		                    return str.join("&");
		                },
		                params:{
		                	id:id
		                }
					}).success(function(res){
						console.log(res)
						if( res.status_code==200){
							$scope.openmodalShow=false
							groupToPages()
							alert(txt+'成功')
						}
					}).error(function(res){
						$scope.openmodalShow=false

						if(res.status_code==422){
							alert(res.errors[0].error)
						}else{
							alert(res.errors)
						}
					});
				}
			}

			console.log($scope.showLeft)
			$scope.goDetail=function(id){
				console.log(111)
				$scope.detailmodalShow=true
				$http({
					method: "get",
					url :oUrl+'plat/withdraw/detail',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("token")
					},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
	                params:{
	                	id:id
	                }
				}).success(function(res){
					console.log(res.data)
					if( res.status_code==200){
						$scope.detailCon=res.data[0]
					}
				}).error(function(res){
					if(res.status_code==422){
						alert(res.errors[0].error)
					}else{
						alert(res.errors)
					}
				});
			}
			$scope.closeDetail=function(){
				$scope.detailmodalShow=false
			}
			$("#typeSelect").change(function(){
				$scope.total_pages=1
				$scope.status=$("#typeSelect").val()
				groupToPages()
			})


			$scope.total_pages=1
			groupToPages()

			$scope.range = function (start, end) {
		        var ret = [];
		        if (!end) {
		            end = start;
		            start = 0;
		        }
		        for (var i = start; i < end; i++) {
		            ret.push(i);
		        }
		        return ret;
		    };

		    $scope.prevPage = function () {
		        if ($scope.total_pages > 1) {
		            $scope.total_pages--;
					groupToPages()
		        }
		    };
		    
		    $scope.nextPage = function () {
		        if ($scope.total_pages < $scope.userCount.total_pages) {
		            $scope.total_pages++;
					groupToPages()
		        }
		    };
		    
		    $scope.setPage = function (page) {
		    	console.log(page)
		        $scope.total_pages = page;
				groupToPages()
		    };

		      // 体现列表
		    function groupToPages() {
				$http({
					method: "get",
					url :oUrl+'plat/withdraw',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("token")
					},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
	                params:{
	                	'p':$scope.total_pages,
	                	'perPage':10,
	                	'status':$scope.status
	                }
				}).success(function(res){
					console.log(res)
					if( res.status_code==200){
						$scope.forList=res.data
						$scope.userCount=res.meta.pagination

						$scope.showLoad=false

					}
				}).error(function(res){

					if(res.status_code==422){
						alert(res.errors[0].error)
					}else{
						alert(res.errors)
					}
				});
		    };
		}
			
	}).when("/earthPush",{//地推管理
		templateUrl:"page/earthPush.html",
		controller: function($scope,$rootScope,$http){
			$rootScope.showLeft='show'
			if(window.localStorage.getItem("userInfo")==''||window.localStorage.getItem("userInfo")==undefined){
				location.href='#/'
			}
			console.log($scope.showLeft)
			$scope.detailmodalShow=false
			$scope.goDetail=function(){
				$scope.detailmodalShow=true
			}
			$scope.closeDetailModal=function(){
				$scope.detailmodalShow=false
			}

			// laydate.render({
			//   elem: '#time1' //指定元素
			// });

			

			console.log($scope.showLeft)
			$scope.goDetail=function(n1,n2,id){
				$scope.n1=n1
				$scope.n2=n2
				console.log(111)
				$scope.detailmodalShow=true
				$scope.dtId=id
				$scope.dateText=''
				$scope.click='no'

				$scope.changeTime=function(){
					console.log($scope.dateText)
					// 2018-10-09 ~ 2018-11-28
					$scope.start=$scope.dateText.split(" ~ ")[0]
					$scope.end=$scope.dateText.split(" ~ ")[1]
					$scope.click='show'
					
					console.log($scope.start,$scope.end)
					$http({
						method: "get",
						url :oUrl+'plat/push/detail',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':'Bearer '+window.localStorage.getItem("token")
						},
		                transformRequest: function (obj) {
		                    var str = [];
		                    for (var o in obj)
		                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
		                    return str.join("&");
		                },
		                params:{
		                	'plat_user_id':id,
		                	'begin_date':$scope.start,
		                	'end_date':$scope.end
		                }
					}).success(function(res){
						console.log(res)
						if( res.status_code==200){
							$scope.detailCon=res.data

							$scope.shop=res.data.shop
							console.log($scope.shop)
						}
					}).error(function(res){
						if(res.status_code==422){
							alert(res.errors[0].error)
						}else{
							alert(res.errors)
						}
					});
				}
				

			}
			$scope.closeDetail=function(){
				$scope.detailmodalShow=false
			}

			$scope.name=''


			$scope.total_pages=1
			groupToPages($scope.name)

			$("#search").keypress(function (e) {
                if (e.which == 13) {
                   console.log($("#search").val())
					groupToPages($("#search").val())

                }
			});

			$scope.range = function (start, end) {
		        var ret = [];
		        if (!end) {
		            end = start;
		            start = 0;
		        }
		        for (var i = start; i < end; i++) {
		            ret.push(i);
		        }
		        return ret;
		    };

		    $scope.prevPage = function () {
		        if ($scope.total_pages > 1) {
		            $scope.total_pages--;
					groupToPages($scope.name)
		        }
		    };
		    
		    $scope.nextPage = function () {
		        if ($scope.total_pages < $scope.userCount.total_pages) {
		            $scope.total_pages++;
					groupToPages($scope.name)
		        }
		    };
		    
		    $scope.setPage = function (page) {
		    	console.log(page)
		        $scope.total_pages = page;
				groupToPages($scope.name)
		    };

		      // 体现列表
		    function groupToPages(name) {
				$http({
					method: "get",
					url :oUrl+'plat/push/index',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("token")
					},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
	                params:{
	                	'p':$scope.total_pages,
	                	'perPage':10,
	                	'keyword':name
	                }
				}).success(function(res){
					console.log(res)
					if( res.status_code==200){
						$scope.dtList=res.data
						$scope.userCount=res.meta.pagination

					}
				}).error(function(res){
					if(res.status_code==422){
						alert(res.errors[0].error)
					}else{
						alert(res.errors)
					}
				});
		    };
	
		}
			
	}).when("/account",{ //账号管理
		templateUrl:"page/account.html",
		controller: function($scope,$rootScope,$http){
			$rootScope.showLeft='show'
			if(window.localStorage.getItem("userInfo")==''||window.localStorage.getItem("userInfo")==undefined){
				location.href='#/'
			}
			console.log($scope.showLeft)


			$scope.cfText=''
			$scope.nomodalShow=false

			$scope.noDetail=function(id){
				$scope.nomodalShow=true

				$scope.jjBtn=function(){
					if($scope.cfText==''){
						alert('查封原因不能为空')
					}else{
						$http({
							method: "patch",
							url :oUrl+'plat/custom/ban',
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded',
								'Authorization':'Bearer '+window.localStorage.getItem("token")
							},
			                transformRequest: function (obj) {
			                    var str = [];
			                    for (var o in obj)
			                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
			                    return str.join("&");
			                },
			                params:{
			                	id:id,
			                	ban_reason:$scope.cfText
			                }
						}).success(function(res){
							console.log(res)
							if( res.status_code==200){
								$scope.nomodalShow=false
								groupToPages($scope.name)
								alert('查封成功')
							}
						}).error(function(res){
							$scope.nomodalShow=false

							if(res.status_code==422){
								alert(res.errors[0].error)
							}else{
								alert(res.errors)
							}
						});
					}
					
				}
			}
			$scope.closeNoModal=function(){
				$scope.nomodalShow=false
			}

			$scope.openmodalShow=false
			$scope.closeopenAlert=function(){
				$scope.openmodalShow=false
			}
			$scope.openModal=function(id){
				$scope.openmodalShow=true

				$scope.sureOpen=function(){
					$http({
						method: "PATCH",
						url :oUrl+'plat/custom/unban',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':'Bearer '+window.localStorage.getItem("token")
						},
		                transformRequest: function (obj) {
		                    var str = [];
		                    for (var o in obj)
		                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
		                    return str.join("&");
		                },
		                params:{
		                	id:id
		                }
					}).success(function(res){
						console.log(res)
						if( res.status_code==200){
							$scope.openmodalShow=false
							groupToPages()
							alert('解封成功')
						}
					}).error(function(res){
						$scope.openmodalShow=false

						if(res.status_code==422){
							alert(res.errors[0].error)
						}else{
							alert(res.errors)
						}
					});
				}
			}


			console.log($scope.showLeft)
			$scope.detailmodalShow=false
			$scope.goDetail=function(){
				$scope.detailmodalShow=true
			}
			$scope.closeDetailModal=function(){
				$scope.detailmodalShow=false
			}

			console.log($scope.showLeft)
			$scope.goDetail=function(){
				console.log(111)
				$scope.detailmodalShow=true
			}
			$scope.closeDetail=function(){
				$scope.detailmodalShow=false
			}

			$scope.name=''


			$scope.total_pages=1
			groupToPages($scope.name)

			$("#search").keypress(function (e) {
                if (e.which == 13) {
                   console.log($("#search").val())
					groupToPages($("#search").val())

                }
			});

			$scope.range = function (start, end) {
		        var ret = [];
		        if (!end) {
		            end = start;
		            start = 0;
		        }
		        for (var i = start; i < end; i++) {
		            ret.push(i);
		        }
		        return ret;
		    };

		    $scope.prevPage = function () {
		        if ($scope.total_pages > 1) {
		            $scope.total_pages--;
					groupToPages($scope.name)
		        }
		    };
		    
		    $scope.nextPage = function () {
		        if ($scope.total_pages < $scope.userCount.total_pages) {
		            $scope.total_pages++;
					groupToPages($scope.name)
		        }
		    };
		    
		    $scope.setPage = function (page) {
		    	console.log(page)
		        $scope.total_pages = page;
				groupToPages($scope.name)
		    };

		      // 用户列表
		    function groupToPages(name) {
				$http({
					method: "get",
					url :oUrl+'plat/custom',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("token")
					},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
	                params:{
	                	'p':$scope.total_pages,
	                	'perPage':10,
	                	'keyword':name
	                }
				}).success(function(res){
					console.log(res)
					if( res.status_code==200){
						$scope.userList=res.data
						$scope.userCount=res.meta.pagination

					}
				}).error(function(res){
					if(res.status_code==422){
						alert(res.errors[0].error)
					}else{
						alert(res.errors)
					}
				});
		    };
	
		}
			
	}).when("/transaction",{ //交易管理
		templateUrl:"page/transaction.html",
		controller: function($scope,$rootScope,$http){
			$rootScope.showLeft='show'
			$scope.dateText=''
			$scope.start=''
			$scope.end=''
			$scope.keyword=''
			if(window.localStorage.getItem("userInfo")==''||window.localStorage.getItem("userInfo")==undefined){
				location.href='#/'
			}
			console.log($scope.showLeft)

			$scope.detailmodalShow=false
			$scope.goDetail=function(id){
				$scope.detailmodalShow=true

				 $http({
					method: "get",
					url :oUrl+'plat/trade/show',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("token")
					},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
	                params:{
	                	id:id
	                }
				}).success(function(res){
					console.log(res)
					if( res.status_code==200){
						$scope.detailCon=res.data
					}
				}).error(function(res){
					if(res.status_code==422){
						alert(res.errors[0].error)
					}else{
						alert(res.errors)
					}
				});

			}
			$scope.closeDetailAlert=function(){
				$scope.detailmodalShow=false
			}
			$scope.total_pages=1
			$scope.is_closed=0
			$scope.showType='type0'
			$scope.keyword=''
			groupToPages()
			$scope.navFn=function(type){
				console.log(type)
				$scope.is_closed=type
				console.log($scope.is_closed)
				$scope.showType='type'+type
				$scope.total_pages=1
				groupToPages()
			}

			$scope.changeTime=function(){
				console.log($scope.dateText)
				// 2018-10-09 ~ 2018-11-28
				if($scope.dateText==''){
					alert("请选择开始时间，结束时间")
				}else{
					$scope.start=$scope.dateText.split(" ~ ")[0]
					$scope.end=$scope.dateText.split(" ~ ")[1]
					groupToPages()

					console.log($scope.start,$scope.end)
				}				
			}
			$("#search").keypress(function (e) {
                if (e.which == 13) {
					groupToPages()
                }
			});

			$scope.range = function (start, end) {
		        var ret = [];
		        if (!end) {
		            end = start;
		            start = 0;
		        }
		        for (var i = start; i < end; i++) {
		            ret.push(i);
		        }
		        return ret;
		    };

		    $scope.prevPage = function () {
		        if ($scope.total_pages > 1) {
		            $scope.total_pages--;
					groupToPages()
		        }
		    };
		    
		    $scope.nextPage = function () {
		        if ($scope.total_pages < $scope.userCount.total_pages) {
		            $scope.total_pages++;
					groupToPages()
		        }
		    };
		    
		    $scope.setPage = function (page) {
		    	console.log(page)
		        $scope.total_pages = page;
				groupToPages()
		    };

		    $http({
				method: "get",
				url :oUrl+'plat/trade/statistic',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Authorization':'Bearer '+window.localStorage.getItem("token")
				},
                transformRequest: function (obj) {
                    var str = [];
                    for (var o in obj)
                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
                    return str.join("&");
                }
			}).success(function(res){
				console.log(res)
				if( res.status_code==200){
					$scope.ccc=res.data
				}
			}).error(function(res){
				if(res.status_code==422){
					alert(res.errors[0].error)
				}else{
					alert(res.errors)
				}
			});

		      // 交易列表
		    function groupToPages() {
		    	console.log($scope.is_closed)
				$http({
					method: "get",
					url :oUrl+'plat/trade',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("token")
					},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
	                params:{
	                	'p':$scope.total_pages,
	                	'perPage':10,
	                	'is_closed':$scope.is_closed,
	                	'keyword':$scope.keyword,
	                	'begin_date':$scope.start,
	                	'end_date':$scope.end
	                }
				}).success(function(res){
					console.log(res)
					if( res.status_code==200){
						$scope.dtList=res.data
						$scope.userCount=res.meta.pagination

					}
				}).error(function(res){
					if(res.status_code==422){
						alert(res.errors[0].error)
					}else{
						alert(res.errors)
					}
				});
		    };
	
		}
			
	}).when("/feedback",{ //用户反馈
		templateUrl:"page/feedback.html",
		controller: function($scope,$rootScope,$http){
			$rootScope.showLeft='show'
			$scope.navType="nav1"
			if(window.localStorage.getItem("userInfo")==''||window.localStorage.getItem("userInfo")==undefined){
				location.href='#/'
			}
			console.log($scope.showLeft)
			// 查询电话名称
			$http({
				method: "get",
				url :oUrl+'plat/feedback/tel',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Authorization':'Bearer '+window.localStorage.getItem("token")
				},
                transformRequest: function (obj) {
                    var str = [];
                    for (var o in obj)
                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
                    return str.join("&");
                },
			}).success(function(res){
				console.log(res)
				if( res.status_code==200){
					$scope.tel=res.data.content
					$scope.oldTel=res.data.content
				}
			}).error(function(res){
				$scope.backMesmodalShow=false
				if(res.status_code==422){
					alert(res.errors[0].error)
				}else{
					alert(res.errors)
				}
			});

			$scope.total_pages=1
			$scope.type=1 //0 商户 1用户
			groupToPages($scope.type)

			$scope.changeNav=function(type,ajaxType){
				$scope.navType=type
				console.log(ajaxType)
				$scope.type==ajaxType
				$scope.total_pages=1
				groupToPages(ajaxType)
			}

			$scope.editmodalShow=false
			$scope.editTelBtn=function(){
				$scope.editmodalShow=true
				console.log($scope.tel)
				$scope.yesBtn=function(){
					console.log('111111111111')

					if($scope.tel!=''){
						$http({
							method: "PATCH",
							url :oUrl+'plat/feedback/tel',
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded',
								'Authorization':'Bearer '+window.localStorage.getItem("token")
							},
			                transformRequest: function (obj) {
			                    var str = [];
			                    for (var o in obj)
			                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
			                    return str.join("&");
			                },
			                params:{
			                	tel:$scope.oldTel
			                }
						}).success(function(res){
							console.log(res)
							if( res.status_code==200){
								$scope.editmodalShow=false

								alert("修改客服电话成功")
							}
						}).error(function(res){
							$scope.backMesmodalShow=false
							$scope.tel=$scope.oldTel
							
							if(res.status_code==422){
								alert(res.errors[0].error)
							}else{
								alert(res.errors)
							}
						});

					}else{
						alert("请输入客服电话")
					}
				}
				
			}
			$scope.closeBtnAlert=function(){
				$scope.editmodalShow=false
				$scope.tel=$scope.oldTel
			}
			$scope.hfText=''

			$scope.backMesmodalShow=false
			$scope.hfText=''
			$scope.backMes=function(p){
				$scope.backMesmodalShow=true
				$scope.hfCon=p
				
				$scope.backSure=function(){
					console.log($scope.hfCon)
					if($scope.hfText==''){
						alert("请填写回复内容")
					}else{
						$http({
							method: "PATCH",
							url :oUrl+'plat/feedback/reply',
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded',
								'Authorization':'Bearer '+window.localStorage.getItem("token")
							},
			                transformRequest: function (obj) {
			                    var str = [];
			                    for (var o in obj)
			                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
			                    return str.join("&");
			                },
			                params:{
			                	'id':$scope.hfCon.id,
			                	'reply_message':$scope.hfText,
			                }
						}).success(function(res){
							console.log(res)
							if( res.status_code==200){
								$scope.backMesmodalShow=false
								groupToPages($scope.type)
								alert("回复成功")
							}
						}).error(function(res){
							$scope.backMesmodalShow=false
							if(res.status_code==422){
								alert(res.errors[0].error)
							}else{
								alert(res.errors)
							}
						});
					}
					
			    };

			}
			$scope.closeNoModal=function(){
				$scope.backMesmodalShow=false
			}
	


			

			$scope.range = function (start, end) {
		        var ret = [];
		        if (!end) {
		            end = start;
		            start = 0;
		        }
		        for (var i = start; i < end; i++) {
		            ret.push(i);
		        }
		        return ret;
		    };

		    $scope.prevPage = function () {
		        if ($scope.total_pages > 1) {
		            $scope.total_pages--;
					groupToPages($scope.type)
		        }
		    };
		    
		    $scope.nextPage = function () {
		        if ($scope.total_pages < $scope.userCount.total_pages) {
		            $scope.total_pages++;
					groupToPages($scope.type)
		        }
		    };
		    
		    $scope.setPage = function (page) {
		    	console.log(page)
		        $scope.total_pages = page;
				groupToPages($scope.type)
		    };

		      // 交易列表
		    function groupToPages(type) {
				$http({
					method: "get",
					url :oUrl+'plat/feedback',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("token")
					},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
	                params:{
	                	'p':$scope.total_pages,
	                	'perPage':10,
	                	'type':type,
	                }
				}).success(function(res){
					console.log(res)
					if( res.status_code==200){
						$scope.feedList=res.data
						$scope.userCount=res.meta.pagination

					}
				}).error(function(res){
					if(res.status_code==422){
						alert(res.errors[0].error)
					}else{
						alert(res.errors)
					}
				});
		    };
		}
			
	}).when("/ad",{ //广告管理
		templateUrl:"page/ad.html",
		controller: function($scope,$rootScope,$http){
			$rootScope.showLeft='show'
			$scope.navType="nav1"
			console.log($scope.showLeft)
			$scope.changeNav=function(type){
				$scope.navType=type
			}
			if(window.localStorage.getItem("userInfo")==''||window.localStorage.getItem("userInfo")==undefined){
				location.href='#/'
			}
			$scope.total_pages=1

			groupToPages()


			$scope.range = function (start, end) {
		        var ret = [];
		        if (!end) {
		            end = start;
		            start = 0;
		        }
		        for (var i = start; i < end; i++) {
		            ret.push(i);
		        }
		        return ret;
		    };

		    $scope.prevPage = function () {
		        if ($scope.total_pages > 1) {
		            $scope.total_pages--;
					groupToPages()
		        }
		    };
		    
		    $scope.nextPage = function () {
		        if ($scope.total_pages < $scope.userCount.total_pages) {
		            $scope.total_pages++;
					groupToPages()
		        }
		    };
		    
		    $scope.setPage = function (page) {
		    	console.log(page)
		        $scope.total_pages = page;
				groupToPages()
		    };

		      // 交易列表
		    function groupToPages() {
				$http({
					method: "get",
					url :oUrl+'plat/banner/position',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("token")
					},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
	                params:{
	                	'p':$scope.total_pages,
	                	'perPage':2,
	                }
				}).success(function(res){
					console.log(res)
					if( res.status_code==200){
						$scope.bannerList=res.data
						$scope.userCount=res.meta.pagination

					}
				}).error(function(res){
					if(res.status_code==422){
						alert(res.errors[0].error)
					}else{
						alert(res.errors)
					}
				});
		    };
		}
			
	}).when("/adDetail",{ //广告管理
		templateUrl:"page/adDetail.html",
		controller: function($scope,$rootScope,$http,$routeParams){
			$rootScope.showLeft='show'
			$scope.navType="nav1"
			console.log($scope.showLeft)
			$scope.changeNav=function(type){
				$scope.navType=type
			}
			if(window.localStorage.getItem("userInfo")==''||window.localStorage.getItem("userInfo")==undefined){
				location.href='#/'
			}
			$scope.pos=$routeParams.pagePos
			$scope.delmodalShow=false
			$scope.delBtn=function(id){
				$scope.delmodalShow=true

				$scope.yesDel=function(){
					$http({
						method: "DELETE",
						url :oUrl+'plat/banner',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':'Bearer '+window.localStorage.getItem("token")
						},
		                transformRequest: function (obj) {
		                    var str = [];
		                    for (var o in obj)
		                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
		                    return str.join("&");
		                },
		                params:{
		                	id:id
		                }
					}).success(function(res){
						console.log(res)
						if( res.status_code==200){
							groupToPages()
							$scope.delmodalShow=false

							alert("删除成功")
						}
					}).error(function(res){
						if(res.status_code==422){
							alert(res.errors[0].error)
						}else{
							alert(res.errors)
						}
					});
				}
			}
			$scope.closeBtnAlert=function(){
				$scope.delmodalShow=false
			}

			$scope.peopleBtn=function(type,id){
				if(type=='add'){
					location.href='#/addAd?type=add&city='+$("#sheng").val()+"&posId="+$routeParams.id+"&pagePos="+$routeParams.pagePos
				}else{
					location.href='#/addAd?type=edit&city='+$("#sheng").val()+"&posId="+$routeParams.id+"&pagePos="+$routeParams.pagePos+'&adId='+id
				}
			}

			getSList()
			function getSList(){
				$http({
					method: "get",
					url :oUrl+'plat/banner/area/open',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("token")
					},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
	                params:{
	                	parentid:'all'
	                }
				}).success(function(res){
					console.log(res)
					if( res.status_code==200){
						$scope.provinceList=res.data
						for(var i=0;i<res.data.length;i++){
							$("#sheng").append('<option value="'+ res.data[i].id +'">'+res.data[i].shortname+'</option>')
						}

						groupToPages()

					}
				}).error(function(res){
					if(res.status_code==422){
						alert(res.errors[0].error)
					}else{
						alert(res.errors)
					}
				});
			}

			$scope.total_pages=1

			

			$scope.range = function (start, end) {
		        var ret = [];
		        if (!end) {
		            end = start;
		            start = 0;
		        }
		        for (var i = start; i < end; i++) {
		            ret.push(i);
		        }
		        return ret;
		    };

		    $scope.prevPage = function () {
		        if ($scope.total_pages > 1) {
		            $scope.total_pages--;
					groupToPages()
		        }
		    };
		    
		    $scope.nextPage = function () {
		        if ($scope.total_pages < $scope.userCount.total_pages) {
		            $scope.total_pages++;
					groupToPages()
		        }
		    };
		    
		    $scope.setPage = function (page) {
		    	console.log(page)
		        $scope.total_pages = page;
				groupToPages()
		    };
		    $("#sheng").change(function(){
				 groupToPages()
			})

		      // ad列表
		    function groupToPages() {
				$http({
					method: "get",
					url :oUrl+'plat/banners',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("token")
					},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
	                params:{
	                	'p':$scope.total_pages,
	                	'perPage':10,
	                	'ad_id':$routeParams.id,
	                	'city_code':$("#sheng").val()
	                }
				}).success(function(res){
					console.log(res)
					if( res.status_code==200){
						$scope.bannerList=res.data
						$scope.userCount=res.meta.pagination

					}
				}).error(function(res){
					if(res.status_code==422){
						alert(res.errors[0].error)
					}else{
						alert(res.errors)
					}
				});
		    };
		
		}
			
	}).when("/addAd",{ //添加广告位
		templateUrl:"page/addAd.html",
		controller: function($scope,$rootScope,$http,$routeParams){
			$rootScope.showLeft='show'
			$scope.dateText=''
			$scope.pos=$routeParams.pagePos
			$scope.modalShow=false
			if(window.localStorage.getItem("userInfo")==''||window.localStorage.getItem("userInfo")==undefined){
				location.href='#/'
			}
			$scope.orderFn=function(){
				console.log('123',$scope.modalShow)
				$scope.modalShow=true
			}
			$scope.closeBtnAlert=function(){
				$scope.modalShow=false
			}

			if($routeParams.type=='add'){
				$scope.orderOrder='请选择订单'
				$scope.orderId=''
				$scope.sortNum=''
				$scope.image_id=''
				$scope.shId=''
			}else{
				$http({
					method: "get",
					url :oUrl+'plat/banner',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("token")
					},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
	                params:{
	                	id:$routeParams.adId
	                },
				}).success(function(res){
					console.log(res)
					if( res.status_code==200){
						$scope.idId=res.data.id
						$scope.orderOrder=res.data.order.banner_order_no
						$scope.orderId=res.data.order.id
						$scope.sortNum=res.data.sort
						$scope.image_id=''
						$scope.shId=res.data.trade_shop_id
						$scope.dateText=res.data.begin_date+" ~ "+res.data.end_date
						
						$(".on").html("<img src='"+res.data.image+"' alt='' style='width:100%;height:100%'>")

					}
				}).error(function(res){
					$scope.delmodalShow=false
					

					if(res.status_code==422){
						alert(res.errors[0].error)
					}else{
						alert(res.errors)
					}
				});
			}

			
			console.log($routeParams.posId)
			$scope.orderYes=function(){ // 关联订单
				// console.log($("input[name='orderId']:checked").attr("order"))
				if($("input[name='orderId']:checked").attr("order")!=undefined){
					$scope.orderId=$("input[name='orderId']:checked").attr("order")
					$scope.orderOrder=$("input[name='orderId']:checked").attr("dataOrder")
					$scope.shId=$("input[name='orderId']:checked").attr("shId")
					console.log($scope.orderId)
					$scope.modalShow=false

				}else{
					alert("请选择订单")
				}

				
			}
			console.log($scope.orderId)
			
			$scope.save=function(){
				console.log($scope.dateText)
					// 2018-10-09 ~ 2018-11-28
				var bol=false
				$scope.start=$scope.dateText.split(" ~ ")[0]
				$scope.end=$scope.dateText.split(" ~ ")[1]
				var data
				if($routeParams.type=='add'){
					$scope.ajaxMethod='post'
					if($scope.orderOrder=='请选择订单'){ // 没关联订单
						console.log('没关联订单')
						if($scope.start!=''&&$scope.sortNum!=''&&$scope.shId!=''&&$scope.image_id!=''){
							data={
			                	begin_date:$scope.start,
			                	end_date:$scope.end,
			                	sort:$scope.sortNum,
			                	shop_id:$scope.shId,
			                	image_id:$scope.image_id,
			                	ad_id:$routeParams.posId,
			                	city_code:$routeParams.city,
			                }
							bol=true
						}else{
							console.log($scope.image_id)
							if($scope.start==''){
								console.log("123")
								alert("请选择开始时间，结束时间")
							}else if($scope.image_id==''){
								alert("请选择图片")
							}else if($scope.shId==''){
								alert("请输入商铺ID")
							}else if($scope.sortNum==''){
								alert("请输入排序")
							}
						}
					}else{// 关联订单
						if($scope.start!=''&&$scope.sortNum!=''){
							data={
			                	begin_date:$scope.start,
			                	end_date:$scope.end,
			                	sort:$scope.sortNum,
			                	// shop_id:$scope.shId,
			                	ad_order_id:$scope.orderId,
			                	// image_id:$scope.image_id,
			                	ad_id:$routeParams.posId,
			                	city_code:$routeParams.city,
			                }
							bol=true
						}else{
							if($scope.start==''){
								alert("请选择开始时间，结束时间")
							}else{
								alert("请输入排序")
							}
						}
					}
				}else{
					$scope.ajaxMethod='patch'

					if($scope.orderOrder=='请选择订单'){ // 没关联订单
						console.log('没关联订单')
						if($scope.start!=''&&$scope.sortNum!=''&&$scope.shId!=''&&$scope.image_id!=''){
							data={
			                	begin_date:$scope.start,
			                	end_date:$scope.end,
			                	sort:$scope.sortNum,
			                	shop_id:$scope.shId,
			                	image_id:$scope.image_id,
			                	ad_id:$routeParams.posId,
			                	city_code:$routeParams.city,
			                	id:$scope.idId
			                }
							bol=true
						}else{
							console.log($scope.image_id)
							if($scope.start==''){
								console.log("123")
								alert("请选择开始时间，结束时间")
							}else if($scope.image_id==''){
								alert("请选择图片")
							}else if($scope.shId==''){
								alert("请输入商铺ID")
							}else if($scope.sortNum==''){
								alert("请输入排序")
							}
						}
					}else{// 关联订单
						if($scope.start!=''&&$scope.sortNum!=''){
							data={
			                	begin_date:$scope.start,
			                	end_date:$scope.end,
			                	sort:$scope.sortNum,
			                	// shop_id:$scope.shId,
			                	ad_order_id:$scope.orderId,
			                	// image_id:$scope.image_id,
			                	ad_id:$routeParams.posId,
			                	city_code:$routeParams.city,
			                	id:$scope.idId
			                }
							bol=true
						}else{
							if($scope.start==''){
								alert("请选择开始时间，结束时间")
							}else{
								alert("请输入排序")
							}
						}
					}
				}
				
				if(bol){
					$http({
						method:$scope.ajaxMethod,
						url :oUrl+'plat/banner',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':'Bearer '+window.localStorage.getItem("token")
						},
		                transformRequest: function (obj) {
		                    var str = [];
		                    for (var o in obj)
		                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
		                    return str.join("&");
		                },
		                params:data,
					}).success(function(res){
						console.log(res)
						if( res.status_code==200){
							window.history.go(-1)
						}
					}).error(function(res){
						$scope.delmodalShow=false
						

						if(res.status_code==422){
							alert(res.errors[0].error)
						}else{
							alert(res.errors)
						}
					});
				}
				
			}



			$("#image").change(function (e) {
	     		$scope.showLoad=true

	     		console.log($('#image')[0].files[0])
				 var file = this.files[0];
				 var formData = new FormData();
				 //// //console.log( $('#image')[0].files[0])
				 formData.append('photo', $('#image')[0].files[0]);
				 formData.append('ad_id', $routeParams.posId);

	     			var fileSize=file.size/1024/1024
			 		if(fileSize<=1){
			 		  var reader = new FileReader();
					   switch (file.type){
					   case 'image/jpg':
					   case 'image/png':
					   case 'image/jpeg':
					   case 'image/gif':
					   reader.readAsDataURL(file);
					   break;
					 }
					 reader.addEventListener('load',function () {
					 switch (file.type){
					     case 'image/jpg':
					     case 'image/png':
					     case 'image/jpeg':
					     case 'image/gif':
					    
					     break;
					    }
					});

			   		$.ajax({
					    url:oUrl+ 'plat/banner/upload',
					    type: 'POST',
					    cache: false,
					    data: formData,
					    headers: {
							'Content-Type': undefined,
							'Authorization':'Bearer '+window.localStorage.getItem("token")
						},
					    processData: false,
					    contentType: false
					}).success(function(res) {
						//// //console.log(res)
						if(res.status_code==200){
							console.log("success")
							$(".on").html("<img src='"+res.data.path+"' alt='' style='width:100%;height:100%'>")
							$scope.image_id=res.data.id
						}
					}).done(function(res) {}).error(function(res) {
						console.log(res)
						if(res.responseJSON.status_code==422){
							alert(res.responseJSON.errors[0].error)
						}else{
							alert(res.responseJSON.errors)
						};
					});
			 	}else{
					alert("图片大小超过限制")

			 	}

			});	
			

			$scope.total_pages=1
			groupToPages()

			$scope.range = function (start, end) {
		        var ret = [];
		        if (!end) {
		            end = start;
		            start = 0;
		        }
		        for (var i = start; i < end; i++) {
		            ret.push(i);
		        }
		        return ret;
		    };

		    $scope.prevPage = function () {
		        if ($scope.total_pages > 1) {
		            $scope.total_pages--;
					groupToPages()
		        }
		    };
		    
		    $scope.nextPage = function () {
		        if ($scope.total_pages < $scope.userCount.total_pages) {
		            $scope.total_pages++;
					groupToPages()
		        }
		    };
		    
		    $scope.setPage = function (page) {
		    	console.log(page)
		        $scope.total_pages = page;
				groupToPages()
		    };

		      // 用户列表
		    function groupToPages() {
		    	
				$http({
					method: "get",
					url :oUrl+'plat/banner/relate',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("token")
					},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
	                params:{
	                	'p':$scope.total_pages,
	                	'perPage':6,
	                	city_code:$routeParams.city
	                }
				}).success(function(res){
					console.log(res)
					if( res.status_code==200){
						$scope.order=res.data
						$scope.userCount=res.meta.pagination

					}
				}).error(function(res){
					if(res.status_code==422){
						alert(res.errors[0].error)
					}else{
						alert(res.errors)
					}
				});
		    };

		}
			
	}).when("/regionAd",{ //区域控制
		templateUrl:"page/regionAd.html",
		controller: function($scope,$rootScope,$http){
			$rootScope.showLeft='show'
			$scope.sId='all'
			getShowList()
			if(window.localStorage.getItem("userInfo")==''||window.localStorage.getItem("userInfo")==undefined){
				location.href='#/'
			}
			$scope.delmodalShow=false
			$scope.openDelBtn=function(id){
				$scope.delmodalShow=true

				$scope.delSure=function(){
					$http({
						method: "PATCH",
						url :oUrl+'plat/banner/area',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':'Bearer '+window.localStorage.getItem("token")
						},
		                transformRequest: function (obj) {
		                    var str = [];
		                    for (var o in obj)
		                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
		                    return str.join("&");
		                },
		                params:{
		                	id:id
		                }
					}).success(function(res){
						console.log(res)
						if( res.status_code==200){
							$scope.delmodalShow=false
							getShowList()
							alert('关闭成功')
						}
					}).error(function(res){
						$scope.delmodalShow=false
						

						if(res.status_code==422){
							alert(res.errors[0].error)
						}else{
							alert(res.errors)
						}
					});
				}
			}
			$scope.closeBtnAlert=function(){
				$scope.delmodalShow=false
			}
			// 获取城市列表
			getSList()
			function getSList(){
				$http({
					method: "get",
					url :oUrl+'plat/common/province',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("token")
					},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
				}).success(function(res){
					console.log(res)
					if( res.status_code==200){
						$scope.provinceList=res.data
						$("#sheng").append('<option value="all">请选择城市</option>')

						for(var i=0;i<res.data.length;i++){
							$("#sheng").append('<option value="'+ res.data[i].id +'">'+res.data[i].shortname+'</option>')

						}
					}
				}).error(function(res){
					if(res.status_code==422){
						alert(res.errors[0].error)
					}else{
						alert(res.errors)
					}
				});
			}

			$("#sheng").change(function(){
				$scope.sId=$("#sheng").val()
				 getShowList()
			})

			function getShowList(){
				$http({
					method: "get",
					url :oUrl+'plat/banner/area',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("token")
					},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
	                params:{
	                	'parentid':$scope.sId
	                }
				}).success(function(res){
					console.log(res)
					if( res.status_code==200){
						$scope.showList=res.data
					}
				}).error(function(res){
					if(res.status_code==422){
						alert(res.errors[0].error)
					}else{
						alert(res.errors)
					}
				});
			}
			


			$scope.openmodalShow=false
			$scope.closeopenAlert=function(){
				$scope.openmodalShow=false
			}
			$scope.openModal=function(id){
				$scope.openmodalShow=true

				$scope.sureOpen=function(){
					$http({
						method: "PATCH",
						url :oUrl+'plat/banner/area',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':'Bearer '+window.localStorage.getItem("token")
						},
		                transformRequest: function (obj) {
		                    var str = [];
		                    for (var o in obj)
		                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
		                    return str.join("&");
		                },
		                params:{
		                	id:id
		                }
					}).success(function(res){
						console.log(res)
						if( res.status_code==200){
							$scope.openmodalShow=false
							 getShowList()
							alert('开通成功')
						}
					}).error(function(res){
						$scope.openmodalShow=false

						if(res.status_code==422){
							alert(res.errors[0].error)
						}else{
							alert(res.errors)
						}
					});
				}
			}

		
		}
			
	}).when("/mes",{ //信息提示
		templateUrl:"page/mes.html",
		controller: function($scope,$rootScope,$http){
			$rootScope.showLeft='show'
			if(window.localStorage.getItem("userInfo")==''||window.localStorage.getItem("userInfo")==undefined){
				location.href='#/'
			}
			$http({
				method: "get",
				url :oUrl+'plat/information',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Authorization':'Bearer '+window.localStorage.getItem("token")
				},
                transformRequest: function (obj) {
                    var str = [];
                    for (var o in obj)
                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
                    return str.join("&");
                }
			}).success(function(res){
				console.log(res)
				if( res.status_code==200){
					$scope.text1=res.data[0].content
					$scope.text2=res.data[1].content
					$scope.text3=res.data[2].content
				}
			}).error(function(res){
				if(res.status_code==422){
					alert(res.errors[0].error)
				}else{
					alert(res.errors)
				}
			});
			

			$scope.openmodalShow=false
			$scope.closeopenAlert=function(){
				$scope.openmodalShow=false
			}

			$scope.editBtn=function(){
				$scope.openmodalShow=true

				$scope.sureOpen=function(){
					if($scope.text1!=''&&$scope.text2!=''&&$scope.text3!=''){
						$http({
							method: "patch",
							url :oUrl+'plat/information',
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded',
								'Authorization':'Bearer '+window.localStorage.getItem("token")
							},
			                transformRequest: function (obj) {
			                    var str = [];
			                    for (var o in obj)
			                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
			                    return str.join("&");
			                },
			                params:{
			                	information_first:$scope.text1,
			                	information_second:$scope.text2,
			                	information_third:$scope.text3
			                }
						}).success(function(res){
							console.log(res)
							if( res.status_code==200){
								$scope.openmodalShow=false
								alert("设置成功")
							}
						}).error(function(res){
							if(res.status_code==422){
								alert(res.errors[0].error)
							}else{
								alert(res.errors)
							}
						});
					}else{
						alert("提示信息不能为空")
					}
				}

				
			}


		}
			
	})
})
