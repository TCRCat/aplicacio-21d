
var user="";
var pass="";
var main="josepsanzcamp";
var repo="test-21d";
var sha1=""; // old object
var sha2=""; // old tree
var sha3=""; // new blob
var sha4=""; // new tree
var sha5=""; // new object
var content="";
var filename="";
var message="";

$("#button1").on("click",function() {
	user=$("#user").val();
	pass=$("#pass").val();
	filename=$("#filename").val();
	message=$("#message").val();
	content=btoa($("#content").val());
	makeall();
});

$("#button2").on("click",function() {
	user=$("#user").val();
	pass=$("#pass").val();
	filename=$("#filename").val();
	message=$("#message").val();
	var file=$("#camera").get(0).files[0];
	var reader=new FileReader();
	reader.onload=function(data) {
		content=btoa(data.target.result);
		makeall();
	};
	reader.onerror=function() {
		console_log("error");
	};
	reader.readAsBinaryString(file);
});

$("#camera").on("change",function() {
	var file=$("#camera").get(0).files[0];
	var blob=URL.createObjectURL(file);
	$("#preview").prop("src",blob);
});

$("#camera2").on("click",function() {
	$("#camera").trigger("click");
});

function makeall() {
	loading(true);
	fork(function() {
		console_log("fork done");
		upload(function() {
			console_log("upload done");
			loading(false);
		});
	});
}

function fork(fn) {
	curl(
		user,
		pass,
		"https://api.github.com/repos/"+main+"/"+repo+"/forks",
		"",
		"POST",
		function(data) {
			fn();
		},
		function(data) {
			console_log(data);
			loading(false);
		}
	);
}

function upload(fn) {
	curl(
		user,
		pass,
		"https://api.github.com/repos/"+user+"/"+repo+"/git/refs/heads/master",
		"",
		"GET",
		function(data) {
			sha1=data.object.sha;
			console_log("sha1="+sha1);
			curl(
				user,
				pass,
				"https://api.github.com/repos/"+user+"/"+repo+"/git/commits/"+sha1,
				"",
				"GET",
				function(data) {
					sha2=data.tree.sha;
					console_log("sha2="+sha2);
					curl(
						user,
						pass,
						"https://api.github.com/repos/"+user+"/"+repo+"/git/blobs",
						JSON.stringify({
							"content":content,
							"encoding":"base64"
						}),
						"POST",
						function(data) {
							sha3=data.sha;
							console_log("sha3="+sha3);
							curl(
								user,
								pass,
								"https://api.github.com/repos/"+user+"/"+repo+"/git/trees",
								JSON.stringify({
									"base_tree": sha2,
									"tree": [{
										"path": filename,
										"mode": "100644",
										"type": "blob",
										"sha": sha3
									}]
								}),
								"POST",
								function(data) {
									sha4=data.sha;
									console_log("sha4="+sha4);
									curl(
										user,
										pass,
										"https://api.github.com/repos/"+user+"/"+repo+"/git/commits",
										JSON.stringify({
											"parents": [sha1],
											"tree": sha4,
											"message": message
										}),
										"POST",
										function(data) {
											sha5=data.sha;
											console_log("sha5="+sha5);
											curl(
												user,
												pass,
												"https://api.github.com/repos/"+user+"/"+repo+"/git/refs/heads/master",
												JSON.stringify({
													"ref": "refs/heads/master",
													"sha": sha5
												}),
												"POST",
												function(data) {
													fn();
												},
												function(data) {
													console_log(data);
													loading(false);
												}
											);
										},
										function(data) {
											console_log(data);
											loading(false);
										}
									);
								},
								function(data) {
									console_log(data);
									loading(false);
								}
							);
						},
						function(data) {
							console_log(data);
							loading(false);
						}
					);
				},
				function(data) {
					console_log(data);
					loading(false);
				}
			);
		},
		function(data) {
			console_log(data);
			loading(false);
		}
	);
}

//~ function pullrequest(fn) {
	//~ curl(
		//~ user,
		//~ pass,
		//~ "https://api.github.com/repos/"+user+"/"+repo+"/git/refs/heads/master",
		//~ "",
		//~ "GET",
		//~ function(data) {
			//~ fn();
		//~ },
		//~ function(data) {
			//~ console_log(data);
		//~ }
	//~ );
//~ }

function curl(user,pass,url,data,method,success,error) {
	$.ajax({
		url: url,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", "Basic " + btoa(user+":"+pass));
		},
		type: method,
		dataType: "json",
		contentType: "application/json",
		processData: false,
		data: data,
		success: function(data,textStatus,jqXHR) {
			//~ alert(JSON.stringify(data));
			success(data);
		},
		error: function(jqXHR,textStatus,errorThrown){
			//~ alert(textStatus);
			error(textStatus);
		}
	});
}

function console_log(text) {
	$("#log").append(text+"\n");
}

function loading(bool) {
	if(bool) $(".loading").show();
	if(!bool) $(".loading").hide();
}
