lookAhead = localStorage.lookAhead || "tut";
localStorage.lookAhead = lookAhead;
localStorage.firstP = localStorage.firstP || "pink";
localStorage.w= localStorage.w || 7;
localStorage.h = localStorage.h || 9;
localStorage.anti = localStorage.anti || false;
blinkers = [];
yblinkers =[];
mode = null;
exclx = -1;
excly = -1;
pause = false;
that = false;
sacrificing = false;

/*
timeout computer if sacrifice in progress
*/
window.onerror = function (message, url, lineNo){
    alert('Error: ' + message + '\n' + 'Line Number: ' + lineNo);
    return true;
}
function dd(){
	var count = 0;
	for(var i=0;i<board.length;i++){
		for(var j=0;j<board[0].length;j++){
			if(board[i][j] != ".")count++;
		}
	}
	var l = 3;
	var m = 8;
	var blen = board.length*board[0].length;
	var nl = Math.round(l + (count/blen)*(m-l));
	alert("using diff:"+nl);
	return nl;
}
function bestM(b,p,l,arr){
	that.restartGame(eval(l));
	for(var r=b.length-1;r>=0;r--){
		for(var c=0;c<b[0].length;c++){
			if(b[r][c] == p){
				that.board.player = 1;
				that.round = 1;
				that.place(c);
			}
			else if(b[r][c] != "."){
				that.board.player = 0;
				that.round = 0;
				that.place(c);
			}
		}
	}
	that.board.player = 1;
	that.round = 1;
	return that.generateComputerDecision(arr);
}
function worstM(b,p,l){
	that.restartGame(eval(l));
	for(var r=b.length-1;r>=0;r--){
		for(var c=0;c<b[0].length;c++){
			if(b[r][c] == p){
				that.board.player = 1;
				that.round = 1;
				that.place(c);
			}
			else if(b[r][c] != "."){
				that.board.player = 0;
				that.round = 0;
				that.place(c);
			}
		}
	}
	that.board.player = 1;
	that.round = 1;
	return that.minimizePlay(that.board,l)[0];;
}
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
	//alert("loaded");
	try{
	Start();
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
			hml+="'";
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
	
	},200);}catch(e){
		alert("winload err:\n"+e);
	}
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
	//if(!valid(b,c))alert("Error! Attempted to drop in invalid column");
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
	else if(board[r][c] == "x")sacrifice([[r,c]],function(){
		if(gameOver || sacrificing)return;
		show("S.E.F.F.I.A.R is thinking...");
	//alert("ai");
	setTimeout(function(){
	if(sacrificing)return;
	var best = eval(localStorage.anti)?getWorst(board,"o"):getBest(board,"o");
	if(sacrificing)return;
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
function colOf(x,swap){
	if(!swap)return x=="x"?"Pink":"Black";
	if(swap)return x=="x"?"Black":"Pink";
}
function playZero(){
	mode="zp";
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
			hml+="border-radius:100%;'";
			hml +="></td>";
		}
		board.push(r);
		hml+="</tr>";
	}
	grid.innerHTML=hml;
	currentPlayer = 'o';
	if(localStorage.firstP == "pink" )currentPlayer = "x";
	show(colOf(currentPlayer)+" is thinking...",false);
	setTimeout( playZ,1000);
	
}
function playZ(){
	if(mode != "zp")return;
	if(pause){
		setTimeout(playZ,500);
		return;
	}
	var best = eval(localStorage.anti)?getWorst(board,currentPlayer):(currentPlayer=="x"?getBest(board,currentPlayer):getBesto(board,currentPlayer));
	drop(board,best,currentPlayer,true);
	//render();
	won = vict(board,best);//check if player has won
	
		if(won){
			show(colOf(currentPlayer,eval(localStorage.anti))+" wins!");
			return;
		}
		else if(full(board)){
		alert("It's a draw");
		return;
	}
	// make computer play
	currentPlayer = currentPlayer=="x"?"o":"x";
	show(colOf(currentPlayer)+" is thinking...",false);
	setTimeout(playZ,2000);
}
function playComputer(){
	
	mode = null;
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
		if(that)that.round = 0;
		show("Your Turn. (Long touch existing discs to sacrifice)");
		//alert("You are starting");
	}
	else{
		show("S.E.F.F.I.A.R is thinking...");
		setTimeout(function(){
		var best = eval(localStorage.anti)?getWorst(board):getBest(board,"o");;
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
		drop(board,col,"x",true);
		//render();
		won = vict(board,col);//check if player has won
		if(won){
			gameOver = true;
			show(eval(localStorage.anti)?"S.E.F.F.I.A.R wins!":"Player wins!");
			return;
	}
	else if(full(board)){
		gameOver = true;
		show("It's a draw!");
		return;
	}
	currentPlayer = "o";
	show("S.E.F.F.I.A.R is thinking...");
	//alert("ai");
	setTimeout(function(){
	try{
	var best = eval(localStorage.anti)?getWorst(board):getBest(board,"o");
	//alert(best);
	drop(board,best,"o",true);
	}catch(e){
		alert("AI error:\n"+e);
	}
	//render();
	won = vict(board,best);//check if ai has won
	
		if(won){
			gameOver = true;
			show(eval(localStorage.anti)?"Player wins!":"S.E.F.F.I.A.R wins!");
			return;
		}
		else if(full(board)){
		gameOver = true;
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
	try{
	if(sacrificing)alert("the sacrifice aint done!");
	lka = lka || localStorage.lookAhead;
	lka = eval(lka);
	//alert("getting ready");
	var col = bestM(b,cpl,lka,getArr);
	//alert(col);
	return col;
	hscores = [];
	lscores = [];
	for(var i=0;i<(lka||localStorage.lookAhead)*2;i++){hscores.push(-100000);lscores.push(100000);}
	var ok = generateM(lka||localStorage.lookAhead);
	bmovs(b,cpl||"o",lka||localStorage.lookAhead,0,ok );
	var ok = generateM(lka||localStorage.lookAhead);
	bmovs(b,cpl||"o",lka||localStorage.lookAhead,0,ok );
	//alert(ok);
	//alert("Potentials:\n"+ok);
	//alert(JSON.stringify(ok));
	//alert(hscores);
	//alert(lscores);
	var colsok = [];
	for(var i = 0;i<ok.length;i++)if(valid(b,i))colsok.push(i);
	for(var pos = 0;pos<ok[0].length;pos++){
		var thisMax = ok[colsok[0]][pos];
		for(var c=0;c<colsok.length;c++){
			if(ok[colsok[c]][pos] > thisMax)thisMax = ok[colsok[c]][pos];
		}
		//alert("pos "+pos+" max "+thisMax);
		var nok=[];
		for(var n=0;n<colsok.length;n++){
			if(ok[colsok[n]][pos] == thisMax)nok.push(colsok[n]);
		}
		colsok = nok;
	}
	}catch(e){
		alert(e);
	}
	var best = colsok;
	return getArr?best:best[Math.floor(Math.random()*best.length)];
	
}
function getWorst(b,cpl,lka){
	lka = eval(lka);
	return worstM(b,cpl,lka);
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
function cop(a){
	var na = [];
	for(var i=0;i<a.length;i++)na.push(a[i]);
	return na;
}
function genA(n,w){
	var na = [];
	for(var i=0;i<n;i++)na.push(w);
	return na;
}
function bmovs(b,p,l,count,arr,fcol,score,amscore){
	var ascore = amscore || [0];
	var nsco = score || 0;
	//alert(ascore);
	hcomp(ascore);
	lcomp(ascore);
	//if(!lcomp(ascore))return;
	//if(nsco > lscores[count])return;
	//else return;
	//if(!lcomp(ascore))return;
	var count = count || 0;
	//var posScore = (b.length*b[0].length - count)*(b.length*b[0].length - count)*count==0?1000000:1;;
	try{
	if(l==0){
		return;
	}
	var enem = p=='x'?'o':'x';
	if(full(b)){
		return;
	}
	for(var pl=0;pl<arr.length;pl++){
		var db = copyB(b);
		var nasco = cop(ascore);
		if(!valid(db,pl)){
			nasco.push(nsco);
			continue;
		}
	
		if(count==0)fcol = pl;
		//alert("Phase1 drop "+pl+" "+p);
		drop(db,pl,p);
		if(vict(db,pl)){
			// = posScore;
			nsco++;
			nasco.push(nsco);
			//alert(nasco);
			hcomp(nasco);
			arr[fcol][count]++;
			lcomp(nasco);
		}
		else{
			if(hscores[count+1] > 0)continue;
			nasco.push(nsco);
			
			//if(!hcomp(nasco))continue;
			hcomp(nasco);
			lcomp(nasco);
			//if(nsco < hscores[count+1])return;
		//else return;
			if(full(db))continue;
			else{
				for(var el=0;el<arr.length;el++){
					var nasco2 = cop(nasco);
					hcomp(nasco2);
					lcomp(nasco2);
					//if(!hcomp(nasco2))return;
					db2 = copyB(db);
					if(!valid(db2,el)){continue;nasco2.push(nsco);}
					drop(db2,el,enem);
					if(vict(db2,el)){
						nsco--;
						nasco2.push(nsco);
						arr[fcol][count+1]--;
						lcomp(nasco2);
						hcomp(nasco2);
					}
					
					else{
						if(lscores[count+2] < 0)continue;
						nasco2.push(nsco);
						//if(!lcomp(nasco2))continue;
						hcomp(nasco2);
						lcomp(nasco2);
						bmovs(db2,p,l-1,count+2,arr,fcol,nsco,nasco2);
					}
				}
			}
		}
	}
	//alert(pm);
	}catch(e){
		alert("move calc error:\n"+e);
	}
}
function hcomp(scos){
	for(var i=0;i<scos.length;i++){
		if(scos[i]*1 >= 1*hscores[i])hscores[i] = 1* scos[i];
		else return false;
	}
	return true;
}
function lcomp(scos){
	for(var i=0;i<scos.length;i++){
		if(scos[i]*1 <= lscores[i]*1)lscores[i] = 1*scos[i];
		else return false;
	}
	return true;
}
function generateM(l){
	//alert("prepping");
	var a = [];
	for(var c=0;c<board[0].length;c++){
		var poss = [];
		for(var pos=0;pos<l*2;pos++)poss.push(0);
		a.push(poss);
	}
	//alert("generated\n"+a);
	return a;
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
	pause = true;
	menu.innerHTML = menuhtm;
	localStorage.lookAhead==2?g("easy").selected=true:
	localStorage.lookAhead==3?g("normal").selected=true:
	localStorage.lookAhead==3.5?g("hard").selected=true:
	localStorage.lookAhead==4?g("vhard").selected=true:
	localStorage.lookAhead=="dd()"?g("dd").selected=true:
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
	pause = false;
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
	mode = null;
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
	mode = null;
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
		blinkers = getBesto(board,"x",2,true);
		blink();
		//alert("You are starting");
	}
	else{
		show("S.E.F.F.I.A.R is thinking...");
		setTimeout(function(){
		var best = worstM(board,"o",1);
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
	blinkers = getBesto(board,"x",2,true);
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
	var best = worstM(board,"o",1);
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
	blinkers = getBesto(board,"x",2,true);
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
	sacrificing = true
	if(sacs.length == 0){
		//alert("sacs done");
		
	}
	var destroy = [];
	if(!force){
	for(var i=0;i<sacs.length;i++){
		var pos = sacs[i];
		/*
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
		}*/
		
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
		sacrificing = false;
		currentPlayer = currentPlayer=="x"?"o":'x';
		show(currentPlayer=="x"?"Pink's turn (Long touch existing discs to sacrifice)":"Black's turn (Long touch existing discs to sacrifice)");
		if(f && !sacrificing){
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
	sacrificing = true;
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
		
		for(var col=0;col<board[0].length;col++){
			for(var row=board.length-1;row>=0;row--){
				if(board[row][col] == "."){
					if(row > bottoms[col])bottoms[col] = row;
					break;
				}
				else if(row == 0)bottoms.push(-1);
			}
		}
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
function getBesto(b,cpl,lka,getArr){
	var ok= bmovso(b,cpl||"o",lka||localStorage.lookAhead );
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
function bmovso(b,p,l){
	l = Math.floor(l);
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
						var res = bmovso(db2,p,l-1);
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

/**
 * Minimax (+Alpha-Beta) Implementation 
 * @plain javascript version
 */
function Game() {
    this.rows = 9; // Height
    this.columns = 7; // Width
    this.status = 0; // 0: running, 1: won, 2: lost, 3: tie
    this.depth = 6; // Search depth
    this.score = 100000, // Win/loss score
    this.round = 0; // 0: Human, 1: Computer
    this.winning_array = []; // Winning (chips) array
    this.iterations = 0; // Iteration count
    
    that = this;

    that.init();
}

Game.prototype.init = function() {
    // Generate 'real' board
    // Create 2-dimensional array
    var game_board = new Array(that.rows);
    for (var i = 0; i < game_board.length; i++) {
        game_board[i] = new Array(that.columns);

        for (var j = 0; j < game_board[i].length; j++) {
            game_board[i][j] = null;
        }
    }

    // Create from board object (see board.js)
    this.board = new Board(this, game_board, 0);

    // Generate visual board
    var game_board = "";
    for (var i = 0; i < that.rows; i++) {
        game_board += "<tr>";
        for (var j = 0; j < that.columns; j++) {
            game_board += "<td class='empty'></td>";
        }
        game_board += "</tr>";
    }
	gb = document.createElement('table');
    gb.innerHTML = game_board;

    // Action listeners
    var td = gb.getElementsByTagName("td");

    for (var i = 0; i < td.length; i++) {
        if (td[i].addEventListener) {
            td[i].addEventListener('click', that.act, false);
        } else if (td[i].attachEvent) {
            td[i].attachEvent('click', that.act)
        }
    }
}

/**
 * On-click event
 */
Game.prototype.act = function(e) {
    var element = e.target || window.event.srcElement;

    // Human round
    if (that.round == 0) that.place(element.cellIndex);
    
    // Computer round
    if (that.round == 1) that.generateComputerDecision();
}

Game.prototype.place = function(column) {
    // If not finished
    if (that.board.score() != that.score && that.board.score() != -that.score && !that.board.isFull()) {
        for (var y = that.rows - 1; y >= 0; y--) {
            if (gb.rows[y].cells[column].className == 'empty') {
                if (that.round == 1) {
                    gb.rows[y].cells[column].className = 'coin cpu-coin';
                } else {
                    gb.rows[y].cells[column].className = 'coin human-coin';
                }
                break;
            }
        }

        if (!that.board.place(column)) {
            return alert("Invalid move!");
        }

        that.round = that.switchRound(that.round);
        that.updateStatus();
    }
}

Game.prototype.generateComputerDecision = function(arr) {
    if (that.board.score() != that.score && that.board.score() != -that.score && !that.board.isFull()) {
        that.iterations = 0; // Reset iteration count
        //document.getElementById('loading').style.display = "block"; // Loading message

        // AI is thinking
        
            // Debug time
            var startzeit = new Date().getTime();

            // Algorithm call
            var ai_move = that.maximizePlay(that.board, that.depth);

            var laufzeit = new Date().getTime() - startzeit;
            //document.getElementById('ai-time').innerHTML = laufzeit.toFixed(2) + 'ms';

            // Place ai decision
            that.place(ai_move[0]);
			return arr?ai_move:ai_move[0];
            // Debug
           /* document.getElementById('ai-column').innerHTML = 'Column: ' + parseInt(ai_move[0] + 1);
            document.getElementById('ai-score').innerHTML = 'Score: ' + ai_move[1];
            document.getElementById('ai-iterations').innerHTML = that.iterations;

            document.getElementById('loading').style.display = "none"; // Remove loading message*/
    }
}

/**
 * Algorithm
 * Minimax principle
 */
Game.prototype.maximizePlay = function(board, depth, alpha, beta) {
    // Call score of our board
    var score = board.score();

    // Break
    if (board.isFinished(depth, score)) return [null, score];

    // Column, Score
    var max = [null, -99999];

    // For all possible moves
    for (var column = 0; column < that.columns; column++) {
        var new_board = board.copy(); // Create new board

        if (new_board.place(column)) {

            that.iterations++; // Debug

            var next_move = that.minimizePlay(new_board, depth - 1, alpha, beta); // Recursive calling

            // Evaluate new move
            if (max[0] == null || next_move[1] > max[1]) {
                max[0] = column;
                max[1] = next_move[1];
                alpha = next_move[1];
            }

            if (alpha >= beta) return max;
        }
    }

    return max;
}

Game.prototype.minimizePlay = function(board, depth, alpha, beta) {
    var score = board.score();

    if (board.isFinished(depth, score)) return [null, score];

    // Column, score
    var min = [null, 99999];

    for (var column = 0; column < that.columns; column++) {
        var new_board = board.copy();

        if (new_board.place(column)) {

            that.iterations++;

            var next_move = that.maximizePlay(new_board, depth - 1, alpha, beta);

            if (min[0] == null || next_move[1] < min[1]) {
                min[0] = column;
                min[1] = next_move[1];
                beta = next_move[1];
            }

            if (alpha >= beta) return min;

        }
    }
    return min;
}

Game.prototype.switchRound = function(round) {
    // 0 Human, 1 Computer
    if (round == 0) {
        return 1;
    } else {
        return 0;
    }
}

Game.prototype.updateStatus = function() {
    // Human won
    if (that.board.score() == -that.score) {
        that.status = 1;
        that.markWin();
        //alert("You have won!");
    }

    // Computer won
    if (that.board.score() == that.score) {
        that.status = 2;
        that.markWin();
        //alert("You have lost!");
    }

    // Tie
    if (that.board.isFull()) {
        that.status = 3;
        //alert("Tie!");
    }

   /* var html = document.getElementById('status');
    if (that.status == 0) {
        html.className = "status-running";
        html.innerHTML = "running";
    } else if (that.status == 1) {
        html.className = "status-won";
        html.innerHTML = "won";
    } else if (that.status == 2) {
        html.className = "status-lost";
        html.innerHTML = "lost";
    } else {
        html.className = "status-tie";
        html.innerHTML = "tie";
    }*/
}

Game.prototype.markWin = function() {
    gb.className = "finished";
    for (var i = 0; i < that.winning_array.length; i++) {
        var name = gb.rows[that.winning_array[i][0]].cells[that.winning_array[i][1]].className;
        gb.rows[that.winning_array[i][0]].cells[that.winning_array[i][1]].className = name + " win";
    }
}

Game.prototype.restartGame = function(l) {
    
        // Dropdown value
        //var difficulty = document.getElementById('difficulty');
        var depth =l*2 || localStorage.lookAhead*2; //difficulty.options[difficulty.selectedIndex].value;
        that.depth = depth;
        that.status = 0;
        that.round = 0;
        that.init();
        /*document.getElementById('ai-iterations').innerHTML = "?";
        document.getElementById('ai-time').innerHTML = "?";
        document.getElementById('ai-column').innerHTML = "Column: ?";
        document.getElementById('ai-score').innerHTML = "Score: ?";
        document.getElementById('game_board').className = "";*/
        that.updateStatus();
}

/**
 * Start game
 */
function Start() {
    window.Game = new Game();
}
/*
window.onload = function() {
    Start();
	/*setTimeout(function(){
	that.board.player = 0;
	that.place(6);
	alert(that.board.field);
	that.board.player = 0;
	that.place(6);
	alert(that.board.field);
	that.board.player = 0;
	that.place(6);
	that.board.player = 0;
	alert(that.board.field);
	that.board.player = 1;
	that.generateComputerDecision();
	alert(that.board.field);
	},1000);
*/
