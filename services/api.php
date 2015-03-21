<?php
	
	$data = array(
		'status' => 1,
		'user' => array(
				'name' => 'Jay Ramirez',
				'id' => 1725908
			),

		'system' => array(
			'timeout' => 240,
			'timenow' => date('H:i:s')
			)
	 );

	echo json_encode($data);
?>

