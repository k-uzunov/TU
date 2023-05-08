var MECHANICS = [];

function reload_cars() {
	$.get('cars').done(function(data) {
		$('#cars').html(render_cars(data.cars));
		$('#cars-messages').html(render_messages(data.messages));
	}).fail(function(response) {
		var data = response.responseJSON;
		$('#cars-messages').html(render_messages(data.messages));
	});
}


function reload_problems(car_id) {
	$.get('cars/' + car_id + '/problems').done(function(data) {
		$('#problems').html(render_problems(data.car, data.problems));
		$('#problems-messages').html(render_messages(data.messages));
	}).fail(function(response) {
		var data = response.responseJSON;
		$('#problems-messages').html(render_messages(data.messages));
	});
}


function reload_mechanics() {
	$.get('mechanics').done(function(data) {
		MECHANICS = data.mechanics;
	}).fail(function(response) {
		var data = response.responseJSON;
		$('#cars-messages').html(render_messages(data.messages));
	});
}


$(document).ready(function() {
	
	reload_mechanics();
	reload_cars();

	$(document).on('click', 'a.cars-refresh', function() {
		reload_cars();
		return false
	});

	$(document).on('click', 'a.car-add', function() {
		var new_car = { id: '', brand: '', model: '',	year: '' };
		$('#car-edit').html(render_car_form(new_car));
		$('#car-messages').html('');
		return false;
	});

	$(document).on('click', 'a.car-edit', function() {
		var id = $(this).attr('data-id');
		$.get('cars/'+id).done(function(data) {
			//console.log(data)
			$('#car-edit').html(render_car_form(data.car));	
			$('#car-messages').html(render_messages(data.messages));
		}).fail(function(response) {
			var data = response.responseJSON;
			$('#car-messages').html(render_messages(data.messages));
		});
		return false;
	});

	$(document).on('submit', '#car-edit > form', function() {
		var car = $(this).serializeObject();
		$.postJSON('cars/' + car.id, car).done(function(data) {
			$('#car-edit').html('');
			$('#car-messages').html(render_messages(data.messages));
			reload_cars();
		}).fail(function(response) {
			var data = response.responseJSON;
			$('#author-messages').html(render_messages(data.messages));
		});
		return false;
	});

	$(document).on('click', 'a.car-delete', function() {
		var id = $(this).attr('data-id');
		$.delete('cars/' + id).done(function(data) {
			reload_cars();
			$('#cars-messages').html(render_messages(data.messages));
			$('#problems').html(" ");
		}).fail(function(response) {
			var data = response.responseJSON;
			$('#cars-messages').html(render_messages(data.messages));
		});
		return false;
	});

	$(document).on('click', 'a.show-problems, a.problems-refresh', function() {
		var car_id = $(this).attr('data-id');
		reload_problems(car_id);
		$('#problem-edit').html('');
		$('#problem-messages').html('');
		return false;
	});

	$(document).on('click', 'a.problem-add', function() {
		var car_id = $(this).attr('data-id');
		var new_problem = { id: '', car_id: car_id, problem: '', price: '' };
		$('#problem-edit').html(render_problems_form(new_problem));
		$('#problems-messages').html('');
		return false;
	});

	$(document).on('submit', '#problem-edit > form', function() {
		var problem = $(this).serializeObject();
		$.postJSON('problems/' + problem.id, problem).done(function(data) {
			$('#problem-edit').html('');
			$('#problem-messages').html(render_messages(data.messages));
			reload_problems(problem.car_id);
		}).fail(function(response) {
			var data = response.responseJSON;
			$('#problem-messages').html(render_messages(data.messages));
		});
		return false;
	});

	$(document).on('click', 'a.problem-edit', function() {
		var problem_id = $(this).attr('data-problem-id');
		$.get('problems/'+problem_id).done(function(data){
			$('#problem-edit').html(render_problems_form(data.problem));
			$('#problem-messages').html(render_messages(data.messages));					
		}).fail(function(response) {
			var data = response.responseJSON;
			$('#problem-messages').html(render_messages(data.messages));
		});
		return false;
	});

	$(document).on('submit', '#problem-edit > form', function() {
		var problem = $(this).serializeObject();
		$.postJSON('problems/' + problem.id, problem).done(function(data) {
			$('#problem-edit').html('');
			$('#problem-messages').html(render_messages(data.messages));
			reload_problems(problem.car_id);
		}).fail(function(response) {
			var data = response.responseJSON;
			$('#problem-messages').html(render_messages(data.messages));
		});
		return false;
	});

	$(document).on('click', 'a.problem-delete', function(){
		var problem_id = $(this).attr('data-problem-id');
		var car_id = $(this).attr('data-car-id');
		$.delete('problems/' + problem_id).done(function(data){
			reload_problems(car_id);
		});
		return false;
	});
});
