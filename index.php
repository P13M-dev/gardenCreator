<?php
session_start();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Garden Vision</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
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

        .cta-button {
            display: inline-block;
            padding: 1rem 2rem;
            font-size: 1.25rem;
            background: var(--primary);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            transition: all 0.3s ease;
            font-weight: 600;
        }

        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
            background-color: var(--primary-dark);
        }

        .features {
            padding: 6rem 2rem;
            background: white;
        }

        .section-title {
            text-align: center;
            font-size: 2.5rem;
            color: var(--text-dark);
            margin-bottom: 3rem;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
        }

        .feature-card {
            background: white;
            padding: 2rem;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }

        .feature-card:hover {
            transform: translateY(-5px);
        }

        .feature-icon {
            font-size: 2.5rem;
            color: var(--primary);
            margin-bottom: 1rem;
        }

        .feature-title {
            font-size: 1.5rem;
            color: var(--text-dark);
            margin-bottom: 1rem;
        }

        .feature-description {
            color: var(--text-light);
            line-height: 1.6;
        }

        .news {
            padding: 6rem 2rem;
            background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
        }

        .news-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
        }

        .news-card {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }

        .news-card:hover {
            transform: translateY(-5px);
        }

        .news-image {
            width: 100%;
            height: 200px;
            background: var(--primary);
            position: relative;
            overflow: hidden;
        }

        .news-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .news-content {
            padding: 1.5rem;
        }

        .news-date {
            color: var(--primary);
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
        }

        .news-title {
            font-size: 1.25rem;
            color: var(--text-dark);
            margin-bottom: 1rem;
        }

        .news-excerpt {
            color: var(--text-light);
            line-height: 1.6;
            margin-bottom: 1rem;
        }

        .read-more {
            color: var(--primary);
            text-decoration: none;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }

        .read-more:hover {
            color: var(--primary-dark);
        }

        footer {
            background: var(--text-dark);
            color: white;
            padding: 4rem 2rem;
            text-align: center;
        }

        .footer-content {
            max-width: 1200px;
            margin: 0 auto;
        }

        .social-links {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 2rem;
        }

        .social-link {
            color: white;
            font-size: 1.5rem;
            transition: transform 0.3s ease;
        }

        .social-link:hover {
            transform: translateY(-3px);
        }

        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }

        .scroll-to-top {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: var(--primary);
            color: white;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1000;
        }

        .scroll-to-top.visible {
            opacity: 1;
        }

        @media (max-width: 768px) {
            h1 {
                font-size: 2.5rem;
            }
            
            .content {
                text-align: center;
                padding: 1rem;
            }

            .features, .news {
                padding: 4rem 1rem;
            }

            .section-title {
                font-size: 2rem;
            }
        }
        .user-buttons {
            position: absolute;
            top:2.5rem;
            left: 105em;
            transform:translateX(-50%) translateY(-50%);
        }
        .login-button,.register-button {
            font-family: 'Segoe UI', system-ui, sans-serif;
            text-align: center;
            font-size:1.5rem;
            background-color: var(--primary);
            color: #fff;
            border: none;
            width: 6rem;
            height: 3.5rem;
            border-radius: 0.5rem;
            padding:none;
            display: table;

        }
        .login-button span,.register-button span {
            
            display: table-cell;
            vertical-align: middle;
            line-height: normal;
        }
        .user-table {
            border-spacing: 1.5rem 0rem;
        }
        a{
            text-decoration: none;
        }
        .user-info {
            display: inline-block;
            margin-right: 1.5rem;
            font-size: 1.5rem;
            color: var(--text-dark);
        }

        .user-buttons {
                position: static;
                transform: none;
                
                justify-content: center;
            }

        .logout-button form {
            margin: 0;
            padding: 0;
        }

        .logout-button input[type="submit"] {
            font-family: 'Segoe UI', system-ui, sans-serif;
            text-align: center;
            font-size: 1.5rem;
            background-color: var(--primary);
            color: #fff;
            border: none;
            width: 6rem;
            height: 3.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .logout-button input[type="submit"]:hover {
            background-color: var(--primary-dark);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
        }

        /* Update existing login/register buttons for consistency */
        .login-button, .register-button {
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .login-button:hover, .register-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
            background-color: var(--primary-dark);
        }

        /* Responsive styles */
        @media (max-width: 1200px) {
            .user-buttons {
                right: 1rem;
            }
        }

        @media (max-width: 768px) {
            .user-buttons {
                position: static;
                transform: none;
                padding: 0.5rem;
                justify-content: center;
            }

            .user-table {
                border-spacing: 0.75rem 0;
            }

            .login-button, .register-button, .logout-button input[type="submit"] {
                width: 8rem;
                height: 3.5rem;
                font-size: 1.2rem;
            }

            .user-info {
                font-size: 1.2rem;
                margin-right: 1rem;
            }
        }

        @media (max-width: 480px) {
            .user-buttons {
                flex-direction: column;
                gap: 0.75rem;
                align-items: stretch;
            }

            .user-table {
                width: 100%;
            }

            .login-button, .register-button, .logout-button input[type="submit"] {
                width: 100%;
                height: 3rem;
                font-size: 1.1rem;
            }

            .user-info {
                text-align: center;
                margin-right: 0;
                margin-bottom: 0.5rem;
            }

            .logout-button {
                width: 100%;
            }
        }

        .login-button:active, .register-button:active, .logout-button input[type="submit"]:active {
            transform: translateY(1px);
            box-shadow: 0 2px 6px rgba(46, 204, 113, 0.2);
        }
    </style>
    <link rel="shortcut icon" href="https://cdn-icons-png.flaticon.com/512/6959/6959474.png" type="image/x-icon">
</head>
<body>
    <nav class="nav">
        <div class="logo">
            <i class="fas fa-leaf"></i>
            Garden Vision
        </div>
        <div class="user-buttons">
            <?php
            if(empty($_SESSION['user_id'])){
                echo "
                <table class=\"user-table\">
                    <tr>
                        <td><a href=\"./login.php\"><div class=\"login-button\"><span>Logowanie</span></div></a></td>
                        <td><a href=\"./register.php\"><div class=\"register-button\"><span>Rejestracja</span></div></a></td>
                    </tr>
                </table>";

            } else {
                echo "  <div class=\"user-info\"></div>
                        <div class=\"logout-button\"><form action=\"actions.php\" method=\"post\"><input type=\"hidden\" name=\"type\" value=\"logout\"><input type=\"submit\" value=\"Wyloguj\"></form></div>
                    ";
            }

            ?>    
        </div>
    </nav>
    <main>
        <section class="hero">
            <div class="content">
                <h1>Zaprojektuj swój ogród w 3D</h1>
                <p>Przekształć twoją przestrzeń zewnętrzną używając naszego intuicyjnego planera 3D. Zwizualizuj, zaaranżuj i udoskonal swój projekt zanim zostanie on stworzony.</p>
                <a href="3d-view/gpt-planner.html" class="cta-button">Rozpocznij planowanie <i class="fas fa-arrow-right"></i></a>
            </div>
        </section>

        <section class="features">
            <h2 class="section-title">Potężne funkcje</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <i class="fas fa-cube feature-icon"></i>
                    <h3 class="feature-title">Wizualizacja 3d</h3>
                    <p class="feature-description">Ujrzyj swój nowy ogród po raz pierwszy przy użyciu renderowania 3D oraz podglądu w czasie rzeczywistym.</p>
                </div>
                <div class="feature-card">
                    <i class="fas fa-seedling feature-icon"></i>
                    <h3 class="feature-title">Biblioteka kwiatów</h3>
                    <p class="feature-description">Uzyskaj dostęp do różnych roślin, wraz ze wskazówkami ich dotyczącymi. </p>
                </div>
                <div class="feature-card">
                    <i class="fa-solid fa-brain feature-icon"></i>
                    <h3 class="feature-title">Analiza AI</h3>
                    <p class="feature-description">Otrzymaj spersonalizowaną analizę twojego ogrodu przez sztuczną inteligencję</p>
                </div>
            </div>
        </section>

        <section class="news">
            <h2 class="section-title">Ostatnie informacje</h2>
            <div class="news-grid">
                <div class="news-card">
                    <div class="news-image">
                        <img src="https://picsum.photos/id/400/320" alt="New Features Release">
                    </div>
                    <div class="news-content">
                        <div class="news-date">14 Listopada 2024</div>
                        <h3 class="news-title">New Release</h3>
                        <p class="news-excerpt">Skorzystaj z najnowszego wydania - v.0.9 - ze wzmocnionym silnikiem 3d oraz nowymi roślinami.</p>
                        <!-- <a href="#" class="read-more">Read More <i class="fas fa-arrow-right"></i></a> -->
                    </div>
                </div>
                <div class="news-card">
                    <div class="news-image">
                        <img src="https://picsum.photos/id/400/320" alt="Community Showcase">
                    </div>
                    <div class="news-content">
                        <div class="news-date">12 Listopada 2024</div>
                        <h3 class="news-title">Nowe modele!</h3>
                        <p class="news-excerpt">Wypróbuj nasze świetne modele 3D stworzone przez wspaniałych członków zespołu twórców.</p>
                        <!-- <a href="#" class="read-more">Read More <i class="fas fa-arrow-right"></i></a> -->
                    </div>
                </div>
                <div class="news-card">
                    <div class="news-image">
                        <img src="https://picsum.photos/id/400/320" alt="Seasonal Tips">
                    </div>
                    <div class="news-content">
                        <div class="news-date">10 Listopada 2024</div>
                        <h3 class="news-title">Ogłoszenie</h3>
                        <p class="news-excerpt">Przygotuj się na naszą premierę!</p>
                        <!-- <a href="#" class="read-more">Read More <i class="fas fa-arrow-right"></i></a> -->
                    </div>
                </div>
            </div>
        </section>

        <footer>
            <div class="footer-content">
                <div class="logo">
                    <i class="fas fa-leaf"></i>
                    <span style="color:white;">Garden Vision</span>
                </div>
                <div class="social-links">
                    <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
                    <a href="#" class="social-link"><i class="fab fa-facebook"></i></a>
                    <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
                    <a href="#" class="social-link"><i class="fab fa-youtube"></i></a>
                </div> 
            </div>
        </footer>

        <div class="scroll-to-top">
            <i class="fas fa-arrow-up"></i>
        </div>
    </main>

    <script>
        // Smooth scroll to top
        const scrollToTop = document.querySelector('.scroll-to-top');
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 100) {
                scrollToTop.classList.add('visible');
            } else {
                scrollToTop.classList.remove('visible');
            }
        });

        scrollToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Animate cards on scroll
        const cards = document.querySelectorAll('.feature-card, .news-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1
        });

        cards.forEach(card => {
            card.style.opacity = 0;
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.6s ease';
            observer.observe(card);
        });
    </script>
</body>
</html>
