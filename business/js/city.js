function getCity1(){
	var city
	$.ajax({
		type: "get",
		url : oUrl+'busi/common/province',
		async : false,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
		},
		success : function(res){
			console.log(res)
			if( res.status_code==200){
				city=res.data
			}else{    
	            if(res.status_code==422){
						alert(res.errors[0].error)
					}else{
						alert(res.errors)
					};
	        }

		
		},
	     error : function(res) {    
	           alert('网络故障');  
	     }  
	})
	return city
}

function getCity2(id){
	var city
	$.ajax({
		type: "get",
		url : oUrl+'busi/common/city',
		async : false,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
		},
		data:{
			parentid:id
		},
		success : function(res){
			console.log(res)
			if( res.status_code==200){
				city=res.data
			}else{    
	            if(res.status_code==422){
						alert(res.errors[0].error)
					}else{
						alert(res.errors)
					};
	        }

		
		},
	     error : function(res) {    
	           alert('网络故障');  
	     }  
	})
	return city
}

function getCity3(id){
	var city
	$.ajax({
		type: "get",
		url : oUrl+'busi/common/area',
		async : false,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization':'Bearer '+window.localStorage.getItem("shopToken")
		},
		data:{
			parentid:id
		},
		success : function(res){
			console.log(res)
			if( res.status_code==200){
				city=res.data
			}else{    
	            if(res.status_code==422){
						alert(res.errors[0].error)
					}else{
						alert(res.errors)
					};
	        }

		
		},
	     error : function(res) {    
	           alert('网络故障');  
	     }  
	})
	return city
}
function sendImg(e,img){
	var con
	 var formData = new FormData();
	 formData.append('photo',img);
			
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
			//// //console.log(res)
			if(res.status_code==200){
				console.log(res)
				con=res.data

				$(".on").html("<img src='"+res.data.path+"' alt='' dataid='"+res.data.id+"' style='width:100%;height:100%'>")
			}	
		}).done(function(res) {}).fail(function(res) {
			console.log(res)
			if(res.responseJSON.status_code==422){
				alert(res.responseJSON.errors[0].error)
			}else{
				alert(res.responseJSON.errors)
			};
		});
 	
}