const net = require("net");
const dns = require("dns");

const domain = "ukr.net";

dns.lookup(domain, (err, address) => {
  if (err) throw err;

  const socket = net.createConnection({
    host: address,
    port: 80,
  });

  const request = `
GET / HTTP/1.1
Host: ${domain}

`.slice(1);

  socket.write(request);
  socket.pipe(process.stdout);
});
