lookAhead = localStorage.lookAhead || "tut";
localStorage.lookAhead = lookAhead;
localStorage.firstP = localStorage.firstP || "pink";
localStorage.w= localStorage.w || 7;
localStorage.h = localStorage.h || 9;
localStorage.anti = localStorage.anti || false;
blinkers = [];
yblinkers =[];
exclx = -1;
excly = -1;
function g(x){
	return document.getElementById(x);
}
function good(r,c){
	var cp = ""+board[r][c];
	if(r>0){
		if(board[r-1][c]+""==cp)return true;
	}
	if(c>0){
		if(board[r][c-1]+""==cp)return true;
	}
	if(r+1<board.length){
		if(board[r+1][c]+""==cp)return true;
	}
	if(c+1<board[0].length){
		if(board[r][c+1]+""==cp)return true;
	}
}
function handleSplash(){
	var t = g("title");
	var size = 100;
    t.style.fontSize = size+"pt";
	setTimeout(function(){
	g("splash").innerHTML="";
	g("splash").style.display = "none";},2500);
	
}
//alert("script");
window.onload = function(){
	setTimeout(function(){
	//handleSplash();
	animating = "up";
	winw = window.innerWidth;
    winh = window.innerHeight;
	document.body.height=winh;
	document.body.width=winw;
	mtog = g("menutoggle");
	menu = g("menu");
	mtog.style.width= winw*0.2+"px";
	mtog.style.height=winh*0.065+"px";
	mtog.style.left = winw*0.4+"px";
	mtog.style.bottom = "0px";
	menu.style.bottom = "0px";
	menu.style.height= "0px";
	menu.style.width = winw*2/3+"px";
	menu.style.left = winw*(0.5-(2/3)/2)+"px";
	menu.style.display = "none";
	menuhtm = menu.innerHTML;
	//alert("ready");
	//alert(sum([1,2,3,4]));
	mtog.ontouchstart = menuOn;
	grid = g("grid");
	g("info").ontouchstart= function(){};
	h = 9;
	w = 7;
	var hml = "";
	board = [];
	var wid = (window.innerWidth/w)*0.85-4+"px;";
	grid.style.height = wid*w+"px";
	grid.style.width = wid*w +"px";
	for(var i=0;i<h;i++){
		var r =[];
		hml+="<tr class='row'>";
		for(var j=0;j<w;j++){
			r.push('.');
			hml+="<td class='col' style='height:"+wid;
			hml+="width:"+wid;
			hml+="border:3px solid green;";
			hml+="border-radius:100%;";
			hml+="' ontouchstart='play("+j+");' ";
			hml +="></td>";
		}
		board.push(r);
		hml+="</tr>";
	}
	grid.innerHTML=hml;
	setInterval(blink,250);
	setInterval(yblink,70);
	if(!(localStorage.lookAhead == "tut"))menuOn();
	else playTut();
	
	},200);
};
function drop(b,c,p,anim){
	//alert("dropping");
	a=[];
	try{
	var r = 0;
	while(r < b.length && b[r][c] == '.'){
		a.push(r);
		r++;}
	//alert("Dropped in row "+r-1);
	if(!valid(b,c))alert("Error! Attempted to drop in invalid column");
	b[r-1][c] = p;
	if(anim){
		blinkers=[];
		blink();
		exclx = c;
		excly = r-1;
		dr2(a,0,c,p);
		var rows = document.getElementsByClassName("row");
		for(var ro=0;ro<board.length;ro++){
			row = rows[ro].getElementsByTagName("td");
			for(var col=0;col<row.length;col++){
				row[col].style.border = ro==r-1&&col==c?"3px solid red":row[col].style.border;
			}
		}
	
	}
	}catch(e){alert("Drop error:\n"+e+" cp(r)/anim "+ c + " "+p+"("+(r-1)+")/"+anim);}
}
function dr2(a,i,c,p){
	try{
	var rows = document.getElementsByClassName("row");
	
	if(i > 0)rows[i-1].getElementsByTagName("td")[c].style.backgroundColor = color(board[i-1][c]);
	rows[i].getElementsByTagName("td")[c].style.backgroundColor = color(p);
	
	if(i+1<a.length)setTimeout(function(){dr2(a,i+1,c,p);},100);
	//else render();
	}catch(e){
		alert("Drop anim error:\n"+e);
	}
}
function valid(b,c){
	return c >= 0 && c < b[0].length && b[0][c] == '.';
}
function render(){
	try{
	var rows = document.getElementsByClassName("row");
	for(var r=0;r<board.length;r++){
		row = rows[r].getElementsByTagName("td");
		for(var c=0;c<row.length;c++)row[c].style.backgroundColor= color(board[r][c]);
	}
	}catch(e){alert("Render error:\n"+e);}
}
function full(b){
	for(var c=0;c<b[0].length;c++)if(b[0][c] == ".")return false;
	return true;
}
function compSto(r,c){
	try{
	var dat = new Date();
	var delta = dat.getTime() - tim;
	if(delta<300)play(c);
	else if(board[r][c] == ""+currentPlayer)sacrifice([[r,c]],function(){
		if(gameOver)return;
		show("S.E.F.F.I.A.R is thinking...");
	//alert("ai");
	setTimeout(function(){
	var best = eval(localStorage.anti)?getWorst(board):getBest(board);
	drop(board,best,"o",true);
	//render();
	won = vict(board,best);//check if ai has won
	
		if(won){
			show(eval(localStorage.anti)?"Player wins!":"S.E.F.F.I.A.R wins!");
			return;
		}
		else if(full(board)){
		show("It's a draw!");
		return;
	}
	show("Your Turn. (Long touch existing discs to sacrifice)");
	// make computer play
	currentPlayer = "x";
	},1000);
		
	},true);
	}catch(e){
		alert(e);
	}
}
function playComputer(){
	blinkers = [];
	gameOver=false;
	blink();
	if(localStorage.lookAhead == "tut"){
		playTut();
		return;
	}
	//alert(g("difficulty").value);
	h=9;
	w=7;
	var hml = "";
	board = [];
	var wid = (window.innerWidth/w)*0.85-4+"px;";
	grid.style.height = wid*w+"px";
	grid.style.width = wid*w +"px";
	for(var i=0;i<h;i++){
		var r =[];
		hml+="<tr class='row'>";
		for(var j=0;j<w;j++){
			r.push('.');
			hml+="<td class='col' style='height:"+wid;
			hml+="width:"+wid;
			hml+="border:3px solid green;";
			hml+="border-radius:100%;";
			hml+="' ontouchstart='touchBeg("+i+","+j+");' ontouchend='compSto("+i+","+j+");'";
			hml +="></td>";
		}
		board.push(r);
		hml+="</tr>";
	}
	grid.innerHTML=hml;
	currentPlayer = 'o';
	if(localStorage.firstP == "pink" )currentPlayer = "x";
	if(currentPlayer == "x"){
		show("Your Turn. (Long touch existing discs to sacrifice)");
		//alert("You are starting");
	}
	else{
		show("S.E.F.F.I.A.R is thinking...");
		setTimeout(function(){
		var best = eval(localStorage.anti)?getWorst(board):getBest(board);
	drop(board,best,"o",true);
	//render();
	won = vict(board,best);//check if player has won
	
		if(won){
			alert(eval(localStorage.anti)?"Player wins!":"S.E.F.F.I.A.R wins!");
			return;
		}
		else if(full(board)){
		alert("It's a draw");
		return;
	}
	// make computer play
	show("Your Turn. (Long touch existing discs to sacrifice)");
	currentPlayer = "x";
	},500);
	}
}
function play(col){
	currentPlayer=="x" && valid(board,col)
	?function(){
		currentPlayer = "o";
		drop(board,col,"x",true);
		//render();
		won = vict(board,col);//check if player has won
		if(won){
			show(eval(localStorage.anti)?"S.E.F.F.I.A.R wins!":"Player wins!");
			return;
	}
	else if(full(board)){
		show("It's a draw!");
		return;
	}
	show("S.E.F.F.I.A.R is thinking...");
	//alert("ai");
	setTimeout(function(){
	var best = eval(localStorage.anti)?getWorst(board):getBest(board);
	drop(board,best,"o",true);
	//render();
	won = vict(board,best);//check if ai has won
	
		if(won){
			show(eval(localStorage.anti)?"Player wins!":"S.E.F.F.I.A.R wins!");
			return;
		}
		else if(full(board)){
		show("It's a draw!");
		return;
	}
	show("Your Turn. (Long touch existing discs to sacrifice)");
	// make computer play
	currentPlayer = "x";
	},1000);
	}()
	:function(){};
}
function color(p){
	//alert(p);
	return p=="x"?"rgba(300,100,800,0.8)":p=="o"?"black":"rgba(150,100,800,0.8)";
}
function getBest(b,cpl,lka,getArr){
	var ok= bmovs(b,cpl||"o",lka||localStorage.lookAhead );
	//alert(ok);
	//alert("Potentials:\n"+ok);
	var highest = -100000000;
	//alert(highest);
	for(var i=0;i<ok.length;i++)if(ok[i]>highest && valid(b,i))highest = ok[i]*1;
	var best = [];
	for(var i=0;i<ok.length;i++)if(ok[i]*1==highest*1 && valid(b,i))best.push(i);
	//alert("Best:\n"+best);
	return getArr?best:best[Math.floor(Math.random()*best.length)];
	
}
function getWorst(b,cpl,lka){
	var ok= bmovs(b,cpl||"o",lka||localStorage.lookAhead );
	//alert(ok);
	var lowest = 1000000000;
	//alert(highest);
	for(var i=0;i<ok.length;i++)if(ok[i]<lowest && valid(b,i))lowest = ok[i]*1;
	var best = [];
	for(var i=0;i<ok.length;i++)if(ok[i]*1==lowest*1 && valid(b,i))best.push(i);
	return best[Math.floor(Math.random()*best.length)];
	
}
function vict(b,x,y){
	try{
	if(!y){
	y = 0;
	while ( y < b.length && b[y][x] == '.')y++;
	y=min(b.length-1,y);}
	//if(board[y][x] == ".")return;
	c = x*1;
	r = y*1;
	//horiz
	}catch(e){
		alert("Error in drop calc:\n"+e);
		
	}
	try{
	while (c >= 0 && b[r][c]+"" == b[y][x]+"")c--;
	c++;
	c=max(0,c);
	//alert("leftmost: "+c+","+r);
	
	if(c+3 < b[0].length && b[r][c] == b[r][c+1] && b[r][c] == b[r][c+2] && b[r][c] == b[r][c+3])return true;
	}catch(e){
		alert("Error in horiz calc:\n"+e+"\n"+c+" , "+r);
		
	}
	//vert
	try{
	c=x*1;
	r=y*1;
	if(r+3 < b.length && b[r][c] == b[r+1][c] && b[r][c] == b[r+2][c] && b[r][c] == b[r+3][c])return true;
	}catch(e){
		alert("Error in vert calc:\n"+e+"\n"+c+" , "+r);
		
	}
	//alert("topmost: "+c+","+r);
	try{
	c=x*1;
	r=y*1;
	while(c>=0 && r>=0 && b[y][x] == b[r][c]){
		c--;
		r--;
	}
	c++;
	c=max(0,c);
	r++;
	r=max(0,r);
	if(r+3 < b.length && c+3 < b[0].length && b[r][c] == b[r+1][c+1] && b[r][c] == b[r+2][c+2] && b[r][c] == b[r+3][c+3])return true;
	}catch(e){
		alert("Error in vr calc:\n"+e+"\n"+c+" , "+r);
		
	}
	try{
	c=x*1;
	r=y*1;
	while(c<b[0].length && r>=0 && b[y][x] == b[r][c]){
		c++;
		r--;
	}
	c--;
	c=min(b[0].length,c);
	r++;
	r=max(0,r);
	if(r+3 < b.length && c-3 < b[0].length && b[r][c] == b[r+1][c-1] && b[r][c] == b[r+2][c-2] && b[r][c] == b[r+3][c-3])return true;
	}catch(e){
		alert("Error in vl calc:\n"+e+"\n"+c+" , "+r);
		
	}
}
function min(a,b){
	return a<b?a:b;
}
function max(a,b){
	return a>b?a:b;
}
function bmovs(b,p,l){
	try{
	if(l==0){
		var a = [];
		for(var i=0;i<b[0].length;i++)a.push(0);
		return a;
	}
	pm = [];
	var enem = p=='x'?'o':'x';
	if(full(b)){
		var a = [];
		for(var i=0;i<b[0].length;i++)a.push(0);
		return a;
	}
	var pm = [];
	for(var i=0;i<b[0].length;i++)pm.push(0);
	for(var pl=0;pl<b[0].length;pl++){
		var db = copyB(b);
		if(!valid(db,pl)){
			continue;
		}
		//alert("Phase1 drop "+pl+" "+p);
		drop(db,pl,p);
		if(vict(db,pl)){
			pm[pl] = 1;
			break;
		}
		else{
			if(full(db))pm[pl] = 0;
			else{
				for(var el=0;el<b[0].length;el++){
					db2 = copyB(db);
					if(!valid(db2,el))continue;
					drop(db2,el,enem);
					if(vict(db2,el)){
						pm[pl] = -1;
						break;
					}
					else{
						var res = bmovs(db2,p,l-1);
						pm[pl] += (sum(res)/b[0].length)/b[0].length;
					}
				}
			}
		}
	}
	//alert(pm);
	return pm;
	}catch(e){
		alert("move calc error:\n"+e);
	}
}
function copyB(b){
	try{
	var newBoard = [];
	for(var row=0;row<b.length;row++){
		var ro = [];
		for(var col=0;col<b[0].length;col++)ro.push(""+b[row][col]);
		newBoard.push(ro);
	}
	return newBoard;
	}catch(e){
		alert("Board duplication error:\n"+e);
	}
}
function sum(a){
	var t =0;
	for(var c=0;c<a.length;c++)t+=a[c];
	return t;
}
function show(i){
	g("info").innerHTML = i;
}
function change(){
	animating = animating=="up"?"down":"up";
}
function menuOn(){
	//if(animating)return;
	//alert(animating);
	menu.style.display = "";
	
	//g("difficulty").value = localStorage.lookAhead;
	if(parseInt(mtog.style.bottom)>0){
		animating = "down";
		menuOff();
		return;
	}
	try{
	menu.innerHTML = menuhtm;
	localStorage.lookAhead==2?g("easy").selected=true:
	localStorage.lookAhead==3?g("normal").selected=true:
	g("tut").selected=true;
	localStorage.firstP=="pink"?
	document.getElementsByName("fp")[0].checked = true:
	document.getElementsByName("fp")[1].checked = true;
	g("rows").getElementsByTagName("option")[localStorage.h-7].selected=true;
	g("cols").getElementsByTagName("option")[localStorage.w-7].selected=true;
	g("anti").checked = eval(localStorage.anti);
	var dist = winh*(1-0.065)-3;
	var vel = -0.5 + Math.sqrt(0.5*0.5 +2*winh)*1.1;
	var acc = 1;
	var minv = 1;
	var duration = 800;
	var inter = duration/vel;
	var thisInt= setInterval(
	function(){
		if(animating == "down"){
			clearInterval(thisInt);
			return;
		}
		if(parseInt(mtog.style.bottom) < dist){
			newpos = parseInt(mtog.style.bottom)+vel;
			newpos = newpos<dist?newpos:dist;
			mtog.style.bottom = newpos +"px";
			//menu.style.top = winh - parseInt(mtog.style.bottom)+"px";
			menu.style.height = parseInt(mtog.style.bottom)-2+"px";
			//alert(vel);
			}
		else{
			animating = "down";
			//alert(mtog.style.bottom);
			//alert("done");
			vel = 0;
			clearInterval(thisInt);
			//mtog.style.bottom = dist+"px";
			//menu.style.top = winh - parseInt(mtog.style.bottom)+"px";
			menu.style.height = parseInt(mtog.style.bottom)-2+"px";
		}
		vel -= acc;
		vel = max(minv,vel);
	}
	,inter);
	}catch(e){
		alert(e);
	}
}
function menuOff(){
	try{
	var vel = 0;//0.5*winh*0.935*(winh*0.935+1);
	var acc = 10;
	var thisInt= setInterval(
	function(){
		if(animating == "up"){
			clearInterval(thisInt);
			return;
		}
		if(parseInt(mtog.style.bottom) >0){
			newpos = parseInt(mtog.style.bottom)-vel;
			newpos = newpos>0?newpos:0;
			mtog.style.bottom = newpos +"px";
			//menu.style.top = winh - parseInt(mtog.style.bottom)+"px";
			menu.style.height = parseInt(mtog.style.bottom)-2+"px";
			//alert(vel);
			}
		else{
			animating="up";
			//alert(mtog.style.bottom);
			//alert("done");
			vel = 0;
			localStorage.lookAhead = g("difficulty").value;
			localStorage.firstP = document.getElementsByName("fp")[0].checked?"pink":"black";
			localStorage.w = g("cols").value;
			localStorage.h = g("rows").value;
			localStorage.anti = g("anti").checked;
			menu.style.display="none";
			menuhtm = menu.innerHTML;
			menu.innerHTML = "";
			clearInterval(thisInt);
			//menu.style.top = winh - parseInt(mtog.style.bottom)+"px";
			menu.style.height = "0px";
		}
		vel += acc;
	}
	,1000/24);
	}catch(e){
		alert(e);
	}
}
function touchBeg(r,c){
	var dat = new Date();
	tim = dat.getTime();
	//alert(c);
}
function touchSto(r,c){
	var dat = new Date();
	var delta = dat.getTime() - tim;
	if(delta<300)play2(c);
	else if(board[r][c] == ""+currentPlayer)sacrifice([[r,c]],null,true);
	
}
function playMulti(){
	gameOver = false;
	blinkers = [];
	blink();
	//alert(g("difficulty").value);
	h=localStorage.h;
	w=localStorage.w;
	var hml = "";
	board = [];
	var wid = (window.innerWidth/w)*0.85-4+"px;";
	grid.style.height = wid*w+"px";
	grid.style.width = wid*w +"px";
	for(var i=0;i<h;i++){
		var r =[];
		hml+="<tr class='row'>";
		for(var j=0;j<w;j++){
			r.push('.');
			hml+="<td class='col' style='height:"+wid;
			hml+="width:"+wid;
			hml+="border:3px solid green;";
			hml+="border-radius:100%;";
			hml+="' ontouchstart='touchBeg("+i+","+j+");' ontouchend='touchSto("+i+","+j+");'";
			hml +="></td>";
		}
		board.push(r);
		hml+="</tr>";
	}
	grid.innerHTML=hml;
	currentPlayer = 'o';
	if(localStorage.firstP == "pink" )currentPlayer = "x";
	if(currentPlayer == "x"){
		show("Pink's turn (Long touch existing discs to sacrifice)");
		//alert("You are starting");
	}
	else show("Black's turn (Long touch existing discs to sacrifice)");
}
function play2(col){
	if(gameOver || currentPlayer == ".")return;
	//alert(col);
	try{
	if(valid(board,col) && !gameOver){
		//alert("valid");
		drop(board,col,currentPlayer,true);
		//render();
		won = vict(board,col);//check if player has won
		if(won){
			show((currentPlayer=="x"&&eval(localStorage.anti)?"Black":(eval(localStorage.anti)&&currentPlayer=="o"?"Pink":currentPlayer=="o"?"Black":"Pink"))+" wins!");
			currentPlayer == ".";
			gameOver = true;
			return;
	}
	else if(full(board)){
		show("It's a draw!<br>(Touch to Reset)");
		currentPlayer = '.';
		gameOver = true;
		return;
	}
	if(currentPlayer==".")return;
	currentPlayer = currentPlayer=="x"?"o":"x";
	show((currentPlayer=="x"?"Pink's":"Black's")+" turn (Long touch existing discs to sacrifice)");
	}
	}
	catch(e){
		alert(e);
	}
}
function playTut(){
	exclx = -1;
	excly = -1;
	//alert(g("difficulty").value);
	h=9;
	w=7;
	var hml = "";
	board = [];
	var wid = (window.innerWidth/w)*0.85-4+"px;";
	grid.style.height = wid*w+"px";
	grid.style.width = wid*w +"px";
	for(var i=0;i<h;i++){
		var r =[];
		hml+="<tr class='row'>";
		for(var j=0;j<w;j++){
			r.push('.');
			hml+="<td class='col' style='height:"+wid;
			hml+="width:"+wid;
			hml+="border:3px solid green;";
			hml+="border-radius:100%;";
			hml+="' ontouchstart='playT("+j+");' ";
			hml +="></td>";
		}
		board.push(r);
		hml+="</tr>";
	}
	grid.innerHTML=hml;
	currentPlayer = 'o';
	if(localStorage.firstP == "pink" )currentPlayer = "x";
	if(currentPlayer == "x"){
		show("Touch a column to drop a disc, try getting four in a row.");
		blinkers = getBest(board,"x",2,true);
		blink();
		//alert("You are starting");
	}
	else{
		show("S.E.F.F.I.A.R is thinking...");
		setTimeout(function(){
		var best = getWorst(board,"o",2);
	drop(board,best,"o",true);
	//render();
	blinkers = [];
	blink();
	won = vict(board,best);//check if player has won
	
		if(won){
			alert("S.E.F.F.I.A.R wins!");
			return;
		}
		else if(full(board)){
		alert("It's a draw");
		return;
	}
	// make computer play
	show("Touch a column to drop a disc, try getting four in a row.");
	blinkers = getBest(board,"x",2,true);
	//alert(blinkers);
	blink();
	currentPlayer = "x";
	},500);
	}
}
function playT(col){
	currentPlayer=="x" && valid(board,col)
	?function(){
		currentPlayer = "o";
		drop(board,col,"x",true);
		blinkers = [];
		blink();
		//render();
		won = vict(board,col);//check if player has won
		if(won){
			show("Well done! Change the difficulty to easy or hard in the menu.");
			return;
	}
	else if(full(board)){
		show("It's a draw!");
		return;
	}
	show("S.E.F.F.I.A.R is thinking...");
	//alert("ai");
	setTimeout(function(){
	var best = getWorst(board,"o",2);
	drop(board,best,"o",true);
	blinkers = [];
	blink();
	//render();
	won = vict(board,best);//check if ai has won
	
		if(won){
			show("Please retry the tutorial, go to menu and touch single player game");
			return;
		}
		else if(full(board)){
		show("It's a draw!");
		return;
	}
	show("Touch a column to drop a disc, try getting four in a row.");
	// make computer play
	currentPlayer = "x";
	blinkers = getBest(board,"x",2,true);
	//alert(blinkers);
	blink();
	},1000);
	}()
	:function(){};
}
function blink(){
	//alert("blinking");
	try{
	var rows = document.getElementsByClassName("row");
	for(var r=0;r<board.length;r++){
		row = rows[r].getElementsByTagName("td");
		for(var c=0;c<row.length;c++){
			if(r*1==excly*1&&c*1==exclx*1)continue;
			var doit = false;
			for(var bli=0;bli<blinkers.length;bli++)if(blinkers[bli]*1==c*1){
				doit = true;
				break;
			}
			row[c].style.border = (row[c].style.border=="3px solid green" && doit)?"3px solid red":"3px solid green";
			}
	}
	}catch(e){alert("Blink error:\n"+e);}
	
}
function desHas(d,r,c){
	for(var i=0;i<d.length;i++){
		if((d[i][0]-r == 0) && (d[i][1]-c == 0))return true;
	}
}
function compb(p,r,c){
	return ""+board[p[0]][p[1]] == ""+board[r][c];
}
function fullcheck(f){
	if(full(board)){
		show("It's a draw!");
		gameOver = true;
		}
	for(var r=0;r<board.length;r++){
		for(var c=0;c<board[0].length;c++){
			if(board[r][c] == ".")continue;
			if(vict(board,c,r)){
				gameOver = true;
				
				f?show(board[r][c]=="x"?"Player wins!":"S.E.F.F.I.A.R wins!"):show(board[r][c]=="x"?"Pink wins!":"Black wins!");
			}
		}
	}
}
function sacrifice(sacs,f,force){
	if(gameOver)return;
	if(sacs.length == 0){
		//alert("sacs done");
		
	}
	var destroy = [];
	if(!force){
	for(var i=0;i<sacs.length;i++){
		var pos = sacs[i];
		
		if(board[pos[0]][pos[1]]==".")continue;
		if(pos[0] > 0 && compb(pos,pos[0]-1,pos[1])){if(!desHas(destroy,pos[0]-1,pos[1]))destroy.push([pos[0]-1,pos[1]]);
		if(pos[0] > 1 && compb(pos,pos[0]-2,pos[1])){if(!desHas(destroy,pos[0]-2,pos[1]))destroy.push([pos[0]-2,pos[1]]);
		if(pos[0] > 2 && compb(pos,pos[0]-3,pos[1]))if(!desHas(destroy,pos[0]-3,pos[1]))destroy.push([pos[0]-3,pos[1]]);}
		if(!desHas(destroy,pos[0],pos[1]))destroy.push(pos);
		}
		
		if(pos[0]+1 < board.length && compb(pos,pos[0]+1,pos[1])){if(!desHas(destroy,pos[0]+1,pos[1]))destroy.push([pos[0]+1,pos[1]]);
		if(pos[0]+2 < board.length && compb(pos,pos[0]+2,pos[1])){if(!desHas(destroy,pos[0]+2,pos[1]))destroy.push([pos[0]+2,pos[1]]);
		if(pos[0]+3 < board.length && compb(pos,pos[0]+3,pos[1]))if(!desHas(destroy,pos[0]+3,pos[1]))destroy.push([pos[0]+3,pos[1]]);}
		if(!desHas(destroy,pos[0],pos[1]))destroy.push(pos);
		}
		
		if(pos[1]+1 < board[0].length && compb(pos,pos[0],pos[1]+1)){if(!desHas(destroy,pos[0],pos[1]+1))destroy.push([pos[0],pos[1]+1]);
		if(pos[1]+2 < board[0].length && compb(pos,pos[0],pos[1]+2)){if(!desHas(destroy,pos[0],pos[1]+2))destroy.push([pos[0],pos[1]+2]);
		if(pos[1]+3 < board[0].length && compb(pos,pos[0],pos[1]+3))if(!desHas(destroy,pos[0],pos[1]+3))destroy.push([pos[0],pos[1]+3]);}
		if(!desHas(destroy,pos[0],pos[1]))destroy.push(pos);
		}
		
		if(pos[1]-1 >= 0 && compb(pos,pos[0],pos[1]-1)){if(!desHas(destroy,pos[0],pos[1]-1))destroy.push([pos[0],pos[1]-1]);
		if(pos[1]-2 >= 0 && compb(pos,pos[0],pos[1]-2)){if(!desHas(destroy,pos[0],pos[1]-2))destroy.push([pos[0],pos[1]-2]);
		if(pos[1]-3 >= 0 && compb(pos,pos[0],pos[1]-3))if(!desHas(destroy,pos[0],pos[1]-3))destroy.push([pos[0],pos[1]-3]);}
		if(!desHas(destroy,pos[0],pos[1]))destroy.push(pos);
		}
		
	}
	}
	if(destroy.length == 0 && force)destroy = sacs;
	if(destroy.length == 0){
		fullcheck(f);
		if(gameOver)return;
		currentPlayer = currentPlayer=="x"?"o":'x';
		show(currentPlayer=="x"?"Pink's turn (Long touch existing discs to sacrifice)":"Black's turn (Long touch existing discs to sacrifice)");
		if(f){
			f();
		}
		return;
	}
	exclx = null;
	excly = null;
	yblinkers = destroy;
	setTimeout(
	function(){
		for(var d=0;d<destroy.length;d++)board[destroy[d][0]][destroy[d][1]] = ".";
		render();
		yblinkers = [];
		var bottoms= [];
		for(var col=0;col<board[0].length;col++){
			for(var row=board.length-1;row>=0;row--){
				if(board[row][col] == "."){
					bottoms.push(row);
					break;
				}
				else if(row == 0)bottoms.push(-1);
			}
		}
		setTimeout( function(){fall(bottoms,f);},100);;
	}
	,1000);
}
function fall(bottoms,f){
	try{
	//alert("falling");
	var hasDropped = false;
	for(var col=0;col<board[0].length;col++){
		if(bottoms[col]==-1 || board[bottoms[col]][col] != ".")continue;
		//hasDropped = true;
		for(var row = bottoms[col];row>0;row--){
			board[row][col] = ""+board[row-1][col];
			if(board[row][col] != ".")hasDropped = true;
			board[row-1][col] = ".";
		}
	}
	render();
	if(hasDropped){setTimeout(function(){
		fall(bottoms,f);
	},100);
	}
	else{
		var toDestroy = [];
		for(var c=0;c<board[0].length;c++){
			for(var r=bottoms[c];r>=0;r--){
				if(board[r][c] != ".")toDestroy.push([r,c]);
			}
		}
		//alert("sac "+toDestroy);
		sacrifice(toDestroy,f);
	}
	}catch(e){
		alert("fall error:\n"+e);
	}
}
function yblink(){
	//alert("blinking");
	try{
	var rows = document.getElementsByClassName("row");
	for(var yr=0;yr<yblinkers.length;yr++){
		var row = rows[yblinkers[yr][0]].getElementsByTagName("td");
		row[yblinkers[yr][1]].style.border = row[yblinkers[yr][1]].style.border=="3px solid orange"?"3px solid green":"3px solid orange";
	}
	/*for(var r=0;r<board.length;r++){
		row = rows[r].getElementsByTagName("td");
		for(var c=0;c<row.length;c++){
			if(r*1==excly*1&&c*1==exclx*1)continue;
			var doit = false;
			for(var bli=0;bli<blinkers.length;bli++)if(blinkers[bli]*1==c*1){
				doit = true;
				break;
			}
			row[c].style.border = (row[c].style.border=="3px solid green" && doit)?"3px solid red":"3px solid green";
			*/
	
	}catch(e){alert("Yblink error:\n"+e);}
}
