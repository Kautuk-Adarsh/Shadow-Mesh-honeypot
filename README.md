#  Shadow Mesh

![Docker](https://img.shields.io/badge/Docker-Containerized-blue?logo=docker)
![Go](https://img.shields.io/badge/Sensor-Go-00ADD8?logo=go)
![Node.js](https://img.shields.io/badge/Microservices-Node.js-339933?logo=nodedotjs)
![Kafka](https://img.shields.io/badge/Broker-Apache_Kafka-231F20?logo=apachekafka)
![CockroachDB](https://img.shields.io/badge/Database-CockroachDB-6933FF?logo=cockroachlabs)
![Next.js](https://img.shields.io/badge/Dashboard-Next.js-000000?logo=nextdotjs)

**Shadow Mesh** is a distributed, AI-powered SSH honeypot architecture designed to detect, intercept, and analyze brute-force attacks in real-time. Built with a focus on security-first engineering and resilient microservices, it captures malicious payloads, routes them through a high-throughput event streaming pipeline, and leverages LLMs for automated threat intelligence.

## System Architecture

The platform operates as a fully containerized ecosystem comprising five isolated layers:

| Component | Technology | Responsibility |
| :--- | :--- | :--- |
| **Edge Sensor** | `Go` | A custom SSH server that acts as a honeypot, trapping unauthorized login attempts on port 2222. |
| **Message Broker** | `Apache Kafka` | Handles high-throughput event streaming, decoupling the edge sensors from the processing logic. |
| **Threat Analyzer** | `Node.js` + `Gemini API` | Consumes events from Kafka, queries the LLM for threat context, and dynamically provisions database schemas. |
| **Data Vault** | `CockroachDB` + `Redis` | Provides distributed, persistent storage for threat logs and high-speed in-memory caching for the API. |
| **Command Center** | `Next.js` + `Express` | A real-time dashboard served via an API Gateway to visualize attack vectors and AI threat scores. |



##  Key Features
* **Real-Time Interception:** Custom Go-based SSH listener that instantly logs IP, username, and password vectors without granting actual shell access.
* **Asynchronous Processing:** Kafka integration ensures zero data loss during high-volume brute-force swarms.
* **Automated Threat Intel:** Integrates with the Google Gemini API to assign severity scores and classify attack types dynamically.
* **Deadlock-Resistant Database:** Utilizes robust connection pooling (`pg.Pool`) to prevent TCP exhaustion during heavy concurrent loads.
* **One-Click Deployment:** Entire 6-container architecture is orchestrated seamlessly via `docker-compose`.

## Getting Started

### Prerequisites
* Docker & Docker Compose
* Go (1.20+)
* Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Kautuk-Adarsh/shadow-mesh.git](https://github.com/Kautuk-Adarsh/shadow-mesh.git)
   cd shadow-mesh
2. **Configure Environment Variables:**
    Create a .env file in the root directory and add your API credentials:
        `GEMINI_API_KEY=your_gemini_api_key_here`
3. **Deploy the Architecture**:
    Spin up the entire microservice ecosystem::
        `docker compose up --build -d`
4. **Start the Honeypot Sensor:**
    In a separate terminal, launch the edge listener:
            `cd sensors/ssh-sensor`
            `go run main.go`

**Live Fire Test**
    To test the pipeline, open a new terminal and simulate a brute-force attempt against your local honeypot:
        `ssh root@localhost -p 2222`
    **Navigate to http://localhost:3001 to view the attack visualized in real-time on the Next.js dashboard.**    