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
			$scope.signOut=function(){
				location.href='signIndex.html#/'
				window.localStorage.setItem("shopUserInfo",'')
			}

			$scope.pasShow=false
			$scope.editPas=function(){
				$scope.pasShow=true
				$scope.savePas=function(){
					if($scope.newPas==''){
						alert("请输入密码")
					}else if($scope.newPas=='88888888'){
						alert("密码不可以与初始密码一样")
					}else{
						$http({
							method: "patch",
							url :oUrl+'busi/users/passw/reset',
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded',
								'Authorization':'Bearer '+window.localStorage.getItem("shopToken"),
							},
			                transformRequest: function (obj) {
			                    var str = [];
			                    for (var o in obj)
			                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
			                    return str.join("&");
			                },
			                data:{
			                	'password':$scope.newPas
			                }
						}).success(function(resPas){
							console.log(resPas)
							if( resPas.status_code==200){
								$scope.pasShow=false
								alert("密码修改成功")
							}
						}).error(function(resPas){
							if(resPas.status_code==422){
								alert(resPas.errors[0].error)
							}else{
								alert(resPas.errors)
							}
						});
					}
				}
			}
		}
	};
});

shop.controller("pCtrl",function($scope,$routeParams,$location,$http){
	console.log()
	var arr = $location.$$path.split("/");
	var str = arr.filter(function(v){return !!v;})[0];
	var newArr = arr.filter(function(v){return !!v;});
	var _scope = $scope;

	var shopId=$location.$$search.shopId
	var shopName=$location.$$search.shopName

	$scope.manager=false

	if(window.localStorage.getItem("shopUserInfo")==null||window.localStorage.getItem("shopUserInfo")==''||window.localStorage.getItem("shopUserInfo")==undefined){
		location.href='signIndex.html#/'
	}else{
		$scope.userInfo=JSON.parse(window.localStorage.getItem("shopUserInfo"))
		console.log($scope.userInfo)
		$scope.leftNavOnce=$scope.userInfo.power_info||[]

		if($scope.userInfo.type=='super'||$scope.userInfo.type=='trade_employee'||$scope.userInfo.type=='shop_manager'){
			$scope.leftType='home'
			if($scope.userInfo.type=='shop_manager'){
				$scope.manager=true


			}else{

			}
		}else{
			$scope.leftType='shop'
		}

		$scope.shop_info=$scope.userInfo.shop_info||[]
		$scope.ygPowerInfo=$scope.shop_info.power_info||[]


	}

	console.log($scope.ygPowerInfo)



	$scope.setNavFocus = function(leftNav,shopId,shopName){
		$scope.leftNav=''
		$scope.leftNav = leftNav || 'overView';

		if($scope.leftNav=='overView'||$scope.leftNav =='shglManger'||$scope.leftNav=='shgl'||$scope.leftNav=='putForward'||$scope.leftNav=='putDetail'||$scope.leftNav=='staff'||$scope.leftNav=='store'||$scope.leftNav=='mes'){
			$scope.leftType='home'
		}else{
			$scope.leftType='shop'
			console.log(shopId)
			$scope.shopId=shopId
		}

		$scope.shopName=shopName
		console.log($scope.leftType)

	};
	$scope.setNavFocus(str,shopId,shopName);

	$scope.handclk = function(sClass,shopId,shopName){
		$scope.setNavFocus(sClass,shopId,shopName);
		
	}.bind($scope);

	console.log(window.localStorage.getItem("shopUserInfo123123123"))





	

	

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

	shop.directive('ddLaydate', function() {
	　　 return {
	　　　　require: '?ngModel',
	　　　　restrict: 'A',
	　　　　scope: {
	　　　　　　ngModel: '=',　　
	　　　　},
	　　　　link: function(scope, element, attr, ngModel) {

			console.log(attr.modeltext)
			 
	　　　　　　var _date = null,_config={};
	　　　　　　// 初始化参数（具体参数可以查看API:http://www.layui.com/doc/modules/laydate.html）
	　　　　　　_config = {
	　　　　　　　　lang: 'cn',
	　　　　　　　　elem: element[0],
	　　　　　　　　btns:['confirm'],
	　　　　　　　　format: !!attr.format ? attr.format : 'yyyy-MM-dd HH:mm:ss',
	　　　　　　　　range: false,
				 type:'datetime',
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


				element.bind('mouseenter', function(){

					if(attr.modeltex=='endTime'){
						// $scope.endTime=
					}

			//     scope.$apply(attrs.gettime);
			 
			   })
	　　　　}
	　　 }
	})
shop.directive('timedate', function() {
	　　 return {
	　　　　require: '?ngModel',
	　　　　restrict: 'A',
	　　　　scope: {
	　　　　　　ngModel: '=',　　
	　　　　},
	　　　　link: function(scope, element, attr, ngModel) {

			console.log(attr.modeltext)
			 
	　　　　　　var _date = null,_config={};
	　　　　　　// 初始化参数（具体参数可以查看API:http://www.layui.com/doc/modules/laydate.html）
	　　　　　　_config = {
	　　　　　　　　lang: 'cn',
	　　　　　　　　elem: element[0],
	　　　　　　　　btns:['confirm'],
	　　　　　　　　format: !!attr.format ? attr.format : 'HH:mm:ss',
	　　　　　　　　range: false,
				 	type:'time',
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


				element.bind('mouseenter', function(){

					if(attr.modeltex=='endTime'){
						// $scope.endTime=
					}

			//     scope.$apply(attrs.gettime);
			 
			   })
	　　　　}
	　　 }
	})
shop.directive('startdate', function() {
	　　 return {
	　　　　require: '?ngModel',
	　　　　restrict: 'A',
	　　　　scope: {
	　　　　　　ngModel: '=',　　
	　　　　},
	　　　　link: function(scope, element, attr, ngModel) {
			var myDate = new Date();
			var nowY = myDate.getFullYear();
			var nowM = myDate.getMonth()+1;
			var nowD = myDate.getDate();
			var enddate = nowY+"-"+(nowM<10 ? "0" + nowM : nowM)+"-"+(nowD<10 ? "0"+ nowD : nowD);//当前日期

			//获取三十天前日期
			var lw = new Date(myDate - 1000 * 60 * 60 * 24 * 30);//最后一个数字30可改，30天的意思
			var lastY = lw.getFullYear();
			var lastM = lw.getMonth()+1;
			var lastD = lw.getDate();
			var startdate=lastY+"-"+(lastM<10 ? "0" + lastM : lastM)+"-"+(lastD<10 ? "0"+ lastD : lastD);
			console.log(startdate)
			console.log(attr.modeltext)
			 
	　　　　　　var _date = null,_config={};
	　　　　　　// 初始化参数（具体参数可以查看API:http://www.layui.com/doc/modules/laydate.html）
	　　　　　　_config = {
	　　　　　　　　lang: 'cn',
	　　　　　　　　elem: element[0],
	　　　　　　　　btns:['confirm'],
	　　　　　　　　format: !!attr.format ? attr.format : 'yyyy-MM-dd',
	　　　　　　　　range: false,
				 	// min:startdate,
				 	max:enddate,
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


				element.bind('mouseenter', function(){

					if(attr.modeltex=='endTime'){
						// $scope.endTime=
					}

			//     scope.$apply(attrs.gettime);
			 
			   })
	　　　　}
	　　 }
	})
shop.directive('monthdate', function() {
	　　 return {
	　　　　require: '?ngModel',
	　　　　restrict: 'A',
	　　　　scope: {
	　　　　　　ngModel: '=',　　
	　　　　},
	　　　　link: function(scope, element, attr, ngModel) {
			var myDate = new Date();
			var nowY = myDate.getFullYear();
			var nowM = myDate.getMonth()+1;
			var nowD = myDate.getDate();
			var enddate = nowY+"-"+(nowM<10 ? "0" + nowM : nowM)+"-"+(nowD<10 ? "0"+ nowD : nowD);//当前日期

			//获取三十天前日期
			var lw = new Date(myDate - 1000 * 60 * 60 * 24 * 30);//最后一个数字30可改，30天的意思
			var lastY = lw.getFullYear();
			var lastM = lw.getMonth()+1;
			var lastD = lw.getDate();
			var startdate=lastY+"-"+(lastM<10 ? "0" + lastM : lastM)+"-"+(lastD<10 ? "0"+ lastD : lastD);
			console.log(startdate)
			console.log(attr.modeltext)
			 
	　　　　　　var _date = null,_config={};
	　　　　　　// 初始化参数（具体参数可以查看API:http://www.layui.com/doc/modules/laydate.html）
	　　　　　　_config = {
	　　　　　　　　lang: 'cn',
	　　　　　　　　elem: element[0],
	　　　　　　　　btns:['confirm'],
	　　　　　　　　format: !!attr.format ? attr.format : 'yyyy-MM',
	　　　　　　　　range: false,
				 max:enddate,
				 type: 'month',
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


				element.bind('mouseenter', function(){

					if(attr.modeltex=='endTime'){
						// $scope.endTime=
					}

			//     scope.$apply(attrs.gettime);
			 
			   })
	　　　　}
	　　 }
	})
//////////////// 图
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

shop.directive('eChart', function($http, $window) {
    function link($scope, element, attrs) {
        var myChart = echarts.init(element[0]);
        $scope.$watch(attrs['eData'], function() {
            var option = $scope.$eval(attrs.eData);
            if (angular.isObject(option)) {
                myChart.setOption(option);
            }
        }, true);
        $scope.getDom = function() {
            return {
                'height': element[0].offsetHeight,
                'width': element[0].offsetWidth
            };
        };
        $scope.$watch($scope.getDom, function() {
            // resize echarts图表
            myChart.resize();
        }, true);
    }
    return {
        restrict: 'A',
        link: link
    };
});

///////////////////////

////////////////
shop.config(function($routeProvider){
	$routeProvider.when("/overView",{
		templateUrl:"page/overView.html",
		controller: function($scope,$rootScope,$http){
			$rootScope.showLeft='show'
		}
			
	}).when("/staff",{ // 员工管理
		templateUrl:"page/staff.html",
		controller: function($scope,$rootScope,$http){
			$rootScope.showLeft='show'

			console.log($scope.showLeft)
				$scope.modalShow=false // 新建编辑
				$scope.delmodalShow=false //删除
				$scope.qxmodalShow=false //权限

			// 新建员工
			$scope.peopleBtn=function(type,p){
				console.log(type)
				$scope.peopleType=type
				$scope.modalShow=true
				console.log($scope.modalShow)
				if(type=='add'){
					$scope.addUserName=''
					$scope.addUserZh=''
					$scope.addUserTel=''

				}else{
					$scope.addUserName=p.realname
					$scope.addUserZh=p.username
					$scope.addUserTel=p.mobile
					$scope.uuId=p.id

		    		$scope.editUserGroup=p.power_info

				}

			}
			//  x新建 编辑 员工 确定
			$scope.userAddBtn=function(){
		    		console.log($("#c7")[0].checked)

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
		            var num=0
		            $.each($('input[name=qxzName]:checkbox:checked'),function(){
		                // window.alert("你选了："+
		                // $('input[name=qxzName]:checked').length+"个，其中有："+$(this).val());
		                num=(Number(num)+Number($(this).val())).toFixed(0)
		            });

		            if($scope.peopleType=='add'){
		            	if($("#c7")[0].checked){
		            		data={
			            		'realname':$scope.addUserName,
			            		'username':$scope.addUserZh,
			            		'power':'manager',
			            		'mobile':$scope.addUserTel
			            	}
		            	}else{
		            		data={
			            		'realname':$scope.addUserName,
			            		'username':$scope.addUserZh,
			            		'power':num,
			            		'mobile':$scope.addUserTel
			            	}
		            	}
		            	
		            	alertTExt='新建员工成功'
		            	$scope.ajaxMethod='post'
		    			$scope.ajaxUrl='busi/employee/store'

		            }else{
		            	if($("#c7")[0].checked){
		            		data={
			            		'realname':$scope.addUserName,
			            		'username':$scope.addUserZh,
			            		'power':'manager',
			            		'mobile':$scope.addUserTel,
			            		'id':$scope.uuId
			            	}
		            	}else{
		            		data={
			            		'realname':$scope.addUserName,
			            		'username':$scope.addUserZh,
			            		'power':num,
			            		'mobile':$scope.addUserTel,
			            		'id':$scope.uuId
			            	}
		            	}
		            	
		            	alertTExt='编辑员工成功'
		            	$scope.ajaxMethod='PATCH'
		    			$scope.ajaxUrl='busi/employee/edit'

		            }

		            

		            $http({
						method:$scope.ajaxMethod,
						url :oUrl+$scope.ajaxUrl,
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
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
			$scope.quanxianBtn=function(type){
				console.log(type)
				$scope.quanxianType=type
				$scope.qxmodalShow=true
			}
			$scope.delBtn=function(id){
				$scope.delmodalShow=true

				$scope.delYg=function(){
					$http({
						method: "delete",
						url :oUrl+'busi/employee/delete',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
						},
		                transformRequest: function (obj) {
		                    var str = [];
		                    for (var o in obj)
		                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
		                    return str.join("&");
		                },
		                data:{
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

		      // 商铺列表
		    function groupToPages() {
				$http({
					method: "get",
					url :oUrl+'busi/employee/index',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
					},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
	                params:{
	                	'p':$scope.total_pages,
	                	'perPage':10
	                }
				}).success(function(res){
					console.log(res)
					if( res.status_code==200){
						$scope.shopList=res.data
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
			
	}).when("/store",{ //门店审核
		templateUrl:"page/store.html",
		controller: function($scope,$rootScope,$http){
			$rootScope.showLeft='show'

			console.log($scope.showLeft)
			$scope.navType="nav1"
			$scope.navBtn=function(type){
				$scope.navType=type
			}

			$scope.nomodalShow=false
			$scope.noBtn=function(){
				$scope.nomodalShow=true
			}

			$scope.closeNoModal=function(){
				$scope.nomodalShow=false
			}

			$http({
				method: "get",
				url :oUrl+'busi/store/statistic',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
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
					$scope.tj=res.data
				}
			}).error(function(res){
				if(res.status_code==422){
					alert(res.errors[0].error)
				}else{
					alert(res.errors)
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

		      // 商铺列表
		    function groupToPages() {
				$http({
					method: "get",
					url :oUrl+'busi/store/index',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
					},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
	                params:{
	                	'p':$scope.total_pages,
	                	'perPage':10
	                }
				}).success(function(res){
					console.log(res)
					if( res.status_code==200){
						$scope.shopList=res.data
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
			
	}).when("/merchant",{ //商户审核
		templateUrl:"page/merchant.html",
		controller: function($scope,$rootScope,$http){
			$rootScope.showLeft='show'

			console.log($scope.showLeft)
			$scope.navType="nav1"
			$scope.extractmodalShow=false
			$scope.navBtn=function(type){
				$scope.navType=type
			}

			$scope.nomodalShow=false
			$scope.noBtn=function(){
				$scope.nomodalShow=true
			}

			$scope.closeNoModal=function(){
				$scope.nomodalShow=false
			}

			$scope.editExtract=function(){
				$scope.extractmodalShow=true

			}
			$scope.closeExtract=function(){
				$scope.extractmodalShow=false
			}
		}
			
	}).when("/putForward",{ //提现审核
		templateUrl:"page/putForward.html",
		controller: function($scope,$rootScope,$http){
			$rootScope.showLeft='show'
			$scope.txmodalShow=false

			console.log($scope.showLeft)
			
			// 提现 提交
			$scope.goTx=function(type,id,ye,p){
				$scope.txmodalShow=true

				if(type=='add'){
					$scope.amount=''
					$scope.bank_man=''
					$scope.cash_card=''

					$scope.ye=ye

					$scope.ajaxMethod='post'
					$scope.ajaxurl='busi/withdraw/store'
				}else{
					$scope.amount=p.amount
					$scope.bank_man=p.bank_man
					$scope.cash_card=p.cash_card
					$("#txType option[value='"+p.type+"']").attr("selected","selected")
					$scope.ajaxMethod='patch'
					$scope.ajaxurl='busi/withdraw/edit'

				}
				

				$scope.yesTx=function(){
					if($scope.amount!=''&&$scope.bank_man!=''&&$scope.cash_card!=''){
						var data
						if(type=='add'){
							data={
			                	shop_id:id,
			                	amount:$scope.amount,
			                	type:$("#txType").val(),
			                	bank_man:$scope.bank_man,
			                	cash_card:$scope.cash_card
			                }
						}else{
							data={
			                	id:id,
			                	amount:$scope.amount,
			                	type:$("#txType").val(),
			                	bank_man:$scope.bank_man,
			                	cash_card:$scope.cash_card
			                }
						}
						$http({
							method: $scope.ajaxMethod,
							url :oUrl+$scope.ajaxurl,
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded',
								'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
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
								getIndex()
								groupToPages()

								$scope.txmodalShow=false

								alert("提交成功")
							}
						}).error(function(res){
							if(res.status_code==422){
								alert(res.errors[0].error)
							}else{
								alert(res.errors)
							}
						});
					}else{
						if($scope.amount==''){
							alert('提现金额不能为空')
						}else if($scope.bank_man==''){
							alert('收账姓名不能为空')
						}else if($scope.cash_card==''){
							alert('提现渠道账号不能为空')
						}
					}
					
				}
			}
			$scope.closeTx=function(){
				$scope.txmodalShow=false
			}
			// 首页
			getIndex()
			// 详情
			$("#typeSelect").change(function(){
				groupToPages()
			})
			// 详情
			$scope.showDetailBtn=function(id){
				$scope.showDetail=false
				$scope.shopId=id
				groupToPages()
			}
			// 返回
			$scope.goHref=function(){
				$scope.showDetail=true
				getIndex()
			}
			$scope.delmodalShow=false
			// 删除
			$scope.delBtn=function(id){
				$scope.delmodalShow=true

				$scope.sureDel=function(){
					$http({
						method: "delete",
						url :oUrl+'busi/withdraw/delete',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
						},
		                transformRequest: function (obj) {
		                    var str = [];
		                    for (var o in obj)
		                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
		                    return str.join("&");
		                },
		                data:{
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

			// 首页
			function getIndex(){
				$http({
					method: "get",
					url :oUrl+'busi/withdraw/index',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
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
						$scope.shopList=res.data.shops
						$scope.shopTop=res.data.statistic
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

		      // 商铺列表
		    function groupToPages() {
				$http({
					method: "get",
					url :oUrl+'busi/withdraw/shop/index',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
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
	                	shop_id:$scope.shopId,
	                	status:$("#typeSelect").val()
	                }
				}).success(function(res){
					console.log(res)
					if( res.status_code==200){
						$scope.shopDetailList=res.data
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
			
	}).when("/shgl",{ //商户管理
		templateUrl:"page/shgl.html",
		controller: function($scope,$rootScope,$http){
			$rootScope.showLeft='show'

			$scope.userInfoType=JSON.parse(window.localStorage.getItem("shopUserInfo")).type
			console.log($scope.userInfoType)

			console.log($scope.showLeft)
			$scope.delmodalShow=false
			$scope.delBtn=function(id){
				$scope.delmodalShow=true

				$scope.delYes=function(){
					$http({
						method: "delete",
						url :oUrl+'busi/shop/delete',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
						},
		                transformRequest: function (obj) {
		                    var str = [];
		                    for (var o in obj)
		                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
		                    return str.join("&");
		                },
		                data:{
		                	'shop_id':id
		                }
					}).success(function(res){
						console.log(res)
						if( res.status_code==200){
							groupToPages()
							$scope.delmodalShow=false
							alert("删除店铺成功")
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
			$scope.closeDel=function(){
				$scope.delmodalShow=false
			}

			$scope.modalShow=false
			$scope.shopBtn=function(type,dzId,shopId){
				$scope.modalShow=true
				$scope.shopType=type
				//////////////////////// 店长
				console.log(type)
				if(type=='add'){
					//////////////////////// 省市区
					var city1=getCity1()
					var city2=getCity2(city1[0].id)
					var city3=getCity3(city2[0].id)
					for(var i=0;i<city1.length;i++){
						$("#city1").append('<option value="'+city1[i].id+'">'+city1[i].areaname+'</option>')
					}
					for(var i=0;i<city2.length;i++){
						$("#city2").append('<option value="'+city2[i].id+'">'+city2[i].areaname+'</option>')
					}
					for(var i=0;i<city3.length;i++){
						$("#city3").append('<option value="'+city3[i].id+'">'+city3[i].areaname+'</option>')
					}
					getShopOwner('')

					$scope.license_id=''
					$scope.shopname=''
					$(".on").html("")

				}else{
					console.log(dzId)
					getShopOwner(dzId)
					$scope.shop_id=shopId
				}
			}
			$scope.shopname=''

			$scope.saveShop=function(){
				console.log($scope.shopType)
				if($scope.shopType=='add'){
					if($scope.shopname!=''&&$scope.license_id!=''){
						$http({
							method: "post",
							url :oUrl+'busi/shop',
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded',
								'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
							},
			                transformRequest: function (obj) {
			                    var str = [];
			                    for (var o in obj)
			                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
			                    return str.join("&");
			                },
			                data:{
			                	'shop_name':$scope.shopname,
			                	'province_code':$("#city1").val(),
			                	'city_code':$("#city2").val(),
			                	'area_code':$("#city3").val(),
			                	'license_id':$scope.license_id,
			                	'manage_id':$("#owner").val()
			                }
						}).success(function(res){
							console.log(res)
							if( res.status_code==200){
								groupToPages()
								$scope.modalShow=false

								alert("新建成功")

							}
						}).error(function(res){
							if(res.status_code==422){
								alert(res.errors[0].error)
							}else{
								alert(res.errors)
							}
						});
					}else{
						if($scope.shopname==''){
							alert("请输入店铺名称")
						}else{
							alert("请上传营业执照")
						}
					}	
				}else{
					$http({
						method: "patch",
						url :oUrl+'busi/shop/manager',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
						},
		                transformRequest: function (obj) {
		                    var str = [];
		                    for (var o in obj)
		                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
		                    return str.join("&");
		                },
		                data:{
		                	'shop_id':$scope.shop_id,
		                	'manager_id':$("#owner").val()
		                }
					}).success(function(res){
						console.log(res)
						if( res.status_code==200){
							groupToPages()
							$scope.modalShow=false

							alert("修改成功")

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

			$("#city1").change(function(){
				console.log($("#city1").val())
				var city2=getCity2($("#city1").val())
				console.log(city2)
				var city3=getCity3(city2[0].id)
				$("#city2").html("")
				$("#city3").html("")
				for(var i=0;i<city2.length;i++){
					$("#city2").append('<option value="'+city2[i].id+'">'+city2[i].areaname+'</option>')
				}
				for(var i=0;i<city3.length;i++){
					$("#city3").append('<option value="'+city3[i].id+'">'+city3[i].areaname+'</option>')
				}
			})
			$("#city2").change(function(){
				var city3=getCity3($("#city2").val())
				$("#city3").html("")
				for(var i=0;i<city3.length;i++){
					$("#city3").append('<option value="'+city3[i].id+'">'+city3[i].areaname+'</option>')
				}
			})
			$scope.closeBtn=function(){
				$scope.modalShow=false
			}
			$("#owner").change(function(){
				$scope.ownerId=$("#owner").val()
			})

			function getShopOwner(dzId){
				$http({
					method: "get",
					url :oUrl+'busi/shop/manager',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
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
						$scope.ownerList=res.data
						$scope.ownerId=res.data[0].id
						$("#owner").html('<option value="">暂不选择</option>')

						for(var i=0;i<$scope.ownerList.length;i++){
							
							$("#owner").append('<option value="'+$scope.ownerList[i].id+'">'+$scope.ownerList[i].realname+'('+$scope.ownerList[i].username+')</option>')

						}

						if(dzId!=''&&dzId!=undefined &&dzId!='undefined'){
							console.log("!23")
							$("#owner option[value='"+dzId+"']").attr('selected','selected')
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

		      // 商铺列表
		    function groupToPages(type) {
				$http({
					method: "get",
					url :oUrl+'busi/shop',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
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
						$scope.shopList=res.data
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

		    $("#image").change(function (e) {
		    	var formData = new FormData();
			 	formData.append('photo', $('#image')[0].files[0]);
		   		$.ajax({
				    url:oUrl+ 'busi/shop/license',
				    type: 'POST',
				    cache: false,
				    data: formData,
				    headers: {
						'Content-Type': undefined,
						'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
					},
				    processData: false,
				    contentType: false
				}).success(function(res) {
					if(res.status_code==200){
						console.log(res)
						$scope.license_id=res.data.id
						$(".on").html("<img src='"+res.data.path+"' alt='' style='width:100%;height:100%'>")
					}	
				}).error(function(res) {}).error(function(res) {
					console.log(res)
					if(res.responseJSON.status_code==422){
						alert(res.responseJSON.errors[0].error)
					}else{
						alert(res.responseJSON.errors)
					};
				});

			});	
		}
			
	}).when("/shglManger",{ //商户管理 店长列表
		templateUrl:"page/shglManger.html",
		controller: function($scope,$rootScope,$http){
			$rootScope.showLeft='show'

			console.log($scope.showLeft)

			$scope.closeDel=function(){
				$scope.delmodalShow=false
			}

			$scope.modalShow=false

			$scope.shopname=''

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

		      // 商铺列表
		    function groupToPages(type) {
				$http({
					method: "get",
					url :oUrl+'busi/manager/shop/index',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
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
						$scope.shopList=res.data
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

		    $("#image").change(function (e) {
		    	var formData = new FormData();
			 	formData.append('photo', $('#image')[0].files[0]);
		   		$.ajax({
				    url:oUrl+ 'busi/shop/license',
				    type: 'POST',
				    cache: false,
				    data: formData,
				    headers: {
						'Content-Type': undefined,
						'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
					},
				    processData: false,
				    contentType: false
				}).success(function(res) {
					if(res.status_code==200){
						console.log(res)
						$scope.license_id=res.data.id
						$(".on").html("<img src='"+res.data.path+"' alt='' style='width:100%;height:100%'>")
					}	
				}).done(function(res) {}).error(function(res) {
					console.log(res)
					if(res.responseJSON.status_code==422){
						alert(res.responseJSON.errors[0].error)
					}else{
						alert(res.responseJSON.errors)
					};
				});

			});	
		}
			
	}).when("/shopRenovation",{ //店铺装饰
		templateUrl:"page/shopRenovation.html",
		controller: function($scope,$rootScope,$http,$routeParams){
			$rootScope.showLeft='show'
			getShopDetail()

			$scope.userInfoType=JSON.parse(window.localStorage.getItem("shopUserInfo")).type
			console.log($scope.userInfoType)

			console.log($scope.conDetail)
			console.log($scope.lng)
			$scope.lat=39.915
			$scope.lng=116.404
			if($scope.conDetail.lat=="0.0000000"){
				console.log('000000')
				$scope.lat=39.915
				$scope.lng=116.404
			}else{
				console.log('1111')

				$scope.lat=$scope.conDetail.lat
				$scope.lng=$scope.conDetail.lng
			}

			console.log($scope.lng)

			function G(id) {
				return document.getElementById(id);
			}
			const map = new BMap.Map('map');//创建地图实例
			// 经度，纬度
		    const point = new BMap.Point($scope.lng,$scope.lat);//创建点坐标
		    map.centerAndZoom(point, 15);//初始化地图，设置中心点坐标和地图级别
		    map.enableScrollWheelZoom(true);//开启鼠标滚轮缩放

			var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
				{"input" : "suggestId"
				,"location" : map
			});
			
			ac.setInputValue($scope.locate_address);

			ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
			var str = "";
				var _value = e.fromitem.value;
				var value = "";
				if (e.fromitem.index > -1) {
					value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
				}    
				str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
				
				value = "";
				if (e.toitem.index > -1) {
					_value = e.toitem.value;
					value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
				}    
				str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
				G("searchResultPanel").innerHTML = str;
			});

			var myValue
			ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
			var _value = e.item.value;
				myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
				G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
				
				setPlace();
			});



			function setPlace(){
				map.clearOverlays();    //清除地图上所有覆盖物
				function myFun(){
					var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
					console.log(pp)
					map.centerAndZoom(pp, 18);
					map.addOverlay(new BMap.Marker(pp));    //添加标注

					$scope.lat=pp.lat
					$scope.lng=pp.lng
					console.log($scope.lat)

				}
				var local = new BMap.LocalSearch(map, { //智能搜索
				  onSearchComplete: myFun
				});
				
				console.log(myValue)
				$scope.locate_address=myValue
				local.search(myValue);
			}

			// 省市区
			$("#city1").change(function(){
				console.log($("#city1").val())
				var city2=getCity2($("#city1").val())
				console.log(city2)
				var city3=getCity3(city2[0].id)
				$("#city2").html("")
				$("#city3").html("")
				for(var i=0;i<city2.length;i++){
					$("#city2").append('<option value="'+city2[i].id+'">'+city2[i].areaname+'</option>')
				}
				for(var i=0;i<city3.length;i++){
					$("#city3").append('<option value="'+city3[i].id+'">'+city3[i].areaname+'</option>')
				}
			})
			$("#city2").change(function(){
				var city3=getCity3($("#city2").val())
				$("#city3").html("")
				for(var i=0;i<city3.length;i++){
					$("#city3").append('<option value="'+city3[i].id+'">'+city3[i].areaname+'</option>')
				}
			})

			
			getShopDetail()
			function getShopDetail(){
				$.ajax({
					type: "get",
					url : oUrl+'busi/decoration/show',
					async : false,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
					},
					 data:{
	                	shop_id:$routeParams.shopId
	                },
					success : function(res){
						console.log(res)
						if( res.status_code==200){
							$scope.conDetail=res.data
							$scope.conImgArr=res.data.decorations

							getShopTypeIdList(res.data.category_id)

							if(res.data.category==null){

							}else{
								getShopTypeIdList2(res.data.category.id)
							}

							$("#suggestId").val(res.data.locate_address)

							$scope.tag1=res.data.tag[0]||'选择二级分类'
							$scope.tag2=res.data.tag[1]||'选择二级分类'
							$scope.tag3=res.data.tag[2]

							$('#tag1').html('<option value="'+$scope.tag1+'">'+$scope.tag1+'</option>')
							$('#tag2').html('<option value="'+$scope.tag2+'">'+$scope.tag2+'</option>')


							$scope.logo_id=res.data.logo_id

							$scope.locate_address=res.data.locate_address

							$(".logo").html('<img src="'+res.data.logo+'" alt="" style="width:100%;height:100%"/>')

							var city1=getCity1()
							var city2=getCity2(res.data.province_code)
							var city3=getCity3(res.data.city_code)
							for(var i=0;i<city1.length;i++){
								$("#city1").append('<option value="'+city1[i].id+'">'+city1[i].areaname+'</option>')
							}
							for(var i=0;i<city2.length;i++){
								$("#city2").append('<option value="'+city2[i].id+'">'+city2[i].areaname+'</option>')
							}
							for(var i=0;i<city3.length;i++){
								$("#city3").append('<option value="'+city3[i].id+'">'+city3[i].areaname+'</option>')
							}

							$("#city1 option[value='"+res.data.province_code+"']").attr("selected",'selected')
							$("#city2 option[value='"+res.data.city_code+"']").attr("selected",'selected')
							$("#city3 option[value='"+res.data.area_code+"']").attr("selected",'selected')

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

			$scope.saveSort=function(){
				$scope.delShow="no"

				console.log($scope.conImgArr)

				$http({
					method: "patch",
					url :oUrl+'busi/decoration/image/sort',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
					},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
	                data:{
	                	sort:JSON.stringify($scope.conImgArr) 
	                }
				}).success(function(res){
					console.log(res)
					if( res.status_code==200){
						alert("保存成功")
					}
				}).error(function(res){
					if(res.status_code==422){
						alert(res.errors[0].error)
					}else{
						alert(res.errors)
					}
				});	
			}
			$scope.lbWrapShow=false
			$("#lbId").change(function(){
				$scope.lbWrapShow=true

				$scope.$apply()
				console.log("123")

				getShopTypeIdList2($("#lbId").val())


			})
			// 保存装修
			$scope.saveZx=function(){
				$http({
					method: "put",
					url :oUrl+'busi/decoration/edit',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
					},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
	                data:{
	                	id:$routeParams.shopId,
	                	logo_id:$scope.logo_id,
	                	service_start_time:$scope.conDetail.service_start_time,
	                	service_end_time:$scope.conDetail.service_end_time,
	                	shop_tel:$scope.conDetail.shop_tel,
	                	category_id:$("#lbId").val(),
	                	address1:$("#city1").val(),
	                	address2:$("#city2").val(),
	                	address3:$("#city3").val(),
	                	tag1:$("#tag1").val(),
	                	tag2:$("#tag2").val(),
	                	tag3:$scope.tag3,
	                	lat:$scope.lat,
	                	lng:$scope.lng,
	                	locate_address:$scope.locate_address
	                }
				}).success(function(res){
					console.log(res)
					if( res.status_code==200){
						alert("修改成功")
					}
				}).error(function(res){
					if(res.status_code==422){
						alert(res.errors[0].error)
					}else{
						alert(res.errors)
					}
				});	
			}
			// 一级分类
			function getShopTypeIdList(id){
				$http({
					method: "get",
					url :oUrl+'busi/common/category',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
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
						$("#lbId").html('<option value="0">暂不选择</option>')

						for(var i=0;i<res.data.length;i++){
							$("#lbId").append('<option value="'+res.data[i].id+'">'+res.data[i].title+'</option>')
							$("#lbId option[value='"+id+"']").attr('selected','selected')
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
			// 二级分类
			function getShopTypeIdList2(id){
				$http({
					method: "get",
					url :oUrl+'busi/common/category',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
					},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
	                params:{
	                	parent_id:id
	                }
				}).success(function(res){
					console.log(res)
					if( res.status_code==200){
						for(var i=0;i<res.data.length;i++){
							$(".select2").append('<option value="'+res.data[i].title+'">'+res.data[i].title+'</option>')
							// $("#lbId option[value='"+id+"']").attr('selected','selected')
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
			// 删除图片
			$scope.delmodalShow=false
			$scope.delImg=function(id){
				$scope.delmodalShow=true
				$scope.delYes=function(){
					$http({
						method: "delete",
						url :oUrl+'busi/decoration/image/delete',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
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
					}).success(function(res2){
						console.log(res2)
						if( res2.status_code==200){
							getShopDetail()
							$scope.delmodalShow=false
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

				$("#logo").change(function (e) {

					var formData = new FormData();
				 	formData.append('photo', $('#logo')[0].files[0]);

			   		$.ajax({
					    url:oUrl+ 'busi/decoration/logo/upload',
					    type: 'POST',
					    cache: false,
					    data: formData,
					    headers: {
							'Content-Type': undefined,
							'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
						},
					    processData: false,
					    contentType: false
					}).success(function(res) {
						if(res.status_code==200){
							console.log(res)
							$scope.logo_id=res.data.id
							$(".logo").html("<img src='"+res.data.path+"' alt='' style='width:100%;height:100%'>")
						}	
					}).error(function(res) {}).error(function(res) {
						console.log(res)
						if(res.responseJSON.status_code==422){
							alert(res.responseJSON.errors[0].error)
						}else{
							alert(res.responseJSON.errors)
						};
					});
				});	


			$("#image").change(function (e) {
			    	var formData = new FormData();
				 	formData.append('photo', $('#image')[0].files[0]);
				 	formData.append('shop_id',$routeParams.shopId);

			   		$.ajax({
					    url:oUrl+ 'busi/decoration/image/upload',
					    type: 'POST',
					    cache: false,
					    data: formData,
					    headers: {
							'Content-Type': undefined,
							'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
						},
					    processData: false,
					    contentType: false
					}).success(function(res) {
						if(res.status_code==200){
							console.log(res)
							// $scope.license_id=res.data.id
							$http({
								method: "post",
								url :oUrl+'busi/decoration/image/store',
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded',
									'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
								},
				                transformRequest: function (obj) {
				                    var str = [];
				                    for (var o in obj)
				                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
				                    return str.join("&");
				                },
				                params:{
				                	shop_id:$routeParams.shopId,
				                	image_id:res.data.id
				                }
							}).success(function(res2){
								console.log(res2)
								if( res2.status_code==200){
									getShopDetail()
								}
							}).error(function(res){
								if(res.status_code==422){
									alert(res.errors[0].error)
								}else{
									alert(res.errors)
								}
							});


						}	
					}).error(function(res) {}).error(function(res) {
						console.log(res)
						if(res.responseJSON.status_code==422){
							alert(res.responseJSON.errors[0].error)
						}else{
							alert(res.responseJSON.errors)
						};
					});

				});	


		}
			
	}).when("/shopCoupon",{ //发优惠券
		templateUrl:"page/shopCoupon.html",
		controller: function($scope,$rootScope,$http,$routeParams){
			$rootScope.showLeft='show'

			$scope.userInfoType=JSON.parse(window.localStorage.getItem("shopUserInfo")).type
			console.log($scope.userInfoType)

			$scope.delmodalShow=false
			$scope.delClick=function(id){
				$scope.delmodalShow=true
				$scope.delYes=function(){
					$http({
						method: "patch",
						url :oUrl+'busi/coupon/reject',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
						},
		                transformRequest: function (obj) {
		                    var str = [];
		                    for (var o in obj)
		                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
		                    return str.join("&");
		                },
		                data:{
		                	id:id
		                }
					}).success(function(res){
						console.log(res)
						if( res.status_code==200){
							groupToPages()
							$scope.delmodalShow=false
							alert("操作成功")
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


			$scope.yesmodalShow=false
			$scope.tgClick=function(id){
				$scope.yesmodalShow=true
				$scope.tgYes=function(){
					$http({
						method: "patch",
						url :oUrl+'busi/coupon/pass',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
						},
		                transformRequest: function (obj) {
		                    var str = [];
		                    for (var o in obj)
		                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
		                    return str.join("&");
		                },
		                data:{
		                	id:id
		                }
					}).success(function(res){
						console.log(res)
						if( res.status_code==200){
							groupToPages()
							$scope.yesmodalShow=false

							alert("操作成功")
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



			$scope.modalShow=false
			$scope.couponBtn=function(type){
				$scope.shopType=type
				$scope.modalShow=true

				muban()
			}

			$scope.title=''
        	$scope.total_stock=''
        	$scope.startTime=''
        	$scope.endTime=''
        	$scope.full_amount=''
        	$scope.price=''
        	$scope.discount=''
        	$scope.fight_group=''
        	$scope.limit_date=''

			$scope.saveShop=function(){
				console.log($scope.startTime)
				console.log($scope.endTime)

				if ($("#c1").get(0).checked) {
					$scope.mbBol=1
				}else{
					$scope.mbBol=0
				}

				if($scope.title!=''&&$scope.total_stock!=''&&$scope.startTime!=''&&$scope.endTime!=''&&$scope.full_amount!=''&&$scope.price!=''&&$scope.discount!=''&&$scope.fight_group!=''&&$scope.limit_date!=''){
					$http({
						method: "post",
						url :oUrl+'busi/coupon/store',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
						},
		                transformRequest: function (obj) {
		                    var str = [];
		                    for (var o in obj)
		                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
		                    return str.join("&");
		                },
		                params:{
		                	shop_id:$routeParams.shopId,
		                	title:$scope.title,
		                	total_stock:$scope.total_stock,
		                	begin_datetime:$scope.startTime,
		                	end_datetime:$scope.endTime,
		                	full_amount:$scope.full_amount,
		                	price:$scope.price,
		                	discount:$scope.discount,
		                	fight_group:$scope.fight_group,
		                	limit_date:$scope.limit_date,
		                	save_template:$scope.mbBol
		                }
					}).success(function(res){
						console.log(res)
						if( res.status_code==200){
							groupToPages()
							$scope.modalShow=false

							alert("新建优惠券成功")
						}
					}).error(function(res){
						if(res.status_code==422){
							alert(res.errors[0].error)
						}else{
							alert(res.errors)
						}
					});
				}else{
					if($scope.title==''){
						alert("请输入标题")
					}else if($scope.total_stock==''){
						alert("请输入库存")
					}else if($scope.startTime==''){
						alert("请选择起拼时间")
					}else if($scope.endTime==''){
						alert("请选择结束时间")
					}else if($scope.full_amount==''){
						alert("请输入达标金额")
					}else if($scope.price==''){
						alert("请输入售卖金额")
					}else if($scope.discount==''){
						alert("请输入折扣比例")
					}else if($scope.fight_group==''){
						alert("请输入拼团人数")
					}else if($scope.limit_date==''){
						alert("请输入有效日期")
					}
				}

				

			}



			function muban() {
				$http({
					method: "get",
					url :oUrl+'busi/coupon/temp/index',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
					},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
	                params:{
	                	shop_id:$routeParams.shopId,
	                }
				}).success(function(res){
					console.log(res)
					if( res.status_code==200){
						$scope.mubanList=res.data
						$("#muban").html('<option value="">无</option>')

						for(var i=0;i<$scope.mubanList.length;i++){
							$("#muban").append('<option value="'+$scope.mubanList[i].id+'">'+$scope.mubanList[i].title+'</option>')
						}
					}
				}).error(function(res){
					if(res.status_code==422){
						alert(res.errors[0].error)
					}else{
						alert(res.errors)
					}
				});
		    };
		    $("#muban").change(function(){
		    	console.log($("#muban").val())

		    
				for (var obj in $scope.mubanList ){
				  	// 将json对象转换为字符串
				  	var str = JSON.stringify($scope.mubanList[obj]);
				  	// 将json字符串转换为map
				 	var map = eval("("+str+")");

				  	if(map.id==$("#muban").val()){
					  		console.log(map.title)
	                	$scope.title=map.title
	                	$scope.total_stock=map.total_stock
	                	// $scope.startTime=map.begin_datetime
	                	// $scope.$apply()		
	                	// $scope.endTime=map.end_datetime
	                	$scope.full_amount=map.full_amount
	                	$scope.price=map.price
	                	$scope.discount=map.discount
	                	$scope.fight_group=map.fight_group
	                	$scope.limit_date=map.limit_date
	                	$scope.mbBol=map.mbBol		

	                	$scope.$apply()		  	
	                }
				}	
		    })


			$scope.total_pages=1
			groupToPages()

			$("#checkType").change(function(){
				$scope.total_pages=1
				groupToPages()
			})
			
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

		      // 商铺列表
		    function groupToPages(type) {
				$http({
					method: "get",
					url :oUrl+'busi/coupon/index',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
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
	                	'shop_id':$routeParams.shopId,
	                	'check_status':$("#checkType").val()
	                }
				}).success(function(res){
					console.log(res)
					if( res.status_code==200){
						$scope.shopList=res.data
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
			
	}).when("/shopStaff",{ //店员管理
		templateUrl:"page/shopStaff.html",
		controller: function($scope,$rootScope,$http,$routeParams){
			$rootScope.showLeft='show'
			$scope.userInfoType=JSON.parse(window.localStorage.getItem("shopUserInfo")).type
			console.log($scope.userInfoType)

			$scope.modalShow=false
			$scope.peopleBtn=function(type,p){
				console.log(type)
				$scope.peopleType=type
				$scope.modalShow=true
				console.log($scope.modalShow)
				if(type=='add'){
					$scope.addUserName=''
					$scope.addUserZh=''
					$scope.addUserTel=''

				}else{
					console.log(p)
					$scope.addUserName=p.user.realname
					$scope.addUserZh=p.user.username
					$scope.addUserTel=p.user.mobile
					$scope.uuId=p.id

		    		$scope.editUserGroup=p.power_info

				}

			}
			//  x新建 编辑 员工 确定
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
		            var num=0
		            $.each($('input[name=qxzName]:checkbox:checked'),function(){
		                // window.alert("你选了："+
		                // $('input[name=qxzName]:checked').length+"个，其中有："+$(this).val());
		                num=(Number(num)+Number($(this).val())).toFixed(0)
		            });

		            if($scope.peopleType=='add'){
		            	data={
		            		'realname':$scope.addUserName,
		            		'username':$scope.addUserZh,
		            		'power':num,
		            		'mobile':$scope.addUserTel,
	                		'shop_id':$routeParams.shopId
		            	}
		            	alertTExt='新建店员成功'
		            	$scope.ajaxMethod='post'
		    			$scope.ajaxUrl='busi/assistant/store'

		            }else{
		            	data={
		            		'realname':$scope.addUserName,
		            		'username':$scope.addUserZh,
		            		'power':num,
		            		'mobile':$scope.addUserTel,
	                		'shop_id':$routeParams.shopId,
		            		'shop_user_id':$scope.uuId
		            	}
		            	alertTExt='编辑店员成功'
		            	$scope.ajaxMethod='PATCH'
		    			$scope.ajaxUrl='busi/assistant/edit'
		            }

		            
		            $http({
						method:$scope.ajaxMethod,
						url :oUrl+$scope.ajaxUrl,
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
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
		    $scope.delmodalShow=false
		    $scope.delBtn=function(id){
		    	$scope.delmodalShow=true

		    	$scope.yesDel=function(){
		    		$http({
					method: "delete",
						url :oUrl+'busi/assistant/delete',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
						},
		                transformRequest: function (obj) {
		                    var str = [];
		                    for (var o in obj)
		                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
		                    return str.join("&");
		                },
		                params:{
		                	'shop_id':$routeParams.shopId,
		                	'trade_user_id':id
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
		    
		    $scope.resetmodalShow=false
		    $scope.resetBtn=function(id){
		    	$scope.resetmodalShow=true

		    	$scope.yesReset=function(){
		    		$http({
					method: "patch",
						url :oUrl+'busi/assistant/reset-password',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
						},
		                transformRequest: function (obj) {
		                    var str = [];
		                    for (var o in obj)
		                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
		                    return str.join("&");
		                },
		                params:{
		                	// 'shop_id':$routeParams.shopId,
		                	'shop_user_id':id
		                }
					}).success(function(res){
						console.log(res)
						if( res.status_code==200){
							groupToPages()
		    				$scope.resetmodalShow=false
		    				alert("密码重置成功")
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

		      // 商铺列表
		    function groupToPages() {
				$http({
					method: "get",
					url :oUrl+'busi/assistant/index',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
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
	                	'shop_id':$routeParams.shopId
	                }
				}).success(function(res){
					console.log(res)
					if( res.status_code==200){
						$scope.shopList=res.data
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
			
	}).when("/shopAd",{ //广告投放
		templateUrl:"page/shopAd.html",
		controller: function($scope,$rootScope,$http,$routeParams){
			$rootScope.showLeft='show'
			$scope.modalShow=false
			$scope.userInfoType=JSON.parse(window.localStorage.getItem("shopUserInfo")).type
			console.log($scope.userInfoType)

			$scope.wantDate=''
			$scope.newAdBtn=function(){
				$scope.modalShow=true
				$scope.wantDate=''
				$scope.cover_id=''
				$(".on").html("")

				$scope.saveShop=function(){
					if($scope.wantDate!=''&&$scope.cover_id!=''){
						$http({
							method: "post",
							url :oUrl+'busi/advertisement/store',
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded',
								'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
							},
			                transformRequest: function (obj) {
			                    var str = [];
			                    for (var o in obj)
			                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
			                    return str.join("&");
			                },
			                data:{
			                	'ad_id':$("#posWrap").val(),
			                	'shop_id':$routeParams.shopId,
			                	'use_date':$scope.wantDate,
			                	'cover_id':$scope.cover_id
			                }
						}).success(function(res){
							console.log(res)
							if( res.status_code==200){
								$scope.modalShow=false
								groupToPages()

								alert("提交成功")
							}
						}).error(function(res){
							if(res.status_code==422){
								alert(res.errors[0].error)
							}else{
								alert(res.errors)
							}
						});
					}else{
						if($scope.wantDate==''){
							alert("请输入想使用天数")
						}else{
							alert("请上传图片")
						}
					}
					
				}
			}

			position()
			function position() {
				$http({
					method: "get",
					url :oUrl+'busi/advertisement/ads/index',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
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
						$scope.posList=res.data
						for(var i=0;i<res.data.length;i++){
							$("#posWrap").append('<option value="'+res.data[i].id+'">'+res.data[i].name+'</option>')
						}
					}
				}).error(function(res){
					if(res.status_code==422){
						alert(res.errors[0].error)
					}else{
						alert(res.errors)
					}
				});
		    };

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

		      // 商铺列表
		    function groupToPages() {
				$http({
					method: "get",
					url :oUrl+'busi/advertisement/index',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
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
	                	'shop_id':$routeParams.shopId
	                }
				}).success(function(res){
					console.log(res)
					if( res.status_code==200){
						$scope.shopList=res.data
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

		    $("#posWrap").change(function(){
		    	$scope.cover_id=''
				$(".on").html("")
		    })

		    $("#image").change(function (e) {
		    	var formData = new FormData();
			 	formData.append('photo', $('#image')[0].files[0]);
			 	formData.append('ad_id', $("#posWrap").val());

		   		$.ajax({
				    url:oUrl+ 'busi/advertisement/image/upload',
				    type: 'POST',
				    cache: false,
				    data: formData,
				    headers: {
						'Content-Type': undefined,
						'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
					},
				    processData: false,
				    contentType: false
				}).success(function(res) {
					if(res.status_code==200){
						console.log(res)
						$scope.cover_id=res.data.id
						$(".on").html("<img src='"+res.data.path+"' alt='' style='width:100%;height:100%'>")
					}	
				}).done(function(res) {}).error(function(res) {
					console.log(res)
					if(res.responseJSON.status_code==422){
						alert(res.responseJSON.errors[0].error)
					}else{
						alert(res.responseJSON.errors)
					};
				});

			});	

		}
			
	}).when("/shopMoney",{ //资产统计
		templateUrl:"page/shopMoney.html",
		controller: function($scope,$rootScope,$http,$routeParams){
			$rootScope.showLeft='show'
			$scope.navType="nav1"
			console.log($scope.showLeft)
			$scope.changeNav=function(type){
				$scope.navType=type
			}

			$scope.userInfoType=JSON.parse(window.localStorage.getItem("shopUserInfo")).type
			console.log($scope.userInfoType)

			$scope.delmodalShow=false
			$scope.delBtn=function(){
				$scope.delmodalShow=true
			}
			$scope.closeBtnAlert=function(){
				$scope.delmodalShow=false
			}

			$scope.textTime=''

			var myDate = new Date();
			var nowY = myDate.getFullYear()-1;
			var nowM = myDate.getMonth()+1;
			nowM=nowM<10 ? "0" + nowM : nowM
			var nowD = myDate.getDate();
			nowD=nowD<10 ? "0"+ nowD : nowD

			var enddate = nowY+"-"+(nowM<10 ? "0" + nowM : nowM)+"-"+(nowD<10 ? "0"+ nowD : nowD);//当前日期
			console.log(enddate)

			getAll(nowY,nowM,nowD)

			$("#iWrap").html('<iframe id="mainIframe" style="width: 100%;height: 5rem" name="mainIframe" src="page/shopMoneyIframe.html?id='+$routeParams.shopId+'&time1='+nowY+'&time2='+nowM+'&time3='+nowD+'&dayType='+$("#dayType").val()+'" frameborder="0" scrolling="auto" ></iframe>')


			$scope.getTimefn=function(){
				if($scope.textTime!=''){
					console.log($scope.textTime.split("-"))
					var d=$scope.textTime.split("-")
					nowY=d[0]
					nowM=d[1]
					nowD=d[2]

					getAll(nowY,nowM,nowD)

					$("#iWrap").html('<iframe id="mainIframe" style="width: 100%;height: 5rem" name="mainIframe" src="page/shopMoneyIframe.html?id='+$routeParams.shopId+'&time1='+nowY+'&time2='+nowM+'&time3='+nowD+'&dayType='+$("#dayType").val()+'" frameborder="0" scrolling="auto" ></iframe>')
				}else{
					alert("请选择时间")
				}
			}

			function getAll(nowY,nowM,nowD){
				var begin_date
				if($("#dayType").val()=="month"){
					begin_date=nowY+"-"+nowM
				}else{
					begin_date=nowY+"-"+nowM+"-"+nowD
				}
				$.ajax({
					type: "get",
					url : oUrl+'busi/asset/statistic',
					async : false,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
					},
					data:{
						shop_id:$routeParams.shopId,
						begin_date:begin_date,
						date_type:$("#dayType").val()
					},
					success : function(res){
						console.log(res)
						if( res.status_code==200){
							$(".big").html(res.data.total_money)
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

		}
			
	}).when("/shopData",{ //数据统计
		templateUrl:"page/shopData.html",
		controller: function($scope,$rootScope,$http,$routeParams){
			$rootScope.showLeft='show'
			$scope.userInfoType=JSON.parse(window.localStorage.getItem("shopUserInfo")).type
			console.log($scope.userInfoType)
			var viewH = $(window).innerWidth();

			var start=get3MonthBefor()
			$scope.textTime=start
			$scope.monTime=start 

			var d=start.split("-")
			nowY=d[0]
			nowM=d[1]

			// getAll(start,3)
			$("#iWrap").html('<iframe id="mainIframe" style="width: 100%;height:18rem" name="mainIframe" src="page/shopDataIframe.html?viewH='+viewH+'&id='+$routeParams.shopId+'&time1='+nowY+'&time2='+nowM+'&dayType='+$("#dayType").val()+'" frameborder="0" scrolling="auto" ></iframe>')
			$("#iWrap2").html('<iframe id="mainIframe" style="width: 100%;height: 5rem" name="mainIframe" src="page/shopData2.html?viewH='+viewH+'&id='+$routeParams.shopId+'&time1='+nowY+'&time2='+nowM+'" frameborder="0" scrolling="auto" ></iframe>')


			// shopData2.html
			$scope.getTimefn=function(){
				if($scope.textTime!=''){
					var d=$scope.textTime.split("-")
					nowY=d[0]
					nowM=d[1]
					// getAll($scope.textTime,$("#dayType").val())
					$scope.monTime=$scope.textTime 
					$("#iWrap").html('<iframe id="mainIframe" style="width: 100%;height: 18rem" name="mainIframe" src="page/shopDataIframe.html?viewH='+viewH+'&id='+$routeParams.shopId+'&time1='+nowY+'&time2='+nowM+'&dayType='+$("#dayType").val()+'" frameborder="0" scrolling="auto" ></iframe>')
					
					$("#iWrap2").html('<iframe id="mainIframe" style="width: 100%;height: 5rem" name="mainIframe" src="page/shopData2.html?viewH='+viewH+'&id='+$routeParams.shopId+'&time1='+nowY+'&time2='+nowM+'" frameborder="0" scrolling="auto" ></iframe>')
					
				}else{
					alert("请选择时间")
				}
			}

			$scope.getTimefn2=function(){
				if($scope.monTime!=''){

					var d=$scope.textTime.split("-")
					startY=d[0]
					startM=d[1]
					var mon=$("#dayType").val()

					var numBol=Number(startM)+Number(mon)
					var endM,endY
					if(numBol>12){
						endM= Number(numBol)-13
						endY=Number(startY)+1
					}else{
						endM=Number(numBol)-1
						endY=startY
					}

					console.log(endY,endM)

					var nowMon=$scope.monTime.split("-")
					nowY=nowMon[0]
					nowM=nowMon[1]

					if((nowY==startY&&(nowM>startM||nowM==startM)&&(nowM<endM||nowM==endM) )||(nowY==endY&&(nowM<endM||nowM==endM)) ){
						
						$("#iWrap2").html('<iframe id="mainIframe" style="width: 100%;height:5rem" name="mainIframe" src="page/shopData2.html?viewH='+viewH+'&id='+$routeParams.shopId+'&time1='+nowY+'&time2='+nowM+'&dayType='+$("#dayType").val()+'" frameborder="0" scrolling="auto" ></iframe>')
						
					}else{
						alert("false")
					}

				
				}else{
					alert("请选择时间")
				}
			}



			function get3MonthBefor(){
			    var resultDate,year,month,date,hms;
			    var currDate = new Date();
			    year = currDate.getFullYear();
			    month = currDate.getMonth()+1;
			    date = currDate.getDate();
			    hms = currDate.getHours() + ':' + currDate.getMinutes() + ':' + (currDate.getSeconds() < 10 ? '0'+currDate.getSeconds() : currDate.getSeconds());
			    switch(month)
			    {
			      case 1:
			      case 2:
			      case 3:
			        month += 9;
			        year--;
			        break;
			      default:
			        month -= 3;
			        break;
			    }
			    month = (month < 10) ? ('0' + month) : month;
			    resultDate = year + '-'+month
			  return resultDate;
			}

			// $http({
			// 	method: "get",
			// 	url :oUrl+'busi/data/statistic',
			// 	headers: {
			// 		'Content-Type': 'application/x-www-form-urlencoded',
			// 		'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
			// 	},
   //              transformRequest: function (obj) {
   //                  var str = [];
   //                  for (var o in obj)
   //                      str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
   //                  return str.join("&");
   //              },
   //              params:{
   //              	shop_id:$routeParams.shopId
   //              }
			// }).success(function(res){
			// 	console.log(res)
			// 	if( res.status_code==200){
			// 	}
			// }).error(function(res){
			// 	if(res.status_code==422){
			// 		alert(res.errors[0].error)
			// 	}else{
			// 		alert(res.errors)
			// 	}
			// });
			
	
		}
			
	}).when("/mes",{ //信息提示
		templateUrl:"page/mes.html",
		controller: function($scope,$rootScope,$http){
			$rootScope.showLeft='show'
			
			$scope.mes=''

			$scope.sendBtn=function(){
				if($scope.mes!=''){
					$http({
						method: "post",
						url :oUrl+'busi/feedback/store',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
						},
		                transformRequest: function (obj) {
		                    var str = [];
		                    for (var o in obj)
		                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
		                    return str.join("&");
		                },
		                params:{
		                	message:$scope.mes
		                }
					}).success(function(res){
						console.log(res)
						if( res.status_code==200){
							alert("反馈成功")
						}
					}).error(function(res){
						if(res.status_code==422){
							alert(res.errors[0].error)
						}else{
							alert(res.errors)
						}
					});
				}else{
					alert("请填写反馈意见")
					
				}
			}

			$http({
				method: "get",
				url :oUrl+'busi/feedback/tel',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
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
					$scope.tel=res.data
				}
			}).error(function(res){
				if(res.status_code==422){
					alert(res.errors[0].error)
				}else{
					alert(res.errors)
				}
			});

			$scope.goHis=function(){
				$scope.show="page2"
				$scope.total_pages=1
				groupToPages()
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

		      // 商铺列表
		    function groupToPages() {
				$http({
					method: "get",
					url :oUrl+'busi/feedback/index',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
					},
	                transformRequest: function (obj) {
	                    var str = [];
	                    for (var o in obj)
	                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
	                    return str.join("&");
	                },
	                params:{
	                	'p':$scope.total_pages,
	                	'perPage':10
	                }
				}).success(function(res){
					console.log(res)
					if( res.status_code==200){
						$scope.shopList=res.data
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
			
	})
})
