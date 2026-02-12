<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MindRest - Disconnect to Reconnect</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #2D5A58;
            --accent: #E67E56;
            --bg-light: #F4F7F9;
            --white: #ffffff;
            --glass: rgba(255, 255, 255, 0.8);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Poppins', sans-serif; background-color: var(--bg-light); color: #333; transition: 0.5s; }

        /* Stylish Bold Logo */
        .logo { 
            font-size: 32px; 
            font-weight: 800; 
            display: flex; 
            align-items: center; 
            gap: 10px;
            letter-spacing: -1px;
            cursor: pointer;
        }
        .logo-text {
            background: linear-gradient(45deg, #2D5A58, #5DAE8B, #E67E56);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        /* Navbar */
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 8%;
            background: var(--white);
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            position: sticky; top: 0; z-index: 1000;
        }

        .nav-links { display: flex; gap: 30px; list-style: none; align-items: center; }
        .nav-links a { text-decoration: none; color: #555; font-weight: 600; transition: 0.3s; }
        .nav-links a:hover { color: var(--accent); }

        .theme-dots { display: flex; gap: 10px; margin-left: 20px; }
        .dot { width: 20px; height: 20px; border-radius: 50%; cursor: pointer; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: 0.3s; }
        .dot:hover { transform: scale(1.2); }

        /* Hero Section */
        .hero { display: flex; padding: 60px 8%; align-items: center; min-height: 80vh; gap: 50px; }
        .hero-text { flex: 1; }
        .hero-text h1 { font-size: 4rem; line-height: 1; margin-bottom: 25px; color: var(--primary); font-weight: 800; }
        .hero-text span { color: var(--accent); }
        .hero-text p { font-size: 1.2rem; color: #666; margin-bottom: 35px; line-height: 1.6; }

        .btn-main {
            background: var(--accent);
            color: white;
            padding: 18px 45px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 700;
            box-shadow: 0 10px 25px rgba(230, 126, 86, 0.4);
            transition: 0.3s;
            display: inline-block;
        }
        .btn-main:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(230, 126, 86, 0.5); }

        .hero-img { flex: 1; display: flex; justify-content: center; }
        .main-illustration { 
            width: 100%; max-width: 550px; 
            filter: drop-shadow(0 30px 50px rgba(0,0,0,0.15));
            animation: float 5s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(2deg); }
        }

        /* Features Section */
        .features-container { background: var(--primary); padding: 80px 8%; border-radius: 60px 60px 0 0; margin-top: 50px; }
        .section-title { color: white; margin-bottom: 50px; font-size: 32px; font-weight: 700; }
        
        .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; }
        .card {
            background: var(--white);
            padding: 50px 30px;
            border-radius: 30px;
            text-align: center;
            transition: 0.4s;
            cursor: pointer;
            border-bottom: 8px solid transparent;
        }
        .card:hover { transform: translateY(-15px); }
        .card.orange { border-color: var(--accent); }
        .card.teal { border-color: #5DAE8B; }
        .card.purple { border-color: #A389D4; }
        .card h3 { margin-top: 20px; color: var(--primary); font-weight: 700; }

        /* Music Floating Tab */
        .music-tab {
            position: fixed; bottom: 40px; right: 40px;
            background: var(--white);
            color: var(--primary);
            padding: 15px 30px;
            border-radius: 100px;
            font-weight: 700;
            display: flex; align-items: center; gap: 12px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.2);
            cursor: pointer;
            transition: 0.3s;
            z-index: 999;
        }
        .music-tab:hover { transform: scale(1.1); background: var(--accent); color: white; }

        @media (max-width: 992px) {
            .hero { flex-direction: column; text-align: center; padding-top: 20px; }
            .hero-text h1 { font-size: 3rem; }
        }
    </style>
</head>
<body>

    <nav>
        <div class="logo">
            <span style="font-size: 40px;">🌿</span>
            <span class="logo-text">MindRest</span>
        </div>
        <ul class="nav-links">
            <li><a href="#">Games</a></li>
            <li><a href="#">Dashboard</a></li>
            <li><a href="#">Features</a></li>
            <div class="theme-dots">
                <div class="dot" style="background: #2D5A58;" onclick="changeTheme('#2D5A58')"></div>
                <div class="dot" style="background: #5DAE8B;" onclick="changeTheme('#5DAE8B')"></div>
                <div class="dot" style="background: #E67E56;" onclick="changeTheme('#E67E56')"></div>
                <div class="dot" style="background: #A389D4;" onclick="changeTheme('#A389D4')"></div>
            </div>
        </ul>
    </nav>

    <section class="hero">
        <div class="hero-text">
            <h1>Disconnect to <br><span>Reconnect.</span></h1>
            <p>Experience the ultimate digital detox. Our AI helps you track focus, suggest games, and provides relaxing music to keep your mind fresh.</p>
            <a href="#" class="btn-main">Get Started Now</a>
        </div>
        <div class="hero-img">
            <img src="cute image.png" alt="MindRest Brain" class="main-illustration">
        </div>
    </section>

    <div class="features-container">
        <h2 class="section-title">Explore Features</h2>
        <div class="feature-grid">
            <div class="card teal">
                <div style="font-size: 50px;">🎮</div>
                <h3>Relaxing Games</h3>
            </div>
            <div class="card orange">
                <div style="font-size: 50px;">🧠</div>
                <h3>AI Mood Tracker</h3>
            </div>
            <div class="card purple">
                <div style="font-size: 50px;">🎵</div>
                <h3>Music Therapy</h3>
            </div>
        </div>
    </div>

    <div class="music-tab" onclick="alert('Playing Relaxation Lo-fi Beats...')">
        <span>🎧</span> Music for Relaxation
    </div>

    <script>
        function changeTheme(color) {
            document.documentElement.style.setProperty('--primary', color);
            // Dynamic button color change based on theme
            if(color === '#E67E56') {
                document.documentElement.style.setProperty('--accent', '#2D5A58');
            } else {
                document.documentElement.style.setProperty('--accent', '#E67E56');
            }
        }
    </script>
</body>
</html>