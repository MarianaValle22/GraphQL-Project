package backend.usecase;

import backend.dominio.entity.Raza;
import backend.infraestructura.out.external.CatAPIAdapter;

public class GetRazaByID {

    private final CatAPIAdapter catAPIAdapter;

    // Constructor que recibe el adaptador
    public GetRazaByID(CatAPIAdapter catAPIAdapter) {
        this.catAPIAdapter = catAPIAdapter;
    }

    public Raza ejecutar(String id) {
        return catAPIAdapter.getRazaByID(id);
    }
}
