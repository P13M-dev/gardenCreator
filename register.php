<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<style>
    body{
        background-color: #fff;
        font-family: 'Segoe UI', system-ui, sans-serif;
    }
    .title{
        padding:1rem;
        border-radius: 1rem;
        background-color: #2ecc71;
        color:#fff;
        position:absolute;
        left: 50%;
        top: 10%;
        transform: translate(-50%, -50%);
        font-size:4rem;
    }
    .form{
        background-color: #e0f4ff;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        padding: 3rem;
        border-radius: 1rem;
        text-align:center;
    }
    input[type=text], input[type=password] {
        width: 15rem;
        height: 3rem;
        font-size:1.5rem;
        padding: 1rem ;
        margin: 8px 0;
        display: inline-block;
        border: 1px solid #ccc;
        box-sizing: border-box;
        border-radius: 0.5rem;
    }
    a{
        text-decoration: none;}
</style>
<body>
    <a href="./index.php">
    <div class="back-button">

    </div></a>
    <div></div>
    <div class="title">
        Rejestracja
    </div>
    <div class="form">
    <form action="actions.php" method="post">
        <input type="hidden" name="type" value="register">
        <input type="text" name="login" placeholder="Login"><br>
        <input type="text" name="displayName" placeholder="Wyświetlana Nazwa"><br>
        <input type="text" name="email" placeholder="Email"><br>
        <input type="password" name="password" placeholder="Hasło"><br>
        <input type="password" name="rep_password" placeholder="Powtórz hasło"><br>
        <input type="submit" value="Zaloguj się">
    </form>
    <a href="./login.php">Mam już konto.</a>
    </div>

</body>
</html>