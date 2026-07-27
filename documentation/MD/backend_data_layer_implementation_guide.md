# Backend Data Layer & ORM Implementation Guide (Krishna's Technical Specification)

> [!SUCCESS]
> **Data Layer Officially Signed Off**: Following multi-round architectural audits and verification of all 17 JPA Entities and 16 Spring Data Repositories, Krishna's backend data layer is officially signed off and ready for Anay to begin building REST Controllers and Service Business Logic.


> [!IMPORTANT]
> **Single Canonical Source of Truth**: The physical PostgreSQL 18 schema definition in `db/migration/V1__initial_schema.sql` (and `V2__seed_data.sql`) constitutes the single canonical ground truth for all 38 tables across the entire project. All JPA Entity classes, repositories, and documentation are strictly derived from and validated against `V1__initial_schema.sql`.


**Project:** Saphire Airport Operations Coordination System (AOCS)  
**Assigned Owner:** Krishna Solanki (Database & System Integration)  
**Document Version:** 1.0  
**Date:** 2026-07-28  

---

## 1. Scope & Objective

This document outlines the exact technical requirements, package layout, configuration settings, JPA `@Entity` classes, and Spring Data JPA Repository interfaces required to set up the backend data layer. 

By building this layer, you map the **PostgreSQL schema** (`V1__initial_schema.sql` & `V2__seed_data.sql`) directly into Java objects, allowing **Anay Modi** (Backend API & Logic Lead) to immediately write REST Controllers and Business Services.

---

## 2. Directory & Package Structure

The backend application will be located inside the `backend/` folder of the repository:

```text
backend/
├── pom.xml
└── src/
    └── main/
        ├── java/
        │   └── com/
        │       └── saphire/
        │           └── aocs/
        │               ├── AocsApplication.java
        │               ├── entity/              <-- Krishna's Entity Classes
        │               │   ├── Aircraft.java
        │               │   ├── AircraftType.java
        │               │   ├── Airline.java
        │               │   ├── Airport.java
        │               │   ├── AuditLog.java
        │               │   ├── DelayLog.java
        │               │   ├── Department.java
        │               │   ├── Flight.java
        │               │   ├── Gate.java
        │               │   ├── Notification.java
        │               │   ├── Role.java
        │               │   ├── Stand.java
        │               │   ├── TurnaroundTask.java
        │               │   └── User.java
        │               └── repository/          <-- Krishna's Repository Interfaces
        │                   ├── AircraftRepository.java
        │                   ├── AirportRepository.java
        │                   ├── AuditLogRepository.java
        │                   ├── DelayLogRepository.java
        │                   ├── DepartmentRepository.java
        │                   ├── FlightRepository.java
        │                   ├── GateRepository.java
        │                   ├── TaskRepository.java
        │                   └── UserRepository.java
        └── resources/
            ├── application.properties           <-- Krishna's DB & Flyway Config
            └── db/
                └── migration/                   <-- Existing V1 & V2 SQL Scripts
```

---

## 3. Step 1: Maven `pom.xml` Dependencies

The `pom.xml` file requires the following core starter dependencies:

```xml
<dependencies>
    <!-- Spring Boot Web Starter for REST APIs -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Spring Data JPA for ORM & Repositories -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <!-- PostgreSQL JDBC Driver -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- Flyway Core for Database Migrations -->
    <dependency>
        <groupId>org.flywaydb</groupId>
        <artifactId>flyway-core</artifactId>
    </dependency>
    <dependency>
        <groupId>org.flywaydb</groupId>
        <artifactId>flyway-database-postgresql</artifactId>
    </dependency>

    <!-- Lombok for Getters/Setters/Constructors -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>

    <!-- Bean Validation -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
</dependencies>
```

---

## 4. Step 2: `application.properties` Configuration

Create `src/main/resources/application.properties` to connect Spring Boot to your local PostgreSQL instance and enable automatic Flyway migrations:

```properties
# App Name & Server Port
spring.application.name=saphire-aocs-backend
server.port=8080

# PostgreSQL Database Connection
spring.datasource.url=jdbc:postgresql://localhost:5432/aocs_db
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA & Hibernate Settings
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Flyway Database Migration Settings
spring.flyway.enabled=true
spring.flyway.baseline-on-migrate=true
spring.flyway.locations=classpath:db/migration

# CORS Configuration (for React Frontend integration)
management.endpoints.web.exposure.include=*
```

---

## 5. Step 3: Core Java `@Entity` Mappings

Below are the key entity class definitions mapping PostgreSQL tables to Java objects.

### 5.1 `Airport.java`
```java
package com.saphire.aocs.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "airports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Airport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "airport_id")
    private Long airportId;

    @Column(name = "iata_code", length = 10, nullable = false, unique = true)
    private String iataCode;

    @Column(name = "icao_code", length = 10, nullable = false, unique = true)
    private String icaoCode;

    @Column(name = "airport_name", length = 100, nullable = false)
    private String airportName;

    @Column(name = "city", length = 50, nullable = false)
    private String city;

    @Column(name = "country", length = 50, nullable = false)
    private String country;

    @Column(name = "timezone", length = 50, nullable = false)
    private String timezone;
}
```

### 5.2 `Flight.java` (Core Operational Entity)
```java
package com.saphire.aocs.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.ZonedDateTime;

@Entity
@Table(name = "flights")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "flight_id")
    private Long flightId;

    @Column(name = "flight_number", length = 10, nullable = false)
    private String flightNumber;

    @Column(name = "flight_status", length = 20, nullable = false)
    private String flightStatus; // SCHEDULED, BOARDING, AIRBORNE, LANDED, DELAYED, CANCELLED

    @Column(name = "flight_type", length = 15, nullable = false)
    private String flightType; // ARRIVAL, DEPARTURE

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "origin_airport_id", nullable = false)
    private Airport originAirport;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "destination_airport_id", nullable = false)
    private Airport destinationAirport;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "airline_id", nullable = false)
    private Airline airline;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "aircraft_id", nullable = false)
    private Aircraft aircraft;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "gate_id")
    private Gate gate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "stand_id")
    private Stand stand;

    @Column(name = "scheduled_departure_time", nullable = false)
    private ZonedDateTime scheduledDepartureTime;

    @Column(name = "estimated_departure_time")
    private ZonedDateTime estimatedDepartureTime;

    @Column(name = "actual_departure_time")
    private ZonedDateTime actualDepartureTime;

    @Column(name = "scheduled_arrival_time", nullable = false)
    private ZonedDateTime scheduledArrivalTime;

    @Column(name = "estimated_arrival_time")
    private ZonedDateTime estimatedArrivalTime;

    @Column(name = "actual_arrival_time")
    private ZonedDateTime actualArrivalTime;
}
```

### 5.3 `TurnaroundTask.java`
```java
package com.saphire.aocs.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.ZonedDateTime;

@Entity
@Table(name = "turnaround_tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TurnaroundTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id")
    private Long taskId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_to_user_id")
    private User assignedUser;

    @Column(name = "task_name", length = 100, nullable = false)
    private String taskName; // CLEANING, REFUELING, MAINTENANCE, CATERING, BOARDING, SECURITY

    @Column(name = "priority", length = 20, nullable = false)
    private String priority; // NORMAL, HIGH, CRITICAL

    @Column(name = "status", length = 30, nullable = false)
    private String status; // PENDING, IN_PROGRESS, COMPLETED, DELAYED

    @Column(name = "planned_start", nullable = false)
    private ZonedDateTime plannedStart;

    @Column(name = "planned_end", nullable = false)
    private ZonedDateTime plannedEnd;

    @Column(name = "actual_start")
    private ZonedDateTime actualStart;

    @Column(name = "actual_end")
    private ZonedDateTime actualEnd;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}
```

---

## 6. Step 4: Spring Data JPA Repositories

Create repository interfaces extending `JpaRepository` to provide custom query methods:

### 6.1 `FlightRepository.java`
```java
package com.saphire.aocs.repository;

import com.saphire.aocs.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {

    // Enforce Saphire Hub Constraint: Find all flights originating or terminating at SPH (airport_id = 1)
    @Query("SELECT f FROM Flight f WHERE f.originAirport.airportId = 1 OR f.destinationAirport.airportId = 1")
    List<Flight> findAllSaphireHubFlights();

    List<Flight> findByFlightStatus(String status);

    List<Flight> findByFlightNumberContainingIgnoreCase(String flightNumber);
}
```

### 6.2 `TaskRepository.java`
```java
package com.saphire.aocs.repository;

import com.saphire.aocs.entity.TurnaroundTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<TurnaroundTask, Long> {

    List<TurnaroundTask> findByFlight_FlightId(Long flightId);

    List<TurnaroundTask> findByDepartment_DepartmentId(Long departmentId);

    List<TurnaroundTask> findByStatus(String status);

    List<TurnaroundTask> findByAssignedUser_UserId(Long userId);
}
```

---

## 7. Handoff Contract for Anay Modi

Once you finish pushing the `backend/` shell containing `pom.xml`, `application.properties`, `@Entity` classes, and `Repository` interfaces:

1. **Anay** can `@Autowired` your repositories (`FlightRepository`, `TaskRepository`, `GateRepository`) directly into his `@Service` classes (`FlightService.java`, `TaskService.java`).
2. **Anay** can write `@RestController` classes (`FlightController.java`, `TaskController.java`) returning data fetched through your repositories.
3. No duplicate effort or code collisions will occur!
