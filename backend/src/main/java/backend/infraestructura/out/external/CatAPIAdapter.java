package backend.infraestructura.out.external;

import backend.dominio.entity.Raza;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Properties;

public class CatAPIAdapter {

    private static final String BASE_URL = "https://api.thecatapi.com/v1/breeds";
    private static final String API_KEY = loadApiKey();

    // Carga la API Key desde el archivo .env local
    private static String loadApiKey() {
        try (InputStream input = new FileInputStream(".env")) {
            Properties prop = new Properties();
            prop.load(input);
            return prop.getProperty("THE_CAT_API_KEY");
        } catch (IOException e) {
            System.err.println("Error: No se encontró el archivo .env o la clave.");
            return null;
        }
    }

    // Llamado a TheCatAPI
    public Raza getRazaByID(String id) {
        try {
            System.out.println("Buscando raza con ID: " + id);

            URL url = new URL(BASE_URL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");

            if (API_KEY != null && !API_KEY.isEmpty()) {
                conn.setRequestProperty("x-api-key", API_KEY);
            }

            // Lee la respuesta JSON
            BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();

            JSONArray jsonArray = new JSONArray(response.toString());
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject obj = jsonArray.getJSONObject(i);
                if (obj.getString("id").equalsIgnoreCase(id)) {
                    System.out.println("Encontrada: " + obj.getString("name"));

                    return new Raza(
                            obj.getString("id"),
                            obj.optString("name", "Sin nombre"),
                            obj.optString("origin", "Desconocido"),
                            obj.optString("description", "Sin descripción")
                    );
                }
            }

            System.err.println("Error: No se encontró la raza con id: " + id);
            return null;

        } catch (Exception e) {
            System.err.println("Error al consultar TheCatAPI: " + e.getMessage());
            return null;
        }
    }
}
