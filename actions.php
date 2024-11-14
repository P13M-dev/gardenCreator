<?php
 if(isset($_POST['type'])){
    $type = $_POST['type'];
    
    if($type == 'login'){
        $login = $_POST['login'];
        $password = $_POST['password'];
        # To dla ciebie bartek, dodaj tutaj kwerende dla $passwordfound = kwerenda dla loginu 
        if($passwordfound == $password){
            session_start();
            $_SESSION['user_id'] = $login;
            header("Location: ./index.php");
            exit();
        } else {
            header("Location: ./login.php?invalid=1");
            exit();
        }
    
    } else if($type == 'register'){
        $displayName = $_POST['displayName'];
        $login = $_POST['login'];
        $email = $_POST['email'];
        $password = $_POST['password'];
        $rep_password = $_POST['rep_password'];
        # sprawdź czy email jest już w bazie danych $isEmailDefined = $email;
        # sprawdź czy login,nie nazwa jest już w bazie danych $isLoginDefined = $login;
        if($password == $rep_password ){

            #dodaj do bazy danych użytkowników te dane login, displayName, email, password
            session_start();
            $_SESSION['user_id'] = $login;
            header("Location: ./index.php");
            exit();
        }
    
    } else if($type == 'logout'){
        session_unset();
        session_destroy();
        $_SESSION = array();
        header("Location: ./index.php");
        exit();
        } 
 } 
?>