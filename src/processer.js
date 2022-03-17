const fs = require('fs');
const http = require('https');

exports.run = async function(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', function(err, data) {
            if (err) reject(err);
            var html = '';
            // add viscato reasources
            // donwload resources
            const filew = fs.createWriteStream("rendered/vis.css");
            const request = http.get("https://raw.githubusercontent.com/catocodedev/viscato/main/reasources/vis.css", function(response) {
             response.pipe(filew);
            });
            const filew2 = fs.createWriteStream("rendered/vis.js");
            const request2 = http.get("https://raw.githubusercontent.com/catocodedev/viscato/main/reasources/vis.js", function(response) {
                response.pipe(filew2);
            });
            html += '<link rel="stylesheet" href="vis.css">\n<script src="vis.js"></script>\n';
            data.split(';').forEach(line =>  {
                line = line.trim();
                if(line.startsWith('#')) {
                    //
                }
                    else if(line.startsWith('(h1)')) {
                        html = html + `<h1>${line.substring(4)}</h1>`;
                    }else if(line.startsWith('(title)')) {
                        html = html + `<title>${line.substring(7)}</title>`;
                    }else if(line.startsWith('(p)')) {
                        html = html + `<p>${line.substring(3)}</p>`;
                    }else if(line.startsWith('(img)')) {
                        html = html + `<img src="${line.substring(5)}" />`;
                    }
                    else if(line.startsWith('(head)')) {
                        html = html + `<head>`;
                    }
                    else if(line.startsWith('(body)')) {
                        html = html + `<body>`;
                    }
                    else if(line.startsWith('~body')) {
                        html = html + `</body>`;
                    }
                    else if(line.startsWith('~head')) {
                        html = html + `</head>`;
                    }
                    else if(line.startsWith('(ul)')) {
                        html = html + `<ul>`;
                    }
                    else if(line.startsWith('~ul')) {
                        html = html + `</ul>`;
                    }
                    else if(line.startsWith('(li)')) {
                        html = html + `<li>${line.substring(3)}</li>`;
                    }
                    else if(line.startsWith('(a)')) {
                        html = html + `<a href="${line.substring(3)}.html">${line.substring(3)}</a>`;
                    }
                    else if(line.startsWith('(br)')) {
                        html = html + `<br />`;
                    }
                    else if(line.startsWith('(button)')) {
                        html = html + `<button>${line.substring(8)}</button>`;
                    }
                html = html + "\n";
              });
              resolve(html);
        });
    });
    }
