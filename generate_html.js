const fs = require('fs');

const markdownContent = fs.readFileSync('cineBook_Project_Report.md', 'utf-8');

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>CineBook Project Report</title>
    <!-- Load marked.js for Markdown parsing -->
    <script src="https://cdn.jsdelivr.net/npm/marked@4.3.0/marked.min.js"></script>
    
    <!-- Load Mermaid.js for Diagrams -->
    <script type="module">
        import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
        mermaid.initialize({ startOnLoad: false, theme: 'default' });
        
        window.onload = async () => {
            const md = document.getElementById('markdown-content').textContent;
            
            const renderer = new marked.Renderer();
            
            // Custom renderer to wrap mermaid code blocks
            renderer.code = function(code, language) {
                if (language === 'mermaid') {
                    // Escape mermaid code so the browser doesn't try to parse it before mermaid does
                    const escapedCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    return '<div class="mermaid">' + escapedCode + '</div>';
                }
                const escapedCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                return '<pre><code>' + escapedCode + '</code></pre>';
            };
            
            // Parse Markdown to HTML
            document.getElementById('content').innerHTML = marked.parse(md, { renderer });
            
            // Render Mermaid Diagrams
            try {
                await mermaid.run({ nodes: document.querySelectorAll('.mermaid') });
            } catch (err) {
                console.error('Mermaid render error', err);
            }
        };
    </script>
    <style>
        body { font-family: 'Segoe UI', system-ui, sans-serif; line-height: 1.6; padding: 40px; max-width: 900px; margin: 0 auto; color: #333; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; border: 1px solid #ddd; text-align: left; }
        th { background-color: #f4f4f4; }
        h1, h2, h3 { color: #1e293b; margin-top: 30px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        hr { border: 0; border-top: 1px solid #eee; margin: 30px 0; }
        .mermaid { margin: 30px 0; display: flex; justify-content: center; }
        code { background: #f1f5f9; padding: 3px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em; color: #db2777; }
        pre code { color: #333; background: none; }
        pre { background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; overflow-x: auto; }
        a { color: #2563eb; text-decoration: none; }
        
        /* Print optimizations for PDF export */
        @media print {
            body { padding: 0; max-width: 100%; }
            .mermaid { break-inside: avoid; }
            table { break-inside: auto; }
            tr { break-inside: avoid; break-after: auto; }
            h1, h2, h3 { break-after: avoid; }
        }
    </style>
</head>
<body>
    <div id="content">Loading report and rendering diagrams...</div>
    <script id="markdown-content" type="text/markdown">
${markdownContent.replace(/<\/script>/g, '<\\/script>')}
    </script>
</body>
</html>
`;

fs.writeFileSync('cineBook_Project_Report.html', htmlContent);
console.log('Successfully created cineBook_Project_Report.html!');
