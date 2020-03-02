<?php


$host="mysql-server.ucl.ac.uk";
$uname="ucjtuhe";
$pass="turhturh";
$database = "ucjtuhe";

$connection=mysql_connect($host,$uname,$pass); 

echo mysql_error();

//or die("Database Connection Failed");
$selectdb=mysql_select_db($database) or 
die("Database could not be selected"); 
$out=mysql_select_db($database)
or die("database cannot be selected <br>");



$result = mysql_query("SELECT  * FROM judge_quest");


$pasajeros = '';

if ($result) {
    while ($row = mysql_fetch_array($result)) {
       
        $pasajeros .= $row["ID"] . ",".$row["q1q01"] . ",".$row["q1q02"] . ",".$row["q1q03"] . ",".$row["q1q04"] . ",".$row["q1q05"] . ",".$row["q1q06"] . ",".$row["q1q07"] . ",".$row["q1q08"] . ",".$row["q1q09"] . ",".$row["q1q10"] . ",".$row["q1q11"] . ",".$row["q1q12"]  . ",".$row["q2q01"] . ",".$row["q2q02"] . ",".$row["q2q03"] . ",".$row["q2q04"] . ",".$row["q2q05"] . ",".$row["q2q06"] . ",".$row["q2q07"] . ",".$row["q2q08"] . ",".$row["q2q09"] . ",".$row["q2q10"] . ",".$row["q2q11"]."\r\n"; //note the comma here
    }
}
$filename = "pasajeros_" . date("Y-m-d_H-i"); 
header("Content-type: application/vnd.ms-excel");
header("Content-disposition: csv" . date("Y-m-d") . ".csv");
header("Content-disposition: filename=Judge1Quest.csv");
mysql_close($connection);
echo $pasajeros;
exit();
?>