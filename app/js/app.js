
// VARIABLES
var user="";
var pass="";

var main="";
var repo="";

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
		"VPPC":1,
		"VPACMA":1,
		"VCS":1,
		"VERC":1,
		"VDIALEG":1,
		"VCUP":1,
		"VPUMJUST":1,
		"VCOM":1,
		"VJXC":1,
		"VFAMILIA":1,
		"VRECORTES":1,
		"VDN":1,
		"VPFIV":1,
		"VCONVER":1,
		"VUNIDOS":1,
		"VCILUS":0
	},
	"TARRAGONA":{
		"VPSC":1,
		"VPPC":1,
		"VPACMA":1,
		"VCS":1,
		"VERC":1,
		"VDIALEG":1,
		"VCUP":1,
		"VPUMJUST":1,
		"VCOM":1,
		"VJXC":1,
		"VFAMILIA":0,
		"VRECORTES":1,
		"VDN":0,
		"VPFIV":0,
		"VCONVER":0,
		"VUNIDOS":0,
		"VCILUS":0
	},
	"LLEIDA":{
		"VPSC":1,
		"VPPC":1,
		"VPACMA":1,
		"VCS":1,
		"VERC":1,
		"VDIALEG":1,
		"VCUP":1,
		"VPUMJUST":1,
		"VCOM":1,
		"VJXC":1,
		"VFAMILIA":0,
		"VRECORTES":1,
		"VDN":0,
		"VPFIV":0,
		"VCONVER":0,
		"VUNIDOS":0,
		"VCILUS":0
	},
	"GIRONA":{
		"VPSC":1,
		"VPPC":1,
		"VPACMA":1,
		"VCS":1,
		"VERC":1,
		"VDIALEG":1,
		"VCUP":1,
		"VPUMJUST":1,
		"VCOM":1,
		"VJXC":1,
		"VFAMILIA":0,
		"VRECORTES":1,
		"VDN":0,
		"VPFIV":0,
		"VCONVER":0,
		"VUNIDOS":0,
		"VCILUS":1
	}
}

var camps=[
	"VPSC",
	"VPPC",
	"VPACMA",
	"VCS",
	"VERC",
	"VDIALEG",
	"VCUP",
	"VPUMJUST",
	"VCOM",
	"VJXC",
	"VFAMILIA",
	"VRECORTES",
	"VDN",
	"VPFIV",
	"VCONVER",
	"VUNIDOS",
	"VCILUS",
	"VBLANCS",
	"VNULS",
	"VTOTAL"
];

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
				var data=jqXHR.status+": "+jqXHR.statusText;
				loading(false);
				console_log(data);
				if(data=="404: Not Found") {
					$("#mesa").parent().addClass("hidden");
					$("#dades").parent().addClass("hidden");
					$("#tabs").parent().addClass("hidden");
					erroruser();
				} else {
					errordata(data);
				}
			}
		});
	} else {
		$("#mesa").parent().addClass("hidden");
		$("#dades").parent().addClass("hidden");
		$("#tabs").parent().addClass("hidden");
	}
});

$("#mesa").on("change",function() {
	var val=$("#mesa").val();
	val=val.split(";");
	provincia=val[0];
	municipi=val[1];
	escola=val[2];
	mesa=val[3];
	main=val[4];
	repo=val[5];
	$("#dades").parent().removeClass("hidden");
	$("#dades").html(val.slice(0,4).join("\n"));
	$("#tabs").parent().removeClass("hidden");
	maketab1(provincia);
	$('#tabs a:first').tab('show');
})

$("#enviar1").on("click",function() {
	user=$("#user").val();
	pass=$("#pass").val();
	filename=""+provincia+"/"+municipi+"/"+escola+"/"+mesa+"/"+"resultats.txt";
	message="Resultats: usuari "+user+", provincia "+provincia+", municipi "+municipi+", escola "+escola+", mesa "+mesa;
	var line2=[];
	for(var i in camps) line2[i]=$("#"+camps[i]).val();
	content=btoa([camps.join(";"),line2.join(";")].join("\n"));
	makeall(function() {
		for(var i in camps) $("#"+camps[i]).val("").parent().removeClass("has-success has-error");
		$("#enviar1").attr("disabled","disabled");
	});
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
		makeall(function() {
			$("#camera").val("");
			$("#preview").prop("src","images/camera.jpg");
			$("#enviar2").attr("disabled","disabled");
		});
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
	makeall(function() {
		$("#content").val("");
		$("#enviar3").attr("disabled","disabled");
	});
});

$(".form-21d").on("change",function() {
	var key=$(this).attr("id");
	var val=$(this).val();
	var error=0;
	if(val!="") {
		if(isNaN(val)) error=1;
		if(!Number.isInteger(parseFloat(val))) error=1;
		if(parseInt(val)<0) error=1;
		if(key=="VTOTAL") {
			var total=0;
			for(var i in camps) {
				var key2=camps[i];
				var val2=$("#"+camps[i]).val();
				if(key2!="VTOTAL" && val2!="") {
					total+=parseInt(val2);
				}
			}
			if(total!=parseInt(val)) error=1;
		}
	}
	if(error) {
		$(this).parent().removeClass("has-success");
		$(this).parent().addClass("has-error");
	} else {
		$(this).parent().removeClass("has-error");
		if(val!="") {
			$(this).parent().addClass("has-success");
			$(this).val(parseInt(val));
		} else {
			$(this).parent().removeClass("has-success");
		}
	}
	// SECOND ITER
	var error=0;
	var hasdata=0;
	var hastotal=0;
	for(var i in camps) {
		if($("#"+camps[i]).parent().hasClass("has-error")) {
			error=1;
		}
		if($("#"+camps[i]).val()!="") {
			hasdata=1;
		}
	}
	if($("#VTOTAL").val()!="") {
		hastotal=1;
	}
	if(!error && hasdata && hastotal) {
		$("#enviar1").removeAttr("disabled");
	} else {
		$("#enviar1").attr("disabled","disabled");
	}
	// CONTINUE
	if(key!="VTOTAL") $("#VTOTAL").trigger("change");
});

$("#camera").on("change",function() {
	var file=$("#camera").get(0).files[0];
	var blob=URL.createObjectURL(file);
	$("#preview").prop("src",blob);
	$("#enviar2").removeAttr("disabled");
});

$("#camera2").on("click",function() {
	$("#camera").trigger("click");
});

$("#content").on("change",function() {
	if($(this).val()!="") {
		$("#enviar3").removeAttr("disabled");
	} else {
		$("#enviar3").attr("disabled","disabled");
	}
});

$("#debug").on("change",function() {
	if($(this).is(":checked")) {
		$("#log").parent().removeClass("hidden");
		$(this).parent().addClass("debug3");
	} else {
		$("#log").parent().addClass("hidden");
		$(this).parent().removeClass("debug3");
	}
});

// FUNCIONS
function makeall(fn) {
	loading(true);
	fork(function() {
		console_log("fork done");
		upload(function() {
			console_log("upload done");
			pullreq(function() {
				loading(false);
				console_log("pullreq done");
				fn();
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
			if(data=="401: Unauthorized") {
				errorpass();
			} else {
				errordata(data);
			}
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
													errordata(data);
												}
											);
										},
										function(data) {
											loading(false);
											console_log(data);
											errordata(data);
										}
									);
								},
								function(data) {
									loading(false);
									console_log(data);
									errordata(data);
								}
							);
						},
						function(data) {
							loading(false);
							console_log(data);
							errordata(data);
						}
					);
				},
				function(data) {
					loading(false);
					console_log(data);
					errordata(data);
				}
			);
		},
		function(data) {
			loading(false);
			console_log(data);
			errordata(data);
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
			if(data=="422: Unprocessable Entity") {
				fn();
			} else {
				errordata(data);
			}
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
			var data=jqXHR.status+": "+jqXHR.statusText;
			error(data);
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

function modal(title,body) {
	$('#modal .modal-title').html(title);
	$('#modal .modal-body p').html(body);
	$('#modal').modal("show");
}

function erroruser() {
	modal("Atenció!!!","El nom d'usuari que has entrat no existeix. Si el problema persisteix, per favor, posat en contacte amb algú de suport");
}

function errorpass() {
	modal("Atenció!!!","La clau de github que has entrat no es correcte. Si el problema persisteix, per favor, posat en contacte amb algú de suport");
}

function errordata(data) {
	modal("Atenció!!!","S'ha produit l'error "+data+". Si el problema persisteix, per favor, posat en contacte amb algú de suport");
}
