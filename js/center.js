$(document).ready(function() {
	initialize();
});

function initialize() {
	defaultStyle();
	fetch('/order.html')
		.then(response => response.text())
		.then(data => {
			document.getElementById('iframe-content').innerHTML = data;
			// 确保order.js在内容加载后执行
			var script = document.createElement('script');
			script.src = "js/order.js";
			document.body.appendChild(script);
			getUseTutorialLink();
			getIdShareUrl();
			getSubscribeUrlName();
			fetchUserData();
			current_order(); // 假设current_order函数在全局作用域可用
		})
		.catch(error => console.error('Error loading the content:', error));
}

function price() {
	fetch('/price.html')
		.then(response => response.text())
		.then(data => {
			getProductList();
			$("#nsk-body-left").css("border-right", "none");
			// $('#nsk-body').css('background-color', 'mediumaquamarine'); // 你可以替换 '#f0f0f0' 为你想要的颜色代码 floralwhite
			$('#nsk-right-panel-container').hide();
			document.getElementById('iframe-content').innerHTML = data;
			
		})
		.catch(error => console.error('Error loading the content:', error));
}

function account() {
	defaultStyle();
	fetch('/account.html')
		.then(response => response.text())
		.then(data => {
			document.getElementById('iframe-content').innerHTML = data;
			var script = document.createElement('script');
			script.src = "js/order.js";
			document.body.appendChild(script);
			getAccountList();
		})
		.catch(error => console.error('Error loading the content:', error));
}
function bill() {
	fetch('/bill.html')
		.then(response => response.text())
		.then(data => {
			$('#nsk-body').css('background-color', 'white');
			$("#nsk-body-left").css("border-right", "none");
			$('#nsk-right-panel-container').hide();
			document.getElementById('iframe-content').innerHTML = data;
			getBillList();
		})
		.catch(error => console.error('Error loading the content:', error));
}
function defaultStyle() {
	$('#nsk-right-panel-container').show();
	$('#nsk-body').css('background-color', 'white');
	$("#nsk-body-left").css("border-right", "");
}