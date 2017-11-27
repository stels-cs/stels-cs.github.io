const fs = require('fs'),
    http = require('http');

const args = process.argv.slice(2);

if (args.length < 2) 
    console.log('Usage: node index [port] [folder]'), process.exit(1);

args[0] = +args[0];

if (isNaN(args[0]) || args[0] < 1 || args[0] > 0xFFFF)
    console.log('Error: port should be in the range from 1 to 65535.'), process.exit(1);

if (!fs.existsSync(args[1]))
    console.log('Error: invalid directory.'), process.exit(1);
    
http.createServer((request, response) => {
    const path = args[1]+request.url;
    console.log(path)
    fs.exists(path, exists => {
        if (exists) return fs.readFile(path, "utf8", (err, data) => {
            if (err) return response.end('403');      
            response.end(data);
        });
        response.end('404');
    });
}).listen(args[0]);

console.log(`Server is launched at: 127.0.0.1:${args[0]}`);
