package main

import (
	"fmt"
	"log"
	"time"
	"github.com/gliderlabs/ssh"
	"ssh-sensor/logger" 
)

func main() {
	fmt.Println("Starting honeypot on port 2222....")
	logger.InitKafka()
	defer logger.CloseKafka()

	PasswordHandler := func(ctx ssh.Context, password string) bool {
		ip := ctx.RemoteAddr().String()
		user := ctx.User()
		currentTime := time.Now().UTC().Format(time.RFC3339)

		fmt.Printf("ALERT: Login attempt! User: %s, Pass: %s, IP: %s\n", user, password, ip)
		logger.SendLog(ip, user, password, currentTime)

		return false 
	}

	log.Fatal(ssh.ListenAndServe(":2222", nil, ssh.PasswordAuth(PasswordHandler), ssh.HostKeyFile("honeypot_key")))
}