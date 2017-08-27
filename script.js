var desc1Opened = 0;

function openNav() {
	document.getElementById("mySidenav").style.width = "250px";
	document.getElementById("main").style.marginLeft = "250px";
	document.body.style.backgroundColor = "rgba(0,0,0,1)";
}

function closeNav() {
	document.getElementById("mySidenav").style.width = "0";
	document.getElementById("main").style.marginLeft= "0";
	document.body.style.backgroundColor = "black";
}

function createDesc1() {
	if(desc1Opened == 0) {
		document.getElementById('die').insertAdjacentHTML('beforebegin', '<p class="descriptions">paragraph 2</p>');
	}
	desc1Opened = 1;
}