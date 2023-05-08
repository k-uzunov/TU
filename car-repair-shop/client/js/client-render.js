function render_cars(items) {
	var html = "<tr>"+
			"<th>ID</th>"+
			"<th>Brand</th>"+
			"<th>Model</th>"+
			"<th>Year</th>"+
			"<th>Mechanic</th>"+
			"<th></th>"+
		"</tr>";

	for(var i=0; i<items.length; i++) {
		var car = items[i];
		html += "<tr>" +
			"<td>" + car.id + "</td>" +
			"<td><a href='#' data-id='" + car.id + "' class='show-problems'>" +
				html_escape(car.brand) +
			"</a></td>"+
			"<td>" + html_escape(car.model) + "</td>" +
			"<td>" + html_escape(car.year) + "</td>" +
			"<td>" + html_escape(car.mechanic) + "</td>" +
			"<td>" +
				"<a href='#' data-id='" + car.id + "' class='edit_icon car-edit'>Edit</a> " +
				"<a href='#' data-id='" + car.id + "' class='delete_icon car-delete'>Delete</a>" +
			"</td>" +
		"</tr>";
	}

	html = "<table class='grid'>"+html+"</table>";
	return html;
}

function render_car_form(car) {
	if(!car) return 'Empty car.';
	
	var html = '';
	var title = (car.id) ? 'Edit Car' : 'Add Car';
	
	html += "<h1>" + title + "</h1>";
	html += "<form action='#' method='post'>";
	html += "<p><label>ID</label><input name='id' value='" + html_escape(car.id) + "' readonly='readonly' /></p>";
	html += "<p><label>Brand</label><input name='brand' value='" + html_escape(car.brand) + "'/></p>";
	html += "<p><label>Model</label><input name='model' value='" + html_escape(car.model) + "'/></p>";
	html += "<p><label>Year</label><input name='year' value='" + html_escape(car.year) + "'/></p>";

	var select = "<select name='mechanic_id'>";
	select += "<option></option>";
	for(var i=0; i<MECHANICS.length; i++) {
		var mechanic = MECHANICS[i];
		var selected = (mechanic.id == car.mechanic_id) ? 'selected' : '';
		select += "<option value='"+mechanic.id+"' "+selected+">"+mechanic.name+"</option>";
	}
	select += "</select>";
	html += "<p><label>Mechanic</label>"+select+"</p>";

	html += "<p><button>Save</button></p>";
	html += "</form>";
	
	return html;
}

function render_problems(car, problems) {	
	var html = '';
	var total = 0;
	
	html += "<table class='grid'>";
	html += "<tr>"+
		"<th>ID</td>"+
		"<th>Problem</th>"+
		"<th>Price</th>"+
		"<th></th>"+
	"</tr>";
	for(var i=0; i<problems.length; i++) {
		var prob = problems[i];
		total += parseFloat(prob.price);
		html += "<tr>"+
			"<td>" + prob.id + "</td>" +
			"<td>" + html_escape(prob.problem) + "</td>" +
			"<td>" + prob.price + "</td>" +
			"<td>" +
				"<a href='#' data-car-id='" + car.id + "' data-problem-id='" + prob.id + "' class='edit_icon problem-edit'>Edit</a> " +
				"<a href='#' data-car-id='" + car.id + "' data-problem-id='" + prob.id + "' class='delete_icon problem-delete'>Delete</a>" +
			"</td>"+
		"</tr>";
	}
	html += "<tr><td>Total</td> <td>"+ total + "</td></tr>";
	html += "</table>";
	
	html += "<p>" +
		"<a href='#' data-id='" + car.id + "' class='add_icon problem-add'>Add New Problem</a> " +
		"<a href='#' data-id='" + car.id + "' class='refresh_icon problems-refresh'>Refresh</a>" +
		"</p>";

	return html;
}

function render_problems_form(problem) {
	if(!problem) return 'Empty problem.';
	
	var html = '';
	var title = (problem.id) ? 'Edit Problem' : 'Add Problem';
	
	html += "<h1>" + title + "</h1>";
	html += "<form action='#' method='post'>";
	html += "<p><label>ID</label><input name='id' value='" + html_escape(problem.id) + "' readonly='readonly' /></p>";
	html += "<p><label>CAR_ID</label><input name='car_id' value='" + html_escape(problem.car_id) + "' readonly='readonly' /></p>";
	html += "<p><label>Problem</label><input name='problem' value='" + html_escape(problem.problem) + "'/></p>";
	html += "<p><label>Price</label><input name='price' value='" + html_escape(problem.price) + "'/></p>";

	html += "<p><button>Save</button></p>";
	html += "</form>";
	
	return html;
}

function render_messages(messages) {
	var html = '';
	if(messages) {	
		for(var i = 0; i < messages.length; i++) {
			var m = messages[i];
			var css = (m.type === 'error') ? 'error_icon' : 'info_icon';
			html += "<p class='" + css + "'>" + m.text + "</p>";
		}
	}
	return html;
}

function get_mechanic(mechanic_id) {
	for(var i=0; i < MECHANICS.length; i++) {
		if(MECHANICS[i].id == mechanic_id) {
			return MECHANICS[i];
		}
	}
	return null;
}
	
function html_escape(val) {
	return (val+'')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/\'/g, '&apos;');
}

