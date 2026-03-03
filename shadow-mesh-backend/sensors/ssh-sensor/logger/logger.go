package logger

import (
	"context"
	"encoding/json"
	"log"

	"github.com/segmentio/kafka-go"
)

type AttackLog struct {
	IP        string `json:"ip"`
	Username  string `json:"username"`
	Password  string `json:"password"`
	Timestamp string `json:"timestamp"`
}

var w *kafka.Writer

func InitKafka() {
	w = &kafka.Writer{
		Addr:     kafka.TCP("127.0.0.1:9092"),
		Topic:    "sensor-logs",
		Balancer: &kafka.LeastBytes{},
	}
}
func CloseKafka() {
	if w != nil {
		w.Close()
	}
}

func SendLog(ip string, username string, password string, timestamp string) {
	logEntry := AttackLog{
		IP:        ip,
		Username:  username,
		Password:  password,
		Timestamp: timestamp,
	}

	jsonBytes, err := json.Marshal(logEntry)
	if err != nil {
		log.Printf("failed to marshal JSON: %v\n", err)
		return
	}

	err = w.WriteMessages(context.Background(), kafka.Message{
		Key:   []byte("ssh-attempt"),
		Value: jsonBytes,
	})
	if err != nil {
		log.Printf("failed to write message to Kafka: %v\n", err)
	}
}
