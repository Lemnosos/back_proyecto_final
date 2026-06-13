import 'dotenv/config';
import { pool } from '../utils/sqlConect.js';
import { encriptarContraseña } from '../utils/gestionarContraseñas.js';

async function seed() {
    const client = await pool.connect();

    try {
        const { rows } = await client.query('SELECT COUNT(*)::int AS total FROM usuario');

        if (rows[0].total > 0) {
            console.log('La BD ya tiene datos. Seed omitido.');
            return;
        }

        console.log('Poblando base de datos...');

        const hashAdmin = await encriptarContraseña('Admin1234');
        const hashUser1 = await encriptarContraseña('Jugador1234');
        const hashUser2 = await encriptarContraseña('ProPlayer1234');

        await client.query(`
            INSERT INTO usuario (nombre, apodo, email, password, rol) VALUES
                ('Admin Principal', 'admin',      'admin@test.com',   $1, 'admin'),
                ('Jugador Uno',     'jugon',      'jugador@test.com', $2, 'user'),
                ('Jugador Dos',     'pro-player', 'pro@test.com',     $3, 'user');
        `, [hashAdmin, hashUser1, hashUser2]);

        console.log('  usuarios insertados');

        await client.query(`
            INSERT INTO personaje (usuario_id, nombre, vida, ataque, defensa, velocidad, experiencia) VALUES
                (2, 'Guts',   120, 85,  70, 60,  450),
                (3, 'Shadow', 90,  95,  55, 110, 780);
        `);

        console.log('  personajes insertados');

        await client.query(`
            INSERT INTO enemigo (nombre, vida, ataque, defensa, velocidad, tipo) VALUES
                ('Goblin',          50,  30,  20,  40,  'normal'),
                ('Troll',           150, 60,  80,  20,  'normal'),
                ('Dragón de Fuego', 300, 120, 100, 80, 'boss'),
                ('Esqueleto',       60,  45,  30,  55,  'normal'),
                ('Rey Demonio',     500, 150, 120, 60, 'boss');
        `);

        console.log('  enemigos insertados');

        await client.query(`
            INSERT INTO combate (id_personaje, id_enemigo, resultado, turnos) VALUES
                (1, 1, 'victoria', 3),
                (1, 2, 'victoria', 7),
                (1, 3, 'derrota',  12),
                (2, 1, 'victoria', 2),
                (2, 4, 'victoria', 4);
        `);

        console.log('  combates insertados');
        console.log('Seed completado.');

    } catch (error) {
        console.error('Error en seed:', error);
        throw error;

    } finally {
        client.release();
        await pool.end();
    }
}

seed();
