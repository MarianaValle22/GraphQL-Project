package backend.infraestructura.in.graphql;

import backend.dominio.entity.Estudiante;
import backend.dominio.entity.Raza;
import backend.infraestructura.out.db.SQLStudentsRepository;
import backend.infraestructura.out.external.CatAPIAdapter;
import backend.usecase.GetAllStudents;
import backend.usecase.GetRazaByID;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class GraphQLController {

    private final GetAllStudents getAllStudents;
    private final GetRazaByID getRazaByID;

    public GraphQLController() {
        // Inicializamos los usecase
        SQLStudentsRepository studentRepo = new SQLStudentsRepository();
        CatAPIAdapter catAPI = new CatAPIAdapter();

        this.getAllStudents = new GetAllStudents(studentRepo);
        this.getRazaByID = new GetRazaByID(catAPI);
    }

    @QueryMapping
    public Raza getRazaByID(@Argument String id) {
        return getRazaByID.ejecutar(id);
    }

    @QueryMapping
    public List<Estudiante> getEstudiantes() {
        return getAllStudents.ejecutar();
    }
}
