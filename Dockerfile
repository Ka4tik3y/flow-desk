FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml ./
COPY .mvn .mvn
COPY mvnw ./
COPY mvnw.cmd ./
COPY src src

RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

ENV APP_PORT=8080
ENV STORAGE_PATH=/app/uploads

RUN mkdir -p /app/uploads

COPY --from=build /app/target/flow-desk-*.jar /app/app.jar

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -Dserver.port=${APP_PORT:-8080} -jar /app/app.jar"]
