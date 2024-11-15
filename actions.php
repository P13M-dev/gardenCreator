<?php
 if(isset($_POST['type'])){
    $type = $_POST['type'];
    session_start();

    if($type == 'login' && empty($_SESSION['user_id'])){
        $login = $_POST['login'];
        $password = $_POST['password'];
        $connection = mysqli_connect("localhost", "muchAdmin", "ImDefinetelyNot16YO.","userbase"); 
        $passwordfound = ($connection->query("SELECT haslo FROM users WHERE login='$login'")->fetch_assoc())['haslo'];

        if($passwordfound == $password ){
            $_SESSION['user_id'] = $login;
            mysqli_close($connection);
            header("Location: ./index.php");
            exit();
        } else {
            mysqli_close($connection);
            header("Location: ./login.php?invalid=1");
            exit();
        }
    
    } else if($type == 'register' && empty($_SESSION['user_id'])){
        $displayName = $_POST['displayName'];
        $login = $_POST['login'];
        $email = $_POST['email'];
        $password = $_POST['password'];
        $rep_password = $_POST['rep_password'];
        $connection = mysqli_connect("localhost", "muchAdmin", "ImDefinetelyNot16YO.","userbase"); 
        $isEmailDefined = ($connection->query("SELECT Count(*) FROM users WHERE email='$email'")->num_rows)==0;
        $isLoginDefined = ($connection->query("SELECT Count(*) FROM users WHERE login='$login'")->num_rows)==0;
        if($password == $rep_password && $isEmailDefined && $isLoginDefined){
            $date = date('Y/m/d');
            $sql = "INSERT INTO users(login,nazwa,haslo,email,dataStworzenia) VALUES ('$login','$displayName','$password','$email','$date')";
            $connection->query($sql);
            $_SESSION['user_id'] = $login;
            mysqli_close($connection);
            header("Location: ./index.php");
            exit();
        }
    
    } else if($type == 'logout'){
        session_unset();
        session_destroy();
        $_SESSION = array();
        header("Location: ./index.php");
        exit();
    } else if($type == 'saveGarden' && isset($_SESSION['user_id'])){
        
    } 
    
 } else {
    echo "wtf";
 }
?>