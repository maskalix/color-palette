<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/x-icon" href="https://pressline.app/favicon.ico" style="scale:0.8">
    <title>Color Palette Generator</title>
    <!-- Include jQuery library -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <!-- Include Spectrum.js library -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap');
        body {
            font-family: 'Lexend', sans-serif;
        }

        :root {
            color-scheme: only light;
        }

        .primary {
            color: var(--secondary);
            background-color: var(--primary);
        }

        .secondary {
            color: var(--primary);
            background-color: var(--secondary);
        }

        .accent {
            color: var(--accent);
        }

        div.primary, div.secondary {
            padding: 20px;
            margin: 20px;
            border-radius: 10px;
            border: 1px solid #000;
        }

        .material-you-slider {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
            background-color: rgb(255, 149, 0);
            border-radius: 34px;
            transition: background-color 0.3s;
        }

        .material-you-slider:before {
            position: absolute;
            content: "";
            height: 20px;
            width: 20px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            border-radius: 50%;
            transition: transform 0.5s;
        }

        input[type="checkbox"]:checked + .material-you-slider {
            background-color: purple;
        }

        input[type="checkbox"]:checked + .material-you-slider:before {
            transform: translateX(26px);
            background-color: white;
        }


        .modeSwitch input[type="checkbox"] {
            display: none;
        }

        main {
            display: flex;
            flex-direction: column;
            width: calc(100% - 20px);
            background: #1a1a1a;
            border-radius: 10px;
            border: 1px solid #f7f7f7;
            padding: 25px;
            margin: 10px;
            box-sizing: border-box;
            color: #f7f7f7;
        }

        header {
            display: flex;
            flex-direction: column;
            width: calc(100% - 20px);
            background: #1a1a1a;
            border-radius: 10px;
            border: 1px solid #f7f7f7;
            padding: 15px 20px;
            margin: 10px;
            box-sizing: border-box;
            color: #f7f7f7;

            & nav {
                display: flex;
                align-items: center;

                & a {
                    text-decoration: none;
                    color: #f7f7f7;
                }
            }
        }

        input:disabled {
            color: white;
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <img src="https://pressline.app/favicon.ico" style="height:35px;margin: 0 15px 0 5px;">
            <p>Created by <a href="https://pressline.app" target="_blank">Pressline</a></p>
            <p style="margin: 0 15px;">|</p>
            <a href="index.php" target="_blank">Palette Generator</a>
            <p style="margin: 0 15px;">|</p>
            <a href="test.php" target="_blank">Test page</a>
            <p style="margin: 0 15px;">|</p>
            <div class="modeSwitch" style="display: flex;align-items: center;">
                <label style="margin-right:10px">light/dark mode</label>
                <label class="material-you-switch">
                    <input type="checkbox" id="modeSwitch">
                    <span class="material-you-slider" style="display: flex;"></span>
                </label>
            </div>
            <p style="margin: 0 15px;">|</p>
            <p>Session code: <input type="text" id="sessioncode" disabled></p>
        </nav>
    </header>
    <div class="primary">
        <p>Toto je testovací blok pro primární barvu jako pozadí a sekundární jako text</p>
    </div>
    <div class="secondary">
        <p>Toto je testovací blok pro sekundární barvu jako pozadí a primární jako text</p>
    </div>
    <div class="primary">
        <p class="accent">Toto je testovací blok pro primární barvu jako pozadí a akcent jako text</p>
    </div>
    <div class="secondary">
        <p class="accent">Toto je testovací blok pro sekundární barvu jako pozadí a akcent jako text</p>
    </div>
</body>
<script src="hashToCSS.js"></script>
<script>
    if (localStorage.getItem('hash')) {
        $('#sessioncode').val(localStorage.getItem('hash'));
    } 
        
    $(document).ready(function() {
        $("html").addClass("light");
        // Initialize color pickers and preload colors
        $("#modeSwitch").change(function() {
            if ($(this).is(":checked")) {
                $("html").addClass("dark");
                $("html").removeClass("light");
            } else {
                $("html").removeClass("dark");
                $("html").addClass("light");
            }
        });
    });
</script>
</html>