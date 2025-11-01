# Imagen base con Java 17 y Maven
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copiar todo el código del proyecto
COPY . .

# Compilar sin ejecutar tests
RUN mvn clean package -DskipTests

# Etapa de ejecución con una imagen más liviana
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app

# Copiar el JAR compilado desde la etapa anterior
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# Comando por defecto
# CMD ["java", "-jar", "app.jar"]

CMD ["sh", "-c", "java -jar app.jar --server.port=${PORT:-8080}"]

