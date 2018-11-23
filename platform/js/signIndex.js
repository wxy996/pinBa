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
				location.href='#/'
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
	$routeProvider.when("/",{
		templateUrl:"page/sign.html",
		controller: function($scope,$rootScope,$http){
			$rootScope.showLeft='none'
			if(window.localStorage.getItem("userInfo")==''||window.localStorage.getItem("userInfo")==undefined){
				location.href='#/'
			}
			$scope.userName=''
			$scope.userPass=''
			$scope.signIn=function(){
				console.log($scope.userName)
				console.log($scope.userPass)
				if($scope.userName!=''&&$scope.userPass!=''){
					$http({
						method: "post",
						url :oUrl+'plat/login',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
		                transformRequest: function (obj) {
		                    var str = [];
		                    for (var o in obj)
		                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
		                    return str.join("&");
		                },
		                data:{
		                	'username':$scope.userName,
		                	'password':$scope.userPass
		                }
					}).success(function(res){
						console.log(res.status)
						window.localStorage.setItem("token",res.data.token)


						window.localStorage.setItem("leftInfoPt",JSON.stringify(res.data.power_info));
						var goHref
						if(res.data.power_info.OVERVIEW_SYS){ // 概览
							goHref='#/overView'
						}else{
							if(res.data.power_info.OVERVIEW_SYS){ // 员工管理
								goHref='#/staff'
							}else{
								if(res.data.power_info.AD_CHECK){ // 广告审核
									goHref='#/postr'
								}else{
									if(res.data.power_info.BUSINESS_SYS){ // 商铺管理
										goHref='#/merchant'
									}else{
										if(res.data.power_info.WITHDRAW_SYS){ // 提现管理
											goHref='#/putForward'
										}else{
											if(res.data.power_info.PUSH_SYS){ // 地推管理
												goHref='#/earthPush'
											}else{
												if(res.data.power_info.USER_CLIENT_SYS){ // 账号管理
													goHref='#/account'
												}else{
													if(res.data.power_info.TRADE_SYS){ // 交易信息
														goHref='#/transaction'
													}else{
														if(res.data.power_info.SUGGEST_SYS){ // 用户反馈
															goHref='#/feedback'
														}else{
															if(res.data.power_info.AD_SYS){ // 广告管理
																goHref='#/ad'
															}else{
																if(res.data.power_info.INFORMATION_SYS){ // 信息提示
																	goHref='#/mes'
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}

						if( res.status_code==200){
							$http({
								method: "get",
								url :oUrl+'plat/users',
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded',
									'Authorization':'Bearer '+res.data.token,
								},
				                transformRequest: function (obj) {
				                    var str = [];
				                    for (var o in obj)
				                        str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
				                    return str.join("&");
				                },
				                params:{
				                	'username':$scope.userName,
				                	'password':$scope.userPass
				                }
							}).success(function(res2){
								console.log(res2)
								if( res2.status_code==200){
									console.log(res2.data)
									window.localStorage.setItem("userInfo",JSON.stringify(res2.data));
									// window.location.reload()
									location.href='index.html'+goHref
								}
							}).error(function(res2){

								if(res2.status_code==422){
									alert(res2.errors[0].error)
								}else{
									alert(res2.errors)
								}
							});
				        }
					}).error(function(res){

						if(res.status_code==422){
							alert(res.errors[0].error)
						}else{
							alert(res.errors)
						}
					});
				}else{
					if($scope.userName==''){
						alert("请输入姓名")
						return false
					}else{
						alert("请输入密码")
						return false
					}
				}
			}
		}
	})
})