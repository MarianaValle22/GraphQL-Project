package backend.usecase;

import backend.dominio.entity.Estudiante;
import backend.dominio.repository.StudentRepository;
import java.util.List;

public class GetAllStudents {

    private final StudentRepository repository;

    // Constructor con inyección de dependencia
    public GetAllStudents(StudentRepository repository) {
        this.repository = repository;
    }

    // Método principal del caso de uso
    public List<Estudiante> ejecutar() {
        return repository.findAll();
    }
}
