import bcrypt from 'bcrypt';
import pool from '../db/connection.js';

const DEFAULT_PASSWORD = 'password';

const users = [
  ['USR-001', 'CMP-001', 'Elena', 'Fabbri', 'elena.fabbri@valgrande.example', 'Plant Maintenance Manager', 'full'],
  ['USR-002', 'CMP-001', 'Matteo', 'Bonetti', 'matteo.bonetti@valgrande.example', 'Maintenance Man', 'technician'],
  ['USR-003', 'CMP-001', 'Serena', 'Lupo', 'serena.lupo@valgrande.example', 'Line Operator', 'technician'],
  ['USR-004', 'CMP-001', 'Davide', 'Ranieri', 'davide.ranieri@valgrande.example', 'Procurement Specialist', 'commercial'],
  ['USR-005', 'CMP-001', 'Ilaria', 'Sacchetti', 'ilaria.sacchetti@valgrande.example', 'Quality Assurance Manager', 'full'],
  ['USR-006', 'CMP-001', 'Fulvio', 'Mandelli', 'fulvio.mandelli@valgrande.example', 'Line Operator', 'technician'],

  ['USR-007', 'CMP-002', 'Adrien', 'Lemaitre', 'adrien.lemaitre@bruyere.example', 'Technical Director', 'full'],
  ['USR-008', 'CMP-002', 'Camille', 'Berthaud', 'camille.berthaud@bruyere.example', 'Maintenance Man', 'technician'],
  ['USR-009', 'CMP-002', 'Thibault', 'Marchand', 'thibault.marchand@bruyere.example', 'Bottling Hall Supervisor', 'technician'],
  ['USR-010', 'CMP-002', 'Solene', 'Vasseur', 'solene.vasseur@bruyere.example', 'Purchasing Manager', 'commercial'],

  ['USR-011', 'CMP-003', 'Nuria', 'Castellon', 'nuria.castellon@ebro.example', 'Engineering Manager', 'full'],
  ['USR-012', 'CMP-003', 'Joaquin', 'Peralta', 'joaquin.peralta@ebro.example', 'Maintenance Man', 'technician'],
  ['USR-013', 'CMP-003', 'Beatriz', 'Aldana', 'beatriz.aldana@ebro.example', 'Validation Specialist', 'technician'],
  ['USR-014', 'CMP-003', 'Ignacio', 'Rueda', 'ignacio.rueda@ebro.example', 'Procurement Manager', 'commercial'],

  ['USR-015', 'CMP-004', 'Fiona', 'Drummond', 'fiona.drummond@kilbrannan.example', 'Operations Manager', 'full'],
  ['USR-016', 'CMP-004', 'Callum', 'Ferrier', 'callum.ferrier@kilbrannan.example', 'Maintenance Man', 'technician'],
  ['USR-017', 'CMP-004', 'Rhona', 'Baxter', 'rhona.baxter@kilbrannan.example', 'Line Operator', 'technician'],

  ['USR-018', 'CMP-005', 'Mariana', 'Esteves', 'mariana.esteves@cascais.example', 'Industrial Project Manager', 'full'],
  ['USR-019', 'CMP-005', 'Rui', 'Cardoso', 'rui.cardoso@cascais.example', 'Procurement Lead', 'commercial'],
];

async function seedUsers() {
  const client = await pool.connect();

  try {
    console.log('Starting users seeder...');

    const passwordHash = await bcrypt.hash(
      DEFAULT_PASSWORD,
      12,
    );

    await client.query('BEGIN');

    for (const user of users) {
      const [
        userId,
        companyId,
        firstName,
        lastName,
        email,
        jobTitle,
        visibility,
      ] = user;

      await client.query(
        `
        INSERT INTO users (
          "userId",
          "companyId",
          "firstName",
          "lastName",
          email,
          "passwordHash",
          "jobTitle",
          visibility
        )
        VALUES (
          $1, $2, $3, $4,
          $5, $6, $7, $8
        )
        ON CONFLICT ("userId")
        DO UPDATE SET
          "companyId" = EXCLUDED."companyId",
          "firstName" = EXCLUDED."firstName",
          "lastName" = EXCLUDED."lastName",
          email = EXCLUDED.email,
          "passwordHash" = EXCLUDED."passwordHash",
          "jobTitle" = EXCLUDED."jobTitle",
          visibility = EXCLUDED.visibility,
          "updatedAt" = CURRENT_TIMESTAMP
        `,
        [
          userId,
          companyId,
          firstName,
          lastName,
          email,
          passwordHash,
          jobTitle,
          visibility,
        ],
      );

      console.log(`Seeded ${userId} - ${email}`);
    }

    await client.query('COMMIT');

    console.log('');
    console.log(`Successfully seeded ${users.length} users.`);
    console.log('Default development password: password');
  } catch (error) {
    await client.query('ROLLBACK');

    console.error('Seeder failed:');
    console.error(error);

    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seedUsers();