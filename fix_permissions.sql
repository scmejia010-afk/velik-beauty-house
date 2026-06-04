GRANT ALL PRIVILEGES ON TABLE inventario TO postgres, service_role, anon, authenticated;

-- Eliminar politicas viejas si existen para no duplicar
DROP POLICY IF EXISTS "Permitir lectura publica de inventario" ON inventario;
DROP POLICY IF EXISTS "Permitir actualizacion al admin" ON inventario;
DROP POLICY IF EXISTS "Permitir insertar al admin" ON inventario;

-- Volver a crear politicas asegurando que todos tengan acceso
CREATE POLICY "Permitir lectura a todos" 
ON inventario FOR SELECT TO public USING (true);

CREATE POLICY "Permitir modificacion al admin" 
ON inventario FOR ALL TO authenticated USING (true) WITH CHECK (true);
