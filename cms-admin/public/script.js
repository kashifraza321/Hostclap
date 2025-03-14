document.addEventListener("DOMContentLoaded", function() {
    const templateImages = document.querySelectorAll('.template-selector img');
    const steps = document.querySelectorAll('.step');
    const contents = document.querySelectorAll('.content');
    const menuItemInputs = [
        document.getElementById("menu-item-1"),
        document.getElementById("menu-item-2"),
        document.getElementById("menu-item-3"),
        document.getElementById("menu-item-4"),
    ];
    const headerHeadingInput = document.getElementById("header-heading");
    const bannerTextInput = document.getElementById("banner-text");
    const aboutUsTextInput = document.getElementById("about-us-text");
    const servicesTextInput = document.getElementById("services-text");
    const imageUrlInput = document.getElementById("image-url");
    const footerTextInput = document.getElementById("footer-text");
    const livePreviewIframe = document.getElementById("live-preview");
    let selectedTemplate = 'simple';

    const templates = {
        simple: `
             <header>
                <nav class="nav-wrapper teal lighten-2">
                    <div class="container">
                        <ul class="left">{menu}</ul>
                    </div>
                </nav>
                <div class="section center-align">
                    <h1 class="header">{header}</h1>
                </div>
            </header>
            <div class="banner teal lighten-4"><p class="center-align">{banner}</p></div>
            <footer class="page-footer teal lighten-2"><div class="center-align"><p>{footer}</p></div></footer>
   
        `,
        portfolio: `
            <header>
                <nav>
                    <ul>
                        {menu}
                    </ul>
                </nav>
                <h1>{header}</h1>
            </header>
            <div class="banner"><p>{banner}</p></div>
            <div class="section about-us"><h2>About Us</h2><p>{about}</p></div>
            <div class="section services"><h2>Services</h2><p>{services}</p></div>
            {image}
            <footer><p>{footer}</p></footer>
        `,
        blog: `
            <header>
                <nav>
                    <ul>
                        {menu}
                    </ul>
                </nav>
                <h1>{header}</h1>
            </header>
            <div class="banner"><p>{banner}</p></div>
            <div class="section blog-post"><h2>About Us</h2><p>{about}</p></div>
            <div class="section blog-post"><h2>Services</h2><p>{services}</p></div>
            {image}
            <footer><p>{footer}</p></footer>
        `
    };

    function updateEditorFields() {
        document.getElementById("header-heading-container").classList.remove("hidden");
        document.getElementById("banner-text-container").classList.remove("hidden");
        document.getElementById("image-url-container").classList.remove("hidden");
        document.getElementById("footer-text-container").classList.remove("hidden");

        if (selectedTemplate === "simple") {
            document.getElementById("about-us-text-container").classList.add("hidden");
            document.getElementById("services-text-container").classList.add("hidden");
        } else {
            document.getElementById("about-us-text-container").classList.remove("hidden");
            document.getElementById("services-text-container").classList.remove("hidden");
        }
    }

    function updatePreview() {
        const menuItems = menuItemInputs.map(input => `<li><a href="#">${input.value}</a></li>`).join('');
        const headerHeading = headerHeadingInput.value;
        const bannerText = bannerTextInput.value;
        const aboutUsText = aboutUsTextInput.value;
        const servicesText = servicesTextInput.value;
        const imageUrl = imageUrlInput.value;
        const footerText = footerTextInput.value;

        let previewContent = templates[selectedTemplate]
            .replace('{menu}', menuItems)
            .replace('{header}', headerHeading)
            .replace('{banner}', bannerText)
            .replace('{about}', aboutUsText)
            .replace('{services}', servicesText)
            .replace('{footer}', footerText)
            .replace('{image}', imageUrl ? `<img src="${imageUrl}" alt="Image">` : "");

        previewContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Live Preview</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                    }
                    img {
                        max-width: 100%;
                        height: auto;
                    }
                    header, footer {
                        background-color: #f8f8f8;
                        padding: 10px;
                        text-align: center;
                    }
                    nav ul {
                        list-style: none;
                        padding: 0;
                    }
                    nav ul li {
                        display: inline;
                        margin-right: 10px;
                    }
                    nav ul li a {
                        text-decoration: none;
                        color: #333;
                    }
                    nav ul li a:hover {
                        text-decoration: underline;
                    }
                    .banner {
                        background-color: #e0e0e0;
                        padding: 20px;
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .section {
                        margin-bottom: 20px;
                    }
                </style>
            </head>
            <body>
                ${previewContent}
            </body>
            </html>
        `;

        livePreviewIframe.srcdoc = previewContent;

        // Adjust iframe height to content height
        livePreviewIframe.onload = function() {
            livePreviewIframe.style.height = livePreviewIframe.contentWindow.document.body.scrollHeight + 'px';
        };
    }

    templateImages.forEach(img => {
        img.addEventListener('click', function() {
            templateImages.forEach(image => image.classList.remove('selected'));
            this.classList.add('selected');
            selectedTemplate = this.getAttribute('data-template');
            updateEditorFields();
            updatePreview();
        });
    });

    menuItemInputs.forEach(input => input.addEventListener("input", updatePreview));
    headerHeadingInput.addEventListener("input", updatePreview);
    bannerTextInput.addEventListener("input", updatePreview);
    aboutUsTextInput.addEventListener("input", updatePreview);
    servicesTextInput.addEventListener("input", updatePreview);
    imageUrlInput.addEventListener("input", updatePreview);
    footerTextInput.addEventListener("input", updatePreview);

    // Initial load
    updateEditorFields();
    updatePreview();
});
