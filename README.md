# zoiA

A beautiful JavaScript template engine for HTML.

## Born to be Beautiful

zoiA is Born to be Beautiful for HTML templates.

### Ugly templates

Yes, when we write HTML template code, we are writing HTML tags/attributes etc. But, almost every template engine has it's own directive code beyond the HTML code.

	<%if(condition){%>
		<div>some HTML pieces with a <%=varible%></div>
	<%}%>

or like this:

	{{if condition}}
		<div>some HTML pieces with a ${varible}</div>
	{{end if}}

In fact, not so bad, yes?

What about this one?

	<%for(var i=0;i<myObj.myArr.length;i++){%>
		<%if(myObj.myArr[i].show){%>
			<div class="select">
				<lable>Please Select:</label>
				<select name="mySelect">
				<%for(var j=0;j<myObj.myArr[i].options.length;j++){%>
					<option value="<%=myObj.myArr[i].options[j].value%>" <%if(currValue === myObj.myArr[i].options[j].value){%>selected<%}%>><%=myObj.myArr[i].options[j].text%></option>
				<%}%>
				</select>
			</div>
		<%}%>
	<%}%>

Oh, no! Can you tell what I'm doing?

### zoiA's beauty

	<div class="select" z-repeat="arrItem:myObj.myArr" z-if="arrItem.show">
		<label>Please Select:</label>
		<select name="mySelect">
			<option value="{{optionItem.value}}" z-repeat="optionItem:arrItem.options" z-selected="currValue">
				{{optionItem.text}}
			</option>
		</select>
	</div>

See? It's simple and beautiful.
