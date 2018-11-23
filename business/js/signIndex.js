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

	$scope.manager=false
})

////////////////
shop.config(function($routeProvider){
	$routeProvider.when("/",{
		templateUrl:"page/sign.html",
		controller: function($scope,$rootScope,$http,$route){
			$rootScope.showLeft='none'
			if(window.localStorage.getItem("userInfo")==''||window.localStorage.getItem("userInfo")==undefined){
				location.href='#/'
			}
			$scope.userName=''
			$scope.userPass=''
			$scope.detailmodalShow=false
			$scope.pasShow=false
			$scope.modalShow=false

			$scope.bank_man=''
			$scope.bank_card=''
			$scope.bank_addr=''
			$scope.title=''

			$scope.signIn=function(){
				console.log($scope.userName)
				console.log($scope.userPass)
				if($scope.userName!=''&&$scope.userPass!=''){
					$http({
						method: "post",
						url :oUrl+'busi/login',
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
						console.log(res.data.is_finish)
						window.localStorage.setItem("shopToken",res.data.token)

						if(res.data.is_finish==0){ // 0  就代表没有完善商户信息  就必须调用完善接口
							$scope.modalShow=true

							$scope.perfect=function(){
								if($scope.bank_man!=''&&$scope.bank_card!=''&&$scope.bank_addr!=''&&$scope.title!=''){
									$http({
										method: "patch",
										url :oUrl+'busi/perfect',
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
						                	bank_man:$scope.bank_man,
											bank_card:$scope.bank_card,
											bank_addr:$scope.bank_addr,
											title:$scope.title,
						                }
									}).success(function(wsdata){
										console.log(wsdata)
										if( wsdata.status_code==200){
											$scope.modalShow=false
											alert("完善商户信息成功")


											if(res.data.is_reset==0){ // 需要重新设置密码
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

																$scope.mesList=res.data.information

																if($scope.mesList.length!=0){ // 有提示信息
																	$scope.detailmodalShow=true
																	$scope.yesBtn=function(){
																		getUser()
																	}
																}else{
																	getUser()
																}
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
											}else{
												$scope.mesList=res.data.information
												window.localStorage.setItem("shopToken",res.data.token)

												if($scope.mesList.length!=0){ // 有提示信息
													$scope.detailmodalShow=true
													$scope.yesBtn=function(){
														getUser()
													}
												}else{
													getUser()
												}
											}
										}
									}).error(function(wsdata){
										if(wsdata.status_code==422){
											alert(wsdata.errors[0].error)
										}else{
											alert(wsdata.errors)
										}
									});
								}else{
									alert("请将信息填写完整")
								}
							}
						}else{
							console.log(res.data.is_reset)
							if(res.data.is_reset==0){ // 需要重新设置密码
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

												$scope.mesList=res.data.information

												if($scope.mesList.length!=0){ // 有提示信息
													$scope.detailmodalShow=true
													$scope.yesBtn=function(){
														getUser()
													}
												}else{
													getUser()
												}
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
							}else{
								$scope.mesList=res.data.information
								window.localStorage.setItem("shopToken",res.data.token)

								if($scope.mesList.length!=0){ // 有提示信息
									$scope.detailmodalShow=true
									$scope.yesBtn=function(){
										getUser()
									}
								}else{
									getUser()
								}
							}
							
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

			function getUser(){
				$http({
					method: "get",
					url :oUrl+'busi/users',
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
	                params:{
	                	'username':$scope.userName,
	                	'password':$scope.userPass
	                }
				}).success(function(res2){
					console.log(res2)
					if( res2.status_code==200){
						console.log(res2.data.type)
						window.localStorage.setItem("shopUserInfo",JSON.stringify(res2.data));
						var goHref
						if(res2.data.type=='super'||res2.data.type=='trade_employee'){ // 超级用户 集团 店长
							if(res2.data.power_info.OVERVIEW_SYS){ // 概览
								goHref='#/overView'
							}else{
								if(res2.data.power_info.SHOP_SYS){ // 店铺管理
									goHref='#/staff'
								}else{
									if(res2.data.power_info.WITHDRAW_SYS){ // 提现管理
										goHref='#/postr'
									}else{
										if(res2.data.power_info.EMPLOYEE_SYS){ // 员工管理
											goHref='#/merchant'
										}else{
											if(res2.data.power_info.STORE_STATISTIC){ // 门店统计
												goHref='#/store'
											}else{
												if(res2.data.power_info.INFORMATION_FEEDBACK){ // 信息反馈
													goHref='#/mes'
												}
											}
										}
									}
								}
							}
						}else if(res2.data.type=='shop_manager'){ //店长
							goHref='#/shglManger'
							console.log("dianzhang")
						}else if(res2.data.type=='shop_employee'){ //店员
							console.log(res2.data)
							if(res2.data.shop_info.power_info.DECORATION_SYS){ //装修
								goHref='#/shopRenovation?shopId='+res2.data.shop_info.id
							}else if(res2.data.shop_info.power_info.COUPON_SYS){ // 优惠券
								goHref='#/shopCoupon?shopId='+res2.data.shop_info.id
							}else if(res2.data.shop_info.power_info.SHOP_ASSISTANT){ // 店员管理
								goHref='#/shopStaff?shopId='+res2.data.shop_info.id
							}else if(res2.data.shop_info.power_info.ADVERTISEMENT_SYS){ // 投放广告
								goHref='#/shopAd?shopId='+res2.data.shop_info.id
							}else if(res2.data.shop_info.power_info.ASSET_STATISTIC){ // 资产统计
								goHref='#/shopMoney?shopId='+res2.data.shop_info.id
							}else if(res2.data.shop_info.power_info.DATA_STATISTIC){ //数据统计
								goHref='#/shopData?shopId='+res2.data.shop_info.id
							}
							
							// goHref='#/shopRenovation?shopId='+res2.data.shop_info.id
						}
						// $route.reload()
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
		}
	}).when("/register",{
		templateUrl:"page/register.html",
		controller: function($scope,$rootScope,$http){
			$rootScope.showLeft='none'
			$scope.username=''
			$scope.password=''

			$scope.signIn=function(){
				if($scope.username!=''&&$scope.password!=''){
					$http({
						method: "post",
						url :oUrl+'busi/register',
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
		                	username:$scope.username,
		                	password:$scope.password
		                }
					}).success(function(res){
						console.log(res)
						if( res.status_code==200){
							alert("注册成功")
						}
					}).error(function(res){
						if(res.status_code==422){
							alert(res.errors[0].error)
						}else{
							alert(res.errors)
						}
					});
				}else{
					if($scope.username==''){
						alert("请输入账号")
					}else{
						alert("请输入密码")
					}
				}
			}
			
		}
	})
})
