-- Script d'init pour créer les rôles admin et superadmin
-- Table : users (id, email, password, firstName, lastName, role, createdAt)
 
INSERT INTO users (email, password, "firstName", "lastName", role, "createdAt")
VALUES
  ('admin@bantudelice.com',   'admin_password_hash',   'Admin',   'Principal',   'admin',   NOW()),
  ('superadmin@bantudelice.com', 'superadmin_password_hash', 'Super', 'Admin', 'superadmin', NOW())
ON CONFLICT (email) DO NOTHING; 