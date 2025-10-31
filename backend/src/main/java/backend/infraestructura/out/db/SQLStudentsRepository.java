package backend.infraestructura.out.db;

import backend.dominio.entity.Estudiante;
import backend.dominio.repository.StudentRepository;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class SQLStudentsRepository implements StudentRepository {

    public SQLStudentsRepository() {
        crearTablaSiNoExiste();
        inicializarBaseSiVacia();
    }

    private void crearTablaSiNoExiste() {
        String sql = """
            CREATE TABLE IF NOT EXISTS estudiantes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                edad INTEGER NOT NULL,
                carrera TEXT NOT NULL
            );
            """;

        try (Connection conn = SQLConfig.getConnection();
             Statement stmt = conn.createStatement()) {
            stmt.execute(sql);

            String countSql = "SELECT COUNT(*) FROM estudiantes";
            try (ResultSet rs = stmt.executeQuery(countSql)) {
                if (rs.next() && rs.getInt(1) == 0) {
                    System.out.println("- Base vacía, insertando datos iniciales...");
                    String insertSql = """
                        INSERT INTO estudiantes (nombre, edad, carrera) VALUES
                        ('María López', 22, 'Ingeniería de Sistemas'),
                        ('Juan Pérez', 23, 'Analítica de Datos'),
                        ('Camila Gómez', 21, 'Administración');
                        """;
                    stmt.execute(insertSql);
                    System.out.println("- Datos iniciales insertados correctamente.");
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }


    // Si la tabla está vacía, ejecuta el script init.sql para cargar los datos
    private void inicializarBaseSiVacia() {
        try (Connection conn = SQLConfig.getConnection();
             Statement stmt = conn.createStatement()) {

            ResultSet rs = stmt.executeQuery("SELECT COUNT(*) AS total FROM estudiantes");
            if (rs.next() && rs.getInt("total") == 0) {
                System.out.println("- Base vacía, cargando datos iniciales...");

                // Lee el archivo init.sql desde resources
                InputStream input = getClass().getClassLoader().getResourceAsStream("db/init.sql");
                if (input != null) {
                    String script = new String(input.readAllBytes(), StandardCharsets.UTF_8);
                    stmt.executeUpdate(script);
                    System.out.println("- Datos iniciales insertados correctamente.");
                } else {
                    System.err.println("Error No se encontró el archivo init.sql");
                }
            }
        } catch (Exception e) {
            System.err.println("Error inicializando base: " + e.getMessage());
        }
    }

    @Override
    public List<Estudiante> findAll() {
        List<Estudiante> estudiantes = new ArrayList<>();
        String sql = "SELECT * FROM estudiantes";

        try (Connection conn = SQLConfig.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                Estudiante est = new Estudiante(
                        rs.getLong("id"),
                        rs.getString("nombre"),
                        rs.getInt("edad"),
                        rs.getString("carrera")
                );
                estudiantes.add(est);
            }

        } catch (SQLException e) {
            System.err.println("Error consultando estudiantes: " + e.getMessage());
        }

        return estudiantes;
    }
}
