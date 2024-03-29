const fs = require('fs');
const http = require('https');
var propertiesReader = require('properties-reader');
var moment = require('moment');
const { group } = require('console');


var config = propertiesReader('catv_config.ini');

var headCount = 0;
var bodyCount = 0;

exports.run = async function (file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) reject(err);

            // Create empty variable to store the contents of the resulting file

            let grouping_needed = [];

            // Heading tags (<meta>, <title> etc.)
            head = '';
            // Body content (text, images etc.)
            html = '';
            // Finalized HTML with processed attributes
            final_html = '';

            // Generate the HTML headers
            head += "<!-- Generated by Viscato " + config.get('viscato.version') + " by " + config.get('viscato.author') + " at " + moment().format('DD-MMMM-yyyy hh:mm:ss') + " -->\n";
            head += '<!DOCTYPE html>';
            head += "\n";
            head += '<html>';
            head += "\n";
            head += '<meta charset="utf-8">';
            head += "\n";
            head += '<meta name="viewport" content="width=device-width, initial-scale=1">';
            head += "\n";

            // Iterate through preconfigured scripts and add them to the HTML
            let global_scripts = config.get('main.globaljsfiles');
            let global_styles = config.get('main.globalcssfiles');

            global_scripts.split(',').forEach(function (path) {
                html += '<script src="' + path + '"></script>';
                html += "\n";
            });

            // Iterate through preconfigured stylesheets and add them to the HTML
            global_styles.split(',').forEach(function (path) {
                html += '<style rel="stylesheet/css" href="' + path + '"></style>';
                html += "\n";
            });

            // For each line in the catv file, check if it is a comment or a tag and interpret it accordingly
            // Split into lines and then process each line individually
            data.split(config.get('viscato.terminator')).forEach(line => {
                // Remove surrounding whitespace
                line = line.trim();

                // Define catv tags to look for at the beginning of the lines
                let catv_tag = [
                    '#',
                    '(??)[abbr]',
                    '(??)[address]',
                    '(??)[applet]',
                    '(??)[area]',
                    '(??)[article]',
                    '(??)[aside]',
                    '(??)[audio]',
                    '(bold)',
                    '(??)[base]',
                    '(??)[basefont]',
                    '(??)[bdi]',
                    '(??)[bdo]',
                    '(??)[big]',
                    '(quote)',
                    '(newline)',
                    '(button)',
                    '(??)[canvas]',
                    '(??)[caption]',
                    '(??)[center]',
                    '(cite)',
                    '(code)',
                    '(??)[col]',
                    '(??)[colgroup]',
                    '(??)[data]',
                    '(??)[datalist]',
                    '(??)[dd]',
                    '(??)[del]',
                    '(??)[details]',
                    '(??)[dfn]',
                    '(??)[dialog]',
                    '(??)[dir]',
                    '(??)[div]',
                    '(??)[dl]',
                    '(??)[dt]',
                    '(emphasized)',
                    '(embed)',
                    '(??)[fieldset]',
                    '(??)[figcaption]',
                    '(??)[figure]',
                    '(font)',
                    '(footer)',
                    '(form)',
                    '(??)[frame]',
                    '(??)[frameset]',
                    '(h1)',
                    '(h2)',
                    '(h3)',
                    '(h4)',
                    '(h5)',
                    '(h6)',
                    '(header)',
                    '(line)',
                    '(italic)',
                    '(??)[iframe]',
                    '(img)',
                    '(input)',
                    '(ins)',
                    '(kbd)',
                    '(label)',
                    '(caption)',
                    '(item)',
                    '(main)',
                    '(??)[map]',
                    '(??)[mark]',
                    '(??)[scale]',
                    '(navbar)',
                    '(??)[noframes]',
                    '(??)[noscript]',
                    '(object)',
                    '(orderedlist)',
                    '(??)[optgroup]',
                    '(option)',
                    '(??)[output]',
                    '(paragraph)',
                    '(??)[param]',
                    '(??)[picture]',
                    '(preformatted)',
                    '(??)[progress]',
                    '(question)',
                    '(??)[rp]',
                    '(??)[rt]',
                    '(??)[ruby]',
                    '(strikethrough)',
                    '(??)[samp]',
                    '(section)',
                    '(??)[select]',
                    '(small)',
                    '(??)[source]',
                    '(??)[span]',
                    '(strikethrough)',
                    '(bold)',
                    '(subscript)',
                    '(summary)',
                    '(superscript)',
                    '(svg)',
                    '(table)',
                    '(tablebody)',
                    '(tablecell)',
                    '(hiddencell)',
                    '(multiline)',
                    '(tablefooter)',
                    '(tabletitle)',
                    '(tableheader)',
                    '(time)',
                    '(tablerow)',
                    '(subtitle)',
                    '(kbd)',
                    '(underline)',
                    '(unorderedlist)',
                    '(variable)',
                    '(video)',
                    '(wbr)',
                ];

                // Corresponding html opening tags to catv tags
                let html_open_tag = [
                    '<!--',
                    '<abbr>',
                    '<address>',
                    '<applet>',
                    '<area>',
                    '<article>',
                    '<aside>',
                    '<audio>',
                    '<b>',
                    '<base>',
                    '<basefont>',
                    '<bdi>',
                    '<bdo>',
                    '<big>',
                    '<blockquote>',
                    '<br>', // Leave blank (break tag)
                    '<button>',
                    '<canvas>',
                    '<caption>',
                    '<center>',
                    '<cite>',
                    '<code>',
                    '<col>',
                    '<colgroup>',
                    '<data>',
                    '<datalist>',
                    '<dd>',
                    '<del>',
                    '<details>',
                    '<dfn>',
                    '<dialog>',
                    '<dir>',
                    '<div>',
                    '<dl>',
                    '<dt>',
                    '<em>',
                    '<embed>',
                    '<fieldset>',
                    '<figcaption>',
                    '<figure>',
                    '<font>',
                    '<footer>',
                    '<form>',
                    '<frame>',
                    '<frameset>',
                    '<h1>',
                    '<h2>',
                    '<h3>',
                    '<h4>',
                    '<h5>',
                    '<h6>',
                    '<header>',
                    '<hr>',
                    '<i>',
                    '<iframe>',
                    '<img>',
                    '<input>',
                    '<ins>',
                    '<kbd>',
                    '<label>',
                    '<legend>',
                    '<li>',
                    '<main>',
                    '<map>',
                    '<mark>',
                    '<meter>',
                    '<nav>',
                    '<noframes>',
                    '<noscript>',
                    '<object>',
                    '<ol>',
                    '<optgroup>',
                    '<option>',
                    '<output>',
                    '<p>',
                    '<param>',
                    '<picture>',
                    '<pre>',
                    '<progress>',
                    '<q>',
                    '<rp>',
                    '<rt>',
                    '<ruby>',
                    '<s>',
                    '<samp>',
                    '<script>',
                    '<section>',
                    '<select>',
                    '<small>',
                    '<source>',
                    '<span>',
                    '<strike>',
                    '<strong>',
                    '<sub>',
                    '<summary>',
                    '<sup>',
                    '<svg>',
                    '<table>',
                    '<tbody>',
                    '<td>',
                    '<template>',
                    '<tfoot>',
                    '<th>',
                    '<thead>',
                    '<time>',

                    '<tr>',
                    '<track>',
                    '<tt>',
                    '<u>',
                    '<ul>',
                    '<var>',
                    '<video>',
                    '<wbr>',
                ];

                // Corresponding html closing tags to the catv tags (if any, it they are identical, just put it anyways)
                let html_close_tag = [
                    '-->',
                    '</abbr>',
                    '</address>',
                    '</applet>',
                    '</area>',
                    '</article>',
                    '</aside>',
                    '</audio>',
                    '</b>',
                    '</base>',
                    '</basefont>',
                    '</bdi>',
                    '</bdo>',
                    '</big>',
                    '</blockquote>',
                    '', // Leave blank (break tag)
                    '</button>',
                    '</canvas>',
                    '</caption>',
                    '</center>',
                    '</cite>',
                    '</code>',
                    '</col>',
                    '</colgroup>',
                    '</data>',
                    '</datalist>',
                    '</dd>',
                    '</del>',
                    '</details>',
                    '</dfn>',
                    '</dialog>',
                    '</dir>',
                    '</div>',
                    '</dl>',
                    '</dt>',
                    '</em>',
                    '</embed>',
                    '</fieldset>',
                    '</figcaption>',
                    '</figure>',
                    '</font>',
                    '</footer>',
                    '</form>',
                    '</frame>',
                    '</frameset>',
                    '</h1>',
                    '</h2>',
                    '</h3>',
                    '</h4>',
                    '</h5>',
                    '</h6>',
                    '</header>',
                    '', // Leave blank (hr tag)
                    '</i>',
                    '</iframe>',
                    '</img>',
                    '</input>',
                    '</ins>',
                    '</kbd>',
                    '</label>',
                    '</legend>',
                    '</li>',
                    '</main>',
                    '</map>',
                    '</mark>',
                    '</meter>',
                    '</nav>',
                    '</noframes>',
                    '</noscript>',
                    '</object>',
                    '</ol>',
                    '</optgroup>',
                    '</option>',
                    '</output>',
                    '</p>',
                    '</param>',
                    '</picture>',
                    '</pre>',
                    '</progress>',
                    '</q>',
                    '</rp>',
                    '</rt>',
                    '</ruby>',
                    '</s>',
                    '</samp>',
                    '</script>',
                    '</section>',
                    '</select>',
                    '</small>',
                    '</source>',
                    '</span>',
                    '</strike>',
                    '</strong>',
                    '</sub>',
                    '</summary>',
                    '</sup>',
                    '</svg>',
                    '</table>',
                    '</tbody>',
                    '</td>',
                    '</template>',
                    '</tfoot>',
                    '</th>',
                    '</thead>',
                    '</time>',
                    '</tr>',
                    '</track>',
                    '</tt>',
                    '</u>',
                    '</ul>',
                    '</var>',
                    '</video>',
                    '</wbr>',
                ];

                let grouping_opening_tag = [
                    '<ol>',
                    '<ul>',
                    '<table>',
                    '<body>',
                    '<head>',
                    '<html>'
                ];

                let grouping_closing_tag = [
                    '</ol>',
                    '</ul>',
                    '</table>',
                    '</body>',
                    '</head>',
                    '</html>'
                ];


                // Save 100+ lines of code by iterating through the arrays and checking if the line starts with the tag
                // If it does, replace the tag with the corresponding html tag(s)

                catv_tag.forEach(tag => {
                    if (line.startsWith(tag)) {

                        // Get the index of the catv tag found in the line
                        var i = catv_tag.indexOf(tag);

                        console.log("Render tag: " + tag + " with index " + i + " found in line: " + line + "\N");

                        // If grouping is needed, check if the element has already been opened and if not open it
                        if (grouping_opening_tag.includes(tag)) {
                            // If the end of the grouping_needed array is equal to the tag variable, then the element needs to be closed
                            if (grouping_needed[grouping_needed.length] == catv_tag[i]) {
                                grouping_needed.push(tag);
                                html += html_open_tag[i];
                            } else {
                                grouping_needed.pop();
                                html += html_close_tag[i];
                            }

                            console.log("Added line: " + html_open_tag[i] + line.substring(tag.length) + html_close_tag[i]);
                        } else {
                            html += html_open_tag[i] + line.substring(tag.length) + html_close_tag[i];
                        }
                    }
                });



                // Deal with the title tags separately
                if (line.startsWith('(title)')) {
                    html += '<title>' + line.substring(7) + '</title>';
                    console.log("Added opening title tag");
                }

                if (line.startsWith('(body)')) {
                    if (bodyCount == 0) {
                        html += '<body>';
                        console.log("Added opening body tag");
                    } else {
                        html += '</body>';
                        console.log("Added closing body tag");
                    }
                }


                // Deal with tags that need attributes (e.g. <a>)
                if (line.startsWith('(link)')) {
                    var href_content = line.substring(
                        line.indexOf("[") + 1,
                        line.lastIndexOf("]")
                    );

                    html += '<a href="' + href_content + '">' + line.substring(href_content.length + 8) + '</a>';
                    console.log("Finished adding href attribute opening a tag");
                }

                grouping_opening_tag.forEach(tag => {
                    if (line.startsWith(tag)) {
                        if (grouping_needed.includes(tag)) {
                            // https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array
                            // Find the index of the tag in the array
                            const groupingTagIndex = grouping_needed.indexOf(tag);
                            // Remove the tag from the array
                            if (groupingTagIndex > -1) {
                                grouping_needed.splice(groupingTagIndex, 1); // 2nd parameter means remove one item only
                            }
                        } else {
                            html += grouping_opening_tag[catv_tag.indexOf(tag)] + line.substring(tag.length) + grouping_closing_tag[catv_tag.indexOf(tag)];
                        }
                    }
                });


                // Add a newline character to the end of the line 
                html += "\n";
            });

            // Close body and html tags
            html += "</html>";

            // Add the HTML headers to the html
            html = head + html;

            // Return the html to the calling function
            resolve(html);
        });
    });
}
