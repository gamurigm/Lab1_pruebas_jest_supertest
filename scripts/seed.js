const http = require('http');

const USERS = [
  { name: 'Ana Pérez', email: 'ana.perez@example.com' },
  { name: 'Diego Gómez', email: 'diego.gomez@example.org' },
  { name: 'María López', email: 'maria.lopez@example.net' },
  { name: 'Carlos Rodríguez', email: 'carlos.rodriguez@example.com' },
  { name: 'Laura Martínez', email: 'laura.martinez@example.org' },
  { name: 'José García', email: 'jose.garcia@example.net' },
  { name: 'Carmen Sánchez', email: 'carmen.sanchez@example.com' },
  { name: 'Miguel Torres', email: 'miguel.torres@example.org' },
  { name: 'Isabel Ramírez', email: 'isabel.ramirez@example.net' },
  { name: 'Francisco Flores', email: 'francisco.flores@example.com' },
  { name: 'Patricia Morales', email: 'patricia.morales@example.org' },
  { name: 'Roberto Jiménez', email: 'roberto.jimenez@example.net' },
  { name: 'Elena Castro', email: 'elena.castro@example.com' },
  { name: 'Antonio Vargas', email: 'antonio.vargas@example.org' },
  { name: 'Sofía Mendoza', email: 'sofia.mendoza@example.net' },
  { name: 'Juan Herrera', email: 'juan.herrera@example.com' },
  { name: 'Lucía Ortiz', email: 'lucia.ortiz@example.org' },
  { name: 'Pedro Ruiz', email: 'pedro.ruiz@example.net' },
  { name: 'Andrea Silva', email: 'andrea.silva@example.com' },
  { name: 'Manuel Reyes', email: 'manuel.reyes@example.org' },
  { name: 'Valentina Cruz', email: 'valentina.cruz@example.net' },
  { name: 'Daniel Romero', email: 'daniel.romero@example.com' },
  { name: 'Gabriela Díaz', email: 'gabriela.diaz@example.org' },
  { name: 'Alejandro Vega', email: 'alejandro.vega@example.net' },
  { name: 'Camila Gutiérrez', email: 'camila.gutierrez@example.com' },
  { name: 'Sebastián Molina', email: 'sebastian.molina@example.org' }
];

function postUser(user, host = 'localhost', port = 3000, path = '/users') {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(user);
    const options = {
      hostname: host,
      port,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : null;
          resolve({ statusCode: res.statusCode, body: parsed });
        } catch (err) {
          resolve({ statusCode: res.statusCode, body });
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(data);
    req.end();
  });
}

async function seed() {
  console.log('Seeding users to http://localhost:3000/users');
  for (const u of USERS) {
    try {
      const res = await postUser(u);
      console.log(`-> ${u.name}: ${res.statusCode}`, res.body || '');
    } catch (err) {
      console.error(`Failed to post ${u.name}:`, err.message);
      process.exitCode = 1;
    }
  }
  console.log('Done seeding.');
}

if (require.main === module) {
  seed();
}
