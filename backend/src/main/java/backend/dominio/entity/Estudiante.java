package backend.dominio.entity;

public class Estudiante {

    private Long id;
    private String nombre;
    private int edad;
    private String carrera;

    // Constructor
    public Estudiante(Long id, String nombre, int edad, String carrera) {
        this.id = id;
        this.nombre = nombre;
        this.edad = edad;
        this.carrera = carrera;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public int getEdad() { return edad; }
    public String getCarrera() { return carrera; }

    public void setId(Long id) { this.id = id; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setEdad(int edad) { this.edad = edad; }
    public void setCarrera(String carrera) { this.carrera = carrera; }
}
