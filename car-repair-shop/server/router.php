<?php

if($request->is('GET','cars')) {
	$response->cars = $db->all('
		SELECT cars.*, mechanics.name as mechanic
		FROM cars, mechanics
		WHERE cars.mechanic_id = mechanics.id
		ORDER BY cars.id
	');
}
else if($request->is('GET','cars/[0-9]+')) {
	$id = (int) $request->segment(1);
	$response->car = $db->one('SELECT * FROM cars WHERE id = ?', [ $id ]);
	if(!$response->car) {
		$response->code(404);
		$response->error('404: Car Not Found.');
	}
}


else if($request->is('POST','cars/[0-9]+') || $request->is('POST','cars')) {
	$id = (int) $request->segment(1, 0);
	$car = $request->data;
	if($car) {	
		if(strlen($car->brand) < 1) $response->error('Brand is empty.');
		if(strlen($car->model) < 1) $response->error('Model is empty.');
		if(strlen($car->year) < 1) $response->error('Year is empty.');
		if(intval($car->year) < 1980 || intval($car->year) > intval(date("Y"))) $response->error('Year is invalid.');
		
		$mechanic = $db->one('SELECT * FROM mechanics WHERE id = ?', [ $car->mechanic_id ]);
		if($mechanic == null) {
			$response->error('Mechanic is invalid.');
		}
	}
	else {
		$response->error('No JSON data sent.');
	}
	
	if($response->hasErrors()) {
		$response->code(400);
		$response->error('400: Invalid input.');
	}
	else {
		if($id > 0) {
			$result = $db->exec(
				'UPDATE cars SET brand=?, model=?, year=?, mechanic_id=? WHERE id=?', 
				[$car->brand, $car->model, $car->year, $car->mechanic_id, $id]
			);
		} else {
			$result = $db->exec(
				'INSERT INTO cars SET brand=?, model=?, year=?, mechanic_id=?', 
				[$car->brand, $car->model, $car->year, $car->mechanic_id]
			);
			$id = $db->insert_id;
		}
		
		$response->car = $db->one('SELECT * FROM cars WHERE id = ?', [$id]);
		$response->info('Car saved.');	
	}
}



else if($request->is('DELETE','cars/[0-9]+')) {
	$id = (int) $request->segment(1);
	$db->exec('DELETE FROM problems WHERE car_id = ?', [$id] );
	$db->exec('DELETE FROM cars WHERE id = ?', [$id] );
	$response->info("Car id=$id and its problems deleted.");
}

else if($request->is('GET','cars/[0-9]+/problems')) {
	$cid = (int) $request->segment(1);
	$response->car = $db->one('SELECT * FROM cars WHERE id = ?', [$cid] );
	$response->problems = [];
	if($response->car) {
		$response->problems = $db->all('SELECT * FROM problems WHERE car_id = ?', [$cid] );
	}
	else {
		$response->code(404);
		$response->error("404: Car not found.");
	}
}

else if($request->is('GET', 'problems/[0-9]+')){
	$problem_id = (int) $request->segment(1);
	$response->problem = $db->one('SELECT * FROM problems WHERE id = ?', [$problem_id]);
	if(!$response->problem){
		$response->code(404);
		$response->error('404: Problem Not Found.');
	}
}

else if($request->is('POST','problems/[0-9]+') || $request->is('POST','problems')) {
	$problem_id = (int) $request->segment(1);
	$problem = $request->data; 
	if($problem) {
		if(strlen($problem->problem) < 1) $response->error('Problem is empty.');
		if($problem->car_id < 1) $response->error('Missing car_id.');
		if($problem->price <= 0) $response->error('Price is empty.');
	}
	else {
		$response->error('No JSON data sent.');
	}
	
	if($response->hasErrors()) {
		$response->code(400);
		$response->error('400: Invalid input.');		
	}
	else {
		$args = [$problem->car_id, $problem->price, $problem->problem, $problem_id];
		
		if($problem_id > 0) { 
			$result = $db->exec('UPDATE problems SET car_id=?, price=?, problem=? WHERE id=?', $args);
		} else {
			$result = $db->exec('INSERT INTO problems SET car_id=?, price=?, problem=?', $args);
			$problem_id = $db->insert_id;
		}

		$response->problem = $db->one('SELECT * FROM problems WHERE id = ?', [$problem_id]);
		$response->info('Problem saved.');	
	}
}


else if($request->is('DELETE', 'problems/[0-9+]')) {
	$problem_id = (int) $request -> segment(1);
	$db -> exec('DELETE FROM problems WHERE id = ?', [$problem_id]);
	$response -> info("Problem id=$problem_id deleted.");
}

else if($request->is('GET','mechanics')) {
	$response->mechanics = $db->all('SELECT * FROM mechanics ORDER BY id');
}
else {
	$response->error('404: URL Not Found: /'.$request->path);
	$response->code(404);
}

echo $response->render();
