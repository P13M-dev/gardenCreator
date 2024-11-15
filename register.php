<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rejestracja</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link rel="shortcut icon" href="https://cdn-icons-png.flaticon.com/512/6959/6959474.png" type="image/x-icon">
</head>
<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Segoe UI', system-ui, sans-serif;
    }

    :root {
        --primary: #2ecc71;
        --primary-dark: #27ae60;
        --text-dark: #2c3e50;
        --text-light: #34495e;
        --background: #f8fafc;
    }

    body{
        margin: 0;
        min-height: 100vh
    }

    body {
        background: var(--background);
        min-height: 100vh;
        overflow-x: hidden;
    }

    .nav {
        padding: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        z-index: 1000;
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }

    .logo {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-dark);
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .logo i {
        color: var(--primary);
    }

    .hero {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 6rem 2rem 2rem;
        position: relative;
        background: linear-gradient(135deg, #e0f4ff 0%, #ffffff 100%);
    }

    .content {
        max-width: 600px;
        z-index: 1;
        padding: 2rem;
    }

    h1 {
        font-size: 3.5rem;
        color: var(--text-dark);
        margin-bottom: 1.5rem;
        line-height: 1.2;
    }

    .hero p {
        font-size: 1.25rem;
        color: var(--text-light);
        margin-bottom: 2rem;
        line-height: 1.6;
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

    input[type=submit] {
        display: inline-block;
        width: 15rem;
        height: 3rem;
        font-size: 1.5rem;
        margin: 8px 0;
        background: var(--primary);
        color: white;
        text-decoration: none;
        border-radius: 8px;
        transition: all 0.3s ease;
        font-weight: 600;
        border: none
    }

    input[type=submit]:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
    }

    .form {
        display: flex;
        align-items: center;
        flex-direction: column;
    }

    .user-buttons {
        position: absolute;
        top:2.5rem;
        left: 105em;
        transform:translateX(-50%) translateY(-50%);
    }

    .back {
        font-family: 'Segoe UI', system-ui, sans-serif;
        text-align: center;
        font-size:1.5rem;
        background-color: var(--primary);
        color: #fff;
        border: none;
        width: 10rem;
        height: 4rem;
        border-radius: 0.5rem;
        padding:none;
        display: table;

    }

    .back span {
        
        display: table-cell;
        vertical-align: middle;
        line-height: normal;
    }
    .user-table {
        border-spacing: 1.5rem 0rem;
    }

    a {
        text-decoration: none;
    }
</style>
<body>
    <nav class="nav">
        <div class="logo">
            <i class="fas fa-leaf"></i>
            Garden Vision
        </div>
        <div class="user-buttons">
            <a href="./index.php"><div class="back"><span>Back</span></div></a>  
        </div>
    </nav>

    <a href="./index.php">
    <div class="back_button"></div>
    </a>
    
    <main>
        <section class="hero">
            <div class="content">
                <h1>Logowanie</h1>
        
                <div class="form">
                <form action="actions.php" method="post">
                    <input type="hidden" name="type" value="register">
                    <input type="text" name="login" placeholder="Login"><br>
                    <input type="text" name="displayName" placeholder="Nazwa konta"><br>
                    <input type="text" name="email" placeholder="Email"><br>
                    <input type="password" name="password" placeholder="Hasło"><br>
                    <input type="password" name="rep_password" placeholder="Powtórz hasło"><br>
                    <input type="submit" value="Stwórz Konto">
                </form>
                <a href="./login.php">Mam już konto.</a>
                </div>
            </div>
        </section>
    </main>

</body>
</html>
