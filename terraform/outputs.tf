output "instance_public_ip" {
  value = aws_instance.devops_server.public_ip
}

output "jenkins_url" {
  value = "http://${aws_instance.devops_server.public_ip}:8080"
}

output "app_url" {
  value = "http://${aws_instance.devops_server.public_ip}"
}