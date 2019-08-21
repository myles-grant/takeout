<?php


define("NOT_NULL", "not_null");


function db_add_value($connect, $table, $columns, $values)
{
	if(!is_array($columns))
	{
		$columns = array($columns);
		$values = array($values);
	}

	$query = " INSERT INTO `$table` ";
	$column = " ";
	$value = " ";

	for($i=0; $i<count($columns); $i++)
	{
		if($i == 0)
		{
			$column = " (`$columns[$i]`, ";
			$value = " (:$columns[$i], ";
		}
		else if($i > 0 && $i != count($columns)-1)
		{
			$column .= " `$columns[$i]`, ";
			$value .= " :$columns[$i], ";
		}
		else if ($i == count($columns)-1) 
		{
			$column .= " `$columns[$i]`) ";
			$value .= " :$columns[$i]) ";
		}
	}

	$query .= $column;
	$query .= " VALUES ";
	$query .= $value;

	$insert = $connect->prepare($query);
	for($i=0; $i<count($values); $i++) 
	{
		$insert->bindParam(":".$columns[$i], $values[$i]);
	}
	$insert->execute();

	//Get row id
	return $connect->lastInsertId();
}


function db_update_value($connect, $table, $columns, $values, $whereColumns, $whereValues, $limit = NULL, $customBind = NULL)
{
	if(!is_array($columns))
	{
		$columns = array($columns);
		$values = array($values);
	}

	if(!is_array($whereColumns))
	{
		$whereColumns = array($whereColumns);
		$whereValues = array($whereValues);
	}

	$query = "UPDATE `$table` SET ";

	//Value Clause
	$value = " ";
	if($customBind == NULL)
	{
		for($i=0; $i<count($columns); $i++)
		{
			if($i == 0)
			{
				$value .= " `$columns[$i]` = ";
				$value .= " :$columns[$i] ";
			}
			else if($i > 0 && $i != count($columns)-1)
			{
				$value .= " , `$columns[$i]` = ";
				$value .= " :$columns[$i] ";
			}
			else if ($i == count($columns)-1) 
			{
				$value .= " , `$columns[$i]` = ";
				$value .= " :$columns[$i] ";
			}
		}
	}
	else
	{
		$value = $customBind; 
	}
	$query .= $value;


	//where Clause
	$where = " WHERE ";
	for($i=0; $i<count($whereColumns); $i++)
	{
		if($i == 0)
		{
			if($whereValues[$i] == null)
			{
				$where .= "`$whereColumns[$i]` IS NULL ";
			}
			else if($whereValues[$i] == NOT_NULL)
			{
				$where .= "`$whereColumns[$i]` IS NOT NULL ";
			}
			else
			{
				$where .= "`$whereColumns[$i]` = :$whereColumns[$i] ";
			}
		}
		else if($i > 0 && $i != count($whereColumns)-1)
		{
			if($whereValues[$i] == null)
			{
				$where .= " AND `$whereColumns[$i]` IS NULL ";
			}
			else if($whereValues[$i] == NOT_NULL)
			{
				$where .= " AND `$whereColumns[$i]` IS NOT NULL ";
			}
			else
			{
				$where .= " AND `$whereColumns[$i]` = :$whereColumns[$i] ";
			}
		}
		else if ($i == count($whereColumns)-1) 
		{
			if($whereValues[$i] == null)
			{
				$where .= " AND `$whereColumns[$i]` IS NULL ";
			}
			else if($whereValues[$i] == NOT_NULL)
			{
				$where .= " AND `$whereColumns[$i]` IS NOT NULL ";
			}
			else
			{
				$where .= " AND `$whereColumns[$i]` = :$whereColumns[$i] ";
			}
		}
	}
	$query .= $where;

	//Limit
	if($limit != NULL)
	{
		$query .= " LIMIT " . $limit;
	}

	$update = $connect->prepare($query);
	for($i=0; $i<count($values); $i++) 
	{
		$update->bindParam(":".$columns[$i], $values[$i]);
	}

	for($x=0; $x<count($whereValues); $x++) 
	{
		if($whereValues[$x] != null && $whereValues[$x] != NOT_NULL) {
			$update->bindParam(":".$whereColumns[$x], $whereValues[$x]);
		}
	}

	$update->execute();	

	$rowCount = $update->rowCount();
	if($rowCount > 0)
	{
		//Value was updated
		return true; 
	}
	else
	{
		//Value was not updated
		return false;
	}
}


function db_get_value($connect, $table, $columns, $values, $limit = NULL, $selectedColumns = NULL)
{
	if(!is_array($columns))
	{
		$columns = array($columns);
		$values = array($values);
	}

	$query = "SELECT * FROM `$table` ";

	//Where Clause
	$where = " WHERE ";
	for($i=0; $i<count($columns); $i++)
	{
		if($i == 0)
		{
			if($values[$i] == null)
			{
				$where .= "`$columns[$i]` IS NULL ";
			}
			else if($values[$i] == NOT_NULL)
			{
				$where .= "`$columns[$i]` IS NOT NULL ";
			}
			else
			{
				$where .= "`$columns[$i]` = ";
				$where .= " :$columns[$i] ";
			}
		}
		else if($i > 0 && $i != count($columns)-1)
		{
			if($values[$i] == null)
			{
				$where .= " AND `$columns[$i]` IS NULL ";
			}
			else if($values[$i] == NOT_NULL)
			{
				$where .= " AND `$columns[$i]` IS NOT NULL ";
			}
			else 
			{
				$where .= " AND `$columns[$i]` = ";
				$where .= " :$columns[$i] ";
			}
		}
		else if ($i == count($columns)-1) 
		{
			if($values[$i] == null)
			{
				$where .= " AND `$columns[$i]` IS NULL ";
			}
			else if($values[$i] == NOT_NULL)
			{
				$where .= " AND `$columns[$i]` IS NOT NULL ";
			}
			else
			{
				$where .= " AND `$columns[$i]` = ";
				$where .= " :$columns[$i] ";
			}
		}
	}
	$query .= $where;

	//Limit
	if($limit != NULL)
	{
		$query .= " LIMIT " . $limit;
	}


	$select = $connect->prepare($query);
	for($i=0; $i<count($values); $i++) 
	{
		if($values[$i] != null && $values[$i] != NOT_NULL) {
			$select->bindParam(":".$columns[$i], $values[$i]);
		}
	}
	$select->execute();	

	$rowCount = $select->rowCount();
	if($rowCount > 0)
	{
		//Add selected rows into array
		$rows = array();
		if($selectedColumns != NULL)
		{
			while($row = $select->fetch(PDO::FETCH_ASSOC))
			{
				//Loop through each selected column
				$newRow = array();
				for($i=0;  $i<count($selectedColumns); $i++) 
				{
					$newRow[$selectedColumns[$i]] = $row[$selectedColumns[$i]];
				}
				array_push($rows, $newRow);
			}
		}
		else
		{
			return $select->fetchAll(PDO::FETCH_ASSOC);
		}
		
		return $rows; //regular $select->fetch(PDO::FETCH_ASSOC) only returns 1 row even if multiple rows are selected
	}
	else
	{
		//Value does not exist
		return array();
	}
}





function db_check_value($connect, $table, $columns, $values, $limit = NULL)
{
	if(!is_array($columns))
	{
		$columns = array($columns);
		$values = array($values);
	}

	$query = "SELECT * FROM `$table` ";

	//Where Clause
	$where = " WHERE ";
	for($i=0; $i<count($columns); $i++)
	{
		if($i == 0)
		{
			if($values[$i] == null)
			{
				$where .= "`$columns[$i]` IS NULL ";
			}
			else
			{
				$where .= "`$columns[$i]` = ";
				$where .= " :$columns[$i] ";
			}
			
		}
		else if($i > 0 && $i != count($columns)-1)
		{
			if($values[$i] == null)
			{
				$where .= " AND `$columns[$i]` IS NULL ";
			}
			else
			{
				$where .= " AND `$columns[$i]` = ";
				$where .= " :$columns[$i] ";
			}
		}
		else if ($i == count($columns)-1) 
		{
			if($values[$i] == null)
			{
				$where .= " AND `$columns[$i]` IS NULL ";
			}
			else
			{
				$where .= " AND `$columns[$i]` = ";
				$where .= " :$columns[$i] ";
			}
		}
	}
	$query .= $where;

	//Limit
	if($limit != NULL)
	{
		$query .= " LIMIT " . $limit;
	}

	$select = $connect->prepare($query);
	for($i=0; $i<count($values); $i++) 
	{
		if($values[$i] != null) {
			$select->bindParam(":".$columns[$i], $values[$i]);
		}
	}
	$select->execute();	

	if($select->rowCount() > 0)
	{
		//Value already exist
		return true;
	}
	else
	{
		//Value does not exist
		return false;
	}
}


function db_delete_row($connect, $table, $columns, $values, $limit = NULL)
{
	if(!is_array($columns))
	{
		$columns = array($columns);
		$values = array($values);
	}

	$query = "DELETE FROM `$table` ";

	//Where Clause
	$where = " WHERE ";
	for($i=0; $i<count($columns); $i++)
	{
		if($i == 0)
		{
			$where .= "`$columns[$i]` = ";
			$where .= " :$columns[$i] ";
		}
		else if($i > 0 && $i != count($columns)-1)
		{
			$where .= " AND `$columns[$i]` = ";
			$where .= " :$columns[$i] ";
		}
		else if ($i == count($columns)-1) 
		{
			$where .= " AND `$columns[$i]` = ";
			$where .= " :$columns[$i] ";
		}
	}
	$query .= $where;

	//Limit
	if($limit != NULL)
	{
		$query .= " LIMIT " . $limit;
	}

	$select = $connect->prepare($query);
	for($i=0; $i<count($values); $i++) 
	{
		$select->bindParam(":".$columns[$i], $values[$i]);
	}
	$select->execute();
	
	if($select->rowCount() > 0)
	{
		//Value already exist
		return true;
	}
	else
	{
		//Value does not exist
		return false;
	}
}



function db_get_values($connect, $columns, $values, $selectedColumns, $query)
{
	if(!is_array($columns))
	{
		$columns = array($columns);
		$values = array($values);
	}

	$select = $connect->prepare($query);
	if($columns != NULL)
	{
		for($i=0; $i<count($columns); $i++) 
		{
			$select->bindParam(":".$columns[$i], $values[$i]);
		}
	}
	$select->execute();	

	$rowCount = $select->rowCount();
	if($rowCount > 0)
	{
		//Add selected rows into array
		$rows = array();
		if($selectedColumns != NULL)
		{
			while($row = $select->fetch(PDO::FETCH_ASSOC))
			{
				//Loop through each selected column
				$newRow = array();
				for($i=0;  $i<count($selectedColumns); $i++) 
				{
					$newRow[$selectedColumns[$i]] = $row[$selectedColumns[$i]];
				}
				array_push($rows, $newRow);
			}
		}
		else
		{
			$rows = $select->fetchAll(PDO::FETCH_ASSOC);
		}
		
		return $rows;
	}
	else
	{
		//Value does not exist
		return array();
	}
}




function db_check_values($connect, $columns, $values, $query)
{
	if(!is_array($columns))
	{
		$columns = array($columns);
		$values = array($values);
	}

	$select = $connect->prepare($query);
	if($columns != NULL)
	{
		for($i=0; $i<count($columns); $i++) 
		{
			$select->bindParam(":".$columns[$i], $values[$i]);
		}
	}
	$select->execute();	

	if($select->rowCount() > 0)
	{
		//Value already exist
		return true;
	}
	else
	{
		//Value does not exist
		return false;
	}
}




function db_update_values($connect, $columns, $values, $query)
{
	if(!is_array($columns))
	{
		$columns = array($columns);
		$values = array($values);
	}

	$update = $connect->prepare($query);
	if($columns != NULL)
	{
		for($i=0; $i<count($columns); $i++) 
		{
			$update->bindParam(":".$columns[$i], $values[$i]);
		}
	}
	$update->execute();	

	$rowCount = $update->rowCount();
	if($rowCount > 0)
	{
		//Value was updated
		return true; 
	}
	else
	{
		//Value was not updated
		return false;
	}
}



?>