<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Garden Planner - Home</title>
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Quattrocento:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
    <div id="splash-screen">
        <div id="topbar">
            <h1>Garden Planner</h1>
        </div>
        <div id="splash-desc">
            <h3>A brand-new, eco-first planner.</h3>
        </div>
        <div id="actions">
            <!-- <a href="3d-view/gpt-planner.html" class="try-button">Try it out!</a> -->
            <button href="3d-view/gpt-planner.html" class="button" id="trybtn" style="--clr: #FFE3E0">
                <span class="button__icon-wrapper">
                  <svg
                    viewBox="0 0 14 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="button__icon-svg"
                    width="10">
                    <path
                      d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                      fill="#203320">
                    </path>
                  </svg>
              
                  <svg
                    viewBox="0 0 14 15"
                    fill="none"
                    width="10"
                    xmlns="http://www.w3.org/2000/svg"
                    class="button__icon-svg button__icon-svg--copy">
                    <path
                      d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                      fill="#203320">
                    </path>
                  </svg>
                </span>
                Try it out!
              </button>
        </div>
        <div id="news-section">
            <div class="news-card">news 1</div>
            <div class="news-card">news 2</div>
            <div class="news-card">news 3</div>
            <div class="news-card">news 4</div>
        </div>
    </div>
    
    <div id="content">
        <!-- Content goes here -->
    </div> 

    <script src="script.js"></script>
</body>
</html>