# Multi-stage build: compile with a full JDK, run on a slim JRE so the shipped image doesn't
# carry the whole Maven build toolchain. Both stages pinned to Java 17 to match <java.version> in
# pom.xml -- a mismatched runtime JDK is a common, confusing source of "works on my machine".
FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /app

# Dependencies first, in their own layer, so `docker build` doesn't re-download the internet on
# every source change -- only invalidated when pom.xml itself changes.
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
RUN chmod +x mvnw && ./mvnw -q dependency:go-offline

COPY src src
RUN ./mvnw -q clean package -DskipTests

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Runs as a non-root user -- the base image's default is root, which is unnecessary risk for a
# process that only needs to listen on one port and talk to Postgres.
RUN groupadd -r aocs && useradd -r -g aocs aocs
COPY --from=build /app/target/*.jar app.jar
RUN chown aocs:aocs app.jar
USER aocs

EXPOSE 8080

# Spring Boot's own Actuator health endpoint (restricted to just `health` in
# application.properties) -- lets `docker ps` / orchestrators see real liveness, not just "the
# process is running", which for a Spring app can still be mid-startup or wedged.
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
    CMD wget -qO- http://localhost:8080/actuator/health | grep -q '"status":"UP"' || exit 1

# SPRING_PROFILES_ACTIVE is left unset here deliberately -- pass it at `docker run`/compose time
# (e.g. -e SPRING_PROFILES_ACTIVE=prod) along with DB_URL/DB_USERNAME/DB_PASSWORD/AOCS_JWT_SECRET/
# CORS_ALLOWED_ORIGINS. Baking a profile into the image would make it impossible to run the same
# image in two environments.
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
