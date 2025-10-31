package backend.dominio.repository;

import backend.dominio.entity.Estudiante;
import java.util.List;

public interface StudentRepository {
    List<Estudiante> findAll();
}
