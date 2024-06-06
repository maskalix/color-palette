<?php
// Enable caching for 1 hour
header("Cache-Control: max-age=3600, public");
header("Expires: " . gmdate("D, d M Y H:i:s", time() + 3600) . " GMT");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Color Palette Generator</title>
    <!-- Include jQuery library -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script type='text/javascript' src='tinycolor.js'></script>
    <script src="./iconify.min.js"></script>
    <link rel="stylesheet" href="styles.css">
    <link rel="icon" type="image/x-icon" href="https://pressline.app/favicon.ico" style="scale:0.8">
    <!-- Meta -->
    <?php include 'head.php'; ?>
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
            <div style="display:flex;gap:10px;margin-left: auto;">
                <button class="btn-gray" onclick="hashImport()"><span class="iconify-inline" data-icon="solar:import-line-duotone"></span> Import hash</button>
                <button class="btn-gray" onclick="hashExport()"><span class="iconify-inline" data-icon="solar:export-line-duotone"></span> Export hash</button>
            </div>
        </nav>
    </header>
    <main>
        <h1><span class="iconify-inline" data-icon="icon-park-twotone:color-card"></span> Color Palette Generator</h1>
        <div class="colorColumnsContainer" id="colorColumnsContainer">
            <?php
                $colors = [
                    'Primary',
                    'Secondary',
                    'Terciary',
                    'Accent',
                    'Add',
                    'Add-2'
                ];
            ?>
            <?php foreach ($colors as $color): ?>
                <div class="colorColumn" id="<?= strtolower($color) ?>Column">
                    <h2><span class="iconify-inline" data-icon="ic:twotone-color-lens"></span> <?= $color ?></h2>
                    <div class="palletes">
                        <div class="light">
                            <h3><?= $color ?> Light</h3>
                            <p><span class="iconify-inline" data-icon="ph:sun-dim-duotone"></span> light <abbr title="copy color to clipboard"><span class="iconify-inline" data-icon="solar:copy-bold-duotone"></span></abbr></p>
                            <div class="colorPickerContainer">
                                <div class="base-color"></div>
                                <input type="color" class="colorPicker">
                            </div>
                            <div class="transparencyList"></div>
                        </div>
                        <div class="dark">
                            <h3><?= $color ?> Dark</h3>
                            <p><span class="iconify-inline" data-icon="iconamoon:mode-dark-duotone"></span> dark <abbr title="copy color to clipboard"><span class="iconify-inline" data-icon="solar:copy-bold-duotone"></span></abbr></p>
                            <div class="colorPickerContainer">
                                <div class="base-color"></div>
                                <input type="color" class="colorPicker">
                            </div>
                            <div class="transparencyList"></div>
                        </div>
                    </div>
                </div>
            <?php endforeach;?>
        </div>
        <h2 class="title"><span class='iconify-inline' data-icon='ic:twotone-try'></span> Try generated colors directly in your app using script below</h2>
        <code>&lt;script src="https://tools.pressline.app/colors/hashToCSS.js"&gt;&lt;/script&gt; <abbr title="copy code to clipboard"><span class="iconify-inline" data-icon="solar:copy-bold-duotone" onclick="copy(`<script src='https://tools.pressline.app/colors/hashToCSS.js'></script>`)"></span></abbr></code>
        <div class="tools-column">
            <h2 class="title"><span class="iconify-inline" data-icon="tabler:contrast-2-filled"></span> Contrast Tables</h2>          
            <div id="contrast-table">
                <div id="colorScale"></div>
            </div>
            <div id="export-colors">
                <h2 class="title"><span class='iconify-inline' data-icon='solar:export-line-duotone'></span> Export Color Variations</h2>
                <button class="btn-gray" id="exportButton" onclick="exportColorVariations()"><span class="iconify-inline" data-icon="solar:export-line-duotone"></span> Export CSS from palette</button>
                <button class="btn-gray" onclick="hashToCSSInput()"><span class="iconify-inline" data-icon="solar:export-line-duotone"></span> Export CSS from hash (below)</button><br>
                <input type="text" id="colorInput" placeholder="Enter the hash">
                
                <textarea id="exportedColorVariations" rows="10" cols="50"></textarea>
                <br>
                
            </div>
        </div>
        <script src="script.js"></script>
    </main>
</body>
</html>
