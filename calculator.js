function Calculator(ID)
{
	this.ID=ID;
	this.memory=0;
	this.operation="";
	this.replace=false;
	this.createDOM();
	this.createEvent();
}

Calculator.prototype.createDOM=function()
{
	//перевіряєм чи містить ID
	var calc=document.getElementById(this.ID);
	if(calc==null)
	{
		alert("Відсутній елемент!")
		return;
	}
	//перезаписуємо на своє ID 
	calc.setAttribute("ID","calculator");
	this.ID="calculator";
	var sqrt=String.fromCharCode(8730);//витягуємо значок кореня
	//створюємо масиви з елементами для рядків
	var lineButtons2=[7,8,9,"/","C"];
	var lineButtons3=[4,5,6,"*",sqrt];
	var lineButtons4=["="];
	var lineButtons5=[1,2,3,"-"];
	var lineButtons6=[0,".","+"];
	for(var i=1;i<=6;i++)
	{
		var div=document.createElement("div");
		div.classList.add("line");
		calc.appendChild(div);
		if(i==1)
		{
			for(var j=1;j<=2;j++)
			{
				var input=document.createElement("input");
				input.setAttribute("type","text");
				input.setAttribute("readonly","true");
				div.appendChild(input);
				if(j==1)
				{
					input.setAttribute("ID","top");
					input.setAttribute("value","");
				}
				else
				{
					input.setAttribute("ID","bottom");
					input.setAttribute("value","0");
				}
			}
		}
		else
		{
			var lineButtons=null;
			if(i==2)
				lineButtons=lineButtons2;
			else
				if(i==3)
					lineButtons=lineButtons3;
				else
					if(i==4)
						lineButtons=lineButtons4;
					else
					if(i==5)
						lineButtons=lineButtons5;
					else 
						lineButtons=lineButtons6;
			for(var j=1; j<=lineButtons.length;j++)
			{
				var input=document.createElement("input");
				input.setAttribute("type","button");
				input.setAttribute("value",lineButtons[j-1])
				div.appendChild(input);
				if(lineButtons[j-1]=="=")
					input.classList.add("equal");
				if(lineButtons[j-1]==0)
					input.classList.add("zero");
			}
		}
	}
}

Calculator.prototype.createEvent=function()
{
	var self=this;
	var top=document.getElementById("top");
	var bottom=document.getElementById("bottom");
	var calc=document.getElementById(this.ID);
	if(calc==null)
		return;
	calc.onmouseover=function(event)
	{
		var target=event.target;
		if(target.tagName=="INPUT" && target.getAttribute("type")=="button")
			target.classList.add("select");
	}
	calc.onmouseout=function(event)
	{
		
		event.target.classList.remove("select");
	}
	calc.onclick=function(event)
	{
		var target=event.target;
		if(target.tagName!=="INPUT")
			return;
		if(target.getAttribute("type")!=="button")
			return;
		var value=parseInt(target.value);
		if(!isNaN(value))
		{
			self.numberClick(value,bottom,top);
			return;
		}
		if(target.value=="+" || target.value=="-" || target.value=="*" || target.value=="/" )
		{
			self.operationClick(target.value,top,bottom);
			return;
		}
		if(target.value==String.fromCharCode(8730))
		{
			self.sqrtClick(top,bottom);
			self.replace=true;
			return;
		}
		
		if(target.value=="=")
		{
			if(self.operation=="")
				return;
		
			bottom.value=self.equalClick(self.operation,self.memory,+bottom.value)
			top.value="";
			self.operation="";
			self.memory=0;
			self.replace=true;
			return;
		}
		if(target.value=="C")
		{
			bottom.value=0;
			top.value="";
			self.memory=0;
			self.replace=false;
			return;
		}
		if(target.value==".")
		{
			if(self.replace)
			{
				bottom.value="0."
				self.replace=false;
				return;
			}
			var str=bottom.value;
			var pos=str.indexOf(".");
			if(pos!==-1)
				return;
			bottom.value+=".";
		}
	}
}
Calculator.prototype.numberClick=function(value,input,input2)
{
	if(this.operation=="sqrt"){
		input2.value="";
		this.operation="";
	}
	if(this.replace || input.value=="0")
	{
		input.value=value;
		this.replace=false;
	}
	else
		input.value+=value;
}
Calculator.prototype.operationClick=function(oper,top,bottom)
{
	if(this.operation=="sqrt")
	{	
		top.value="";
		//this.memory=bottom.value
		this.operation=oper;
		//this.equalClick(this.operation,this.memory,+bottom.value);
		
		
	}
	top.value+=bottom.value+oper;
	if(this.operation=="")
	{
		this.memory=+bottom.value;
	}
	else
	{
		this.memory=this.equalClick(this.operation,this.memory,+bottom.value);
		bottom.value=this.memory;
	}
	this.operation=oper;
	this.replace=true;
}
Calculator.prototype.equalClick=function(oper,a,b)
{	
	var operFunc={
		"+":function(a,b)
		{
			return a+b;
		},
		"-":function(a,b)
		{
			return a-b;
		},
		"*":function(a,b)
		{
			return a*b;
		},
		"/":function(a,b)
		{
			return a/b;
		}
	}
	var func=operFunc[oper]
	return func(a,b);
}
Calculator.prototype.sqrtClick=function(top,bottom)
{	
	top.value="sqrt("+bottom.value+")";
	bottom.value=Math.sqrt(+bottom.value);
	this.operation="sqrt";

}