package backend.dominio.entity;

public class Raza {

    private String id;
    private String nombre;
    private String origen;
    private String descripcion;

    // Constructor
    public Raza(String id, String nombre, String origen, String descripcion) {
        this.id = id;
        this.nombre = nombre;
        this.origen = origen;
        this.descripcion = descripcion;
    }

    // Getters & Setters
    public String getId() { return id; }
    public String getNombre() { return nombre; }
    public String getOrigen() { return origen; }
    public String getDescripcion() { return descripcion; }

    public void setId(String id) { this.id = id; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setOrigen(String origen) { this.origen = origen; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}
