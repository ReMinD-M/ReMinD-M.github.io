$(document).ready(function() {
	defaultStyle();
	console.log('center_default',getCookieValue("center_default"));
	if(getCookieValue("center_default")=="price")
	{
		price();
	}
	else if(getCookieValue("center_default")=="initialize")
	{
		initialize();
	}
	else if(getCookieValue("center_default")=="account")
	{
		account();
	}
	else if(getCookieValue("center_default")=="bill")
	{
		bill();
	}
	else
	{
		setCookie("center_default", "initialize", 7);
		initialize();
	}

});
function bindData(){
	getUseTutorialLink();
	getIdShareUrl();
	getSubscribeUrlName();
	fetchUserData();
}
function initialize() {
	// defaultStyle();
	setCookie("center_default", "initialize", 7);
	fetch('/order.html')
		.then(response => response.text())
		.then(data => {
			document.getElementById('iframe-content').innerHTML = data;
			// 确保order.js在内容加载后执行
			var script = document.createElement('script');
			script.src = "js/order.js";
			document.body.appendChild(script);
			bindData();
			current_order(); // 假设current_order函数在全局作用域可用
		})
		.catch(error => console.error('Error loading the content:', error));
}

function price() {
	setCookie("center_default", "price", 7);
	fetch('/price.html')
		.then(response => response.text())
		.then(data => {
			getProductList();
			$("#nsk-body-left").css("border-right", "none");
			// $('#nsk-body').css('background-color', 'mediumaquamarine'); // 你可以替换 '#f0f0f0' 为你想要的颜色代码 floralwhite
			$('#nsk-right-panel-container').hide();
			document.getElementById('iframe-content').innerHTML = data;
			bindData();
			
		})
		.catch(error => console.error('Error loading the content:', error));
}

function account() {
	// defaultStyle();
	setCookie("center_default", "account", 7);
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
	setCookie("center_default", "bill", 7);
	fetch('/bill.html')
		.then(response => response.text())
		.then(data => {
			$('#nsk-body').css('background-color', 'white');
			$("#nsk-body-left").css("border-right", "none");
			$('#nsk-right-panel-container').hide();
			document.getElementById('iframe-content').innerHTML = data;
			bindData();
			getBillList();
		})
		.catch(error => console.error('Error loading the content:', error));
}
function defaultStyle() {
	$('#nsk-right-panel-container').show();
	$('#nsk-body').css('background-color', 'white');
	$("#nsk-body-left").css("border-right", "");
}