
// VARIABLES
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

var provincia="";
var municipi="";
var escola="";
var mesa="";

// EXTRES
var candidatures={
	"BARCELONA":{
		"VPSC":1,
		"VPP":1,
		"VPACMA":1,
		"VCS":1,
		"VERC":1,
		"VDIALEG":1,
		"VCUP":1,
		"VPUM":1,
		"VCATCOMU":1,
		"VJUNTS":1,
		"VFAMILIA":1,
		"VRECORTES":1,
		"VDN":1,
		"VPFIV":1,
		"VCNV":1,
		"VUNIDOS":1,
		"VCILUS":0
	},
	"TARRAGONA":{
		"VPSC":1,
		"VPP":1,
		"VPACMA":1,
		"VCS":1,
		"VERC":1,
		"VDIALEG":1,
		"VCUP":1,
		"VPUM":1,
		"VCATCOMU":1,
		"VJUNTS":1,
		"VFAMILIA":0,
		"VRECORTES":1,
		"VDN":0,
		"VPFIV":0,
		"VCNV":0,
		"VUNIDOS":0,
		"VCILUS":0
	},
	"LLEIDA":{
		"VPSC":1,
		"VPP":1,
		"VPACMA":1,
		"VCS":1,
		"VERC":1,
		"VDIALEG":1,
		"VCUP":1,
		"VPUM":1,
		"VCATCOMU":1,
		"VJUNTS":1,
		"VFAMILIA":0,
		"VRECORTES":1,
		"VDN":0,
		"VPFIV":0,
		"VCNV":0,
		"VUNIDOS":0,
		"VCILUS":0
	},
	"GIRONA":{
		"VPSC":1,
		"VPP":1,
		"VPACMA":1,
		"VCS":1,
		"VERC":1,
		"VDIALEG":1,
		"VCUP":1,
		"VPUM":1,
		"VCATCOMU":1,
		"VJUNTS":1,
		"VFAMILIA":0,
		"VRECORTES":1,
		"VDN":0,
		"VPFIV":0,
		"VCNV":0,
		"VUNIDOS":0,
		"VCILUS":1
	}
}

// EVENTS
$("#user,#pass").on("change",function() {
	user=$("#user").val();
	pass=$("#pass").val();
	if(user!="" && pass!="") {
		var hash=md5(user);
		loading(true);
		$.ajax({
			url: "data/"+hash+".txt",
			success: function(data,textStatus,jqXHR) {
				loading(false);
				$("#mesa").parent().removeClass("hidden");
				data=data.split("\n");
				$("#mesa option").remove();
				for(var i in data) {
					var val=data[i].split(";");
					$("#mesa").append("<option value=\""+data[i]+"\">"+val[3]+"</option>");
				}
				$("#mesa").val($("#mesa option:first").val()).trigger("change");
			},
			error: function(jqXHR,textStatus,errorThrown){
				loading(false);
				$("#mesa option").remove();
				$("#mesa").parent().addClass("hidden");
				$("#mesa").trigger("change");
			}
		});
	}
});

$("#mesa").on("change",function() {
	var val=$("#mesa").val();
	if(val) {
		var val=val.split(";");
		provincia=val[0];
		municipi=val[1];
		escola=val[2];
		mesa=val[3];
		$("#dades").parent().removeClass("hidden");
		$("#dades").html(val.join("\n"));
		$("#tabs").parent().removeClass("hidden");
		maketab1(provincia);
	} else {
		$("#dades").parent().addClass("hidden");
		$("#tabs").parent().addClass("hidden");
	}
})

$("#enviar1").on("click",function() {
	user=$("#user").val();
	pass=$("#pass").val();
	filename=""+provincia+"/"+municipi+"/"+escola+"/"+mesa+"/"+"resultats.txt";
	message="Resultats: usuari "+user+", provincia "+provincia+", municipi "+municipi+", escola "+escola+", mesa "+mesa;
	content=[];
	var camps=["VPSC","VPP","VPACMA","VCS","VERC","VDIALEG","VCUP","VPUM","VCATCOMU","VJUNTS","VFAMILIA","VRECORTES","VDN","VPFIV","VCNV","VUNIDOS","VCILUS","VBLANC","VNULS","VTOTAL"];
	for(var i in camps) content[i]=$("#"+camps[i]).val();
	content=btoa(content.join(";"));
	makeall();
});

$("#camera").on("change",function() {
	var file=$("#camera").get(0).files[0];
	var blob=URL.createObjectURL(file);
	$("#preview").prop("src",blob);
});

$("#camera2").on("click",function() {
	$("#camera").trigger("click");
});

$("#enviar2").on("click",function() {
	user=$("#user").val();
	pass=$("#pass").val();
	filename=""+provincia+"/"+municipi+"/"+escola+"/"+mesa+"/"+"acta.jpg";
	message="Actes: usuari "+user+", provincia "+provincia+", municipi "+municipi+", escola "+escola+", mesa "+mesa;
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

$("#enviar3").on("click",function() {
	user=$("#user").val();
	pass=$("#pass").val();
	filename=""+provincia+"/"+municipi+"/"+escola+"/"+mesa+"/"+"incidencia-"+date("YmdHis")+".txt";
	message="Incidencies: usuari "+user+", provincia "+provincia+", municipi "+municipi+", escola "+escola+", mesa "+mesa;
	content=btoa($("#content").val());
	makeall();
});

// FUNCIONS
function makeall() {
	loading(true);
	fork(function() {
		console_log("fork done");
		upload(function() {
			console_log("upload done");
			pullreq(function() {
				loading(false);
				console_log("pullreq done");
			});
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
			loading(false);
			console_log(data);
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
													loading(false);
													console_log(data);
												}
											);
										},
										function(data) {
											loading(false);
											console_log(data);
										}
									);
								},
								function(data) {
									loading(false);
									console_log(data);
								}
							);
						},
						function(data) {
							loading(false);
							console_log(data);
						}
					);
				},
				function(data) {
					loading(false);
					console_log(data);
				}
			);
		},
		function(data) {
			loading(false);
			console_log(data);
		}
	);
}

function pullreq(fn) {
	curl(
		user,
		pass,
		"https://api.github.com/repos/"+main+"/"+repo+"/pulls",
		JSON.stringify({
			"title": message,
			"head": user+":master",
			"base":"master"
		}),
		"POST",
		function(data) {
			fn();
		},
		function(data) {
			loading(false);
			console_log(data);
		}
	);
}

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
			success(data);
		},
		error: function(jqXHR,textStatus,errorThrown){
			error(jqXHR.status+": "+jqXHR.statusText);
		}
	});
}

function console_log(text) {
	$("#log").parent().removeClass("hidden");
	$("#log").append(text+"\n");
}

function loading(bool) {
	if(bool) $(".loading").show();
	if(!bool) $(".loading").hide();
}

function maketab1(provincia) {
	if(candidatures.hasOwnProperty(provincia)) {
		for(var i in candidatures[provincia]) {
			var key=i;
			var val=candidatures[provincia][i];
			if(val) {
				$("#"+key).parent().removeClass("hidden");
			} else {
				$("#"+key).parent().addClass("hidden");
			}
		}
	}
}
