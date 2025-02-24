packer {
  required_plugins {
    amazon = {
      version = ">= 1.2.8, <2.0.0"
      source  = "github.com/hashicorp/amazon"
    }

    googlecompute = {

      version = ">= 1.0.0, <2.0.0"
      source  = "github.com/hashicorp/googlecompute"
    }

  }
}

variable "aws_region" {
  type    = string
  default = env("AWS_REGION")
}

variable "ssh_username" {
  type    = string
  default = "ubuntu"
}

variable "instance_type" {
  type    = string
  default = "t2.micro"
}


variable "access_key" {
  type    = string
  default = env("AWS_ACCESS_KEY_ID")
}

variable "secret_key" {
  type    = string
  default = env("AWS_SECRET_ACCESS_KEY")
}

variable "db_name" {
  type    = string
  default = env("DB_NAME")
}

variable "db_user" {
  type    = string
  default = env("DB_USER")
}

variable "db_password" {
  type    = string
  default = env("DB_PASSWORD")
}

variable "db_host" {
  type    = string
  default = env("DB_HOST")
}

variable "db_port" {
  type    = string
  default = env("DB_PORT")
}


variable "vpc_id" {
  type    = string
  default = env("VPC_ID")
}

variable "subnet_id" {
  type    = string
  default = env("SUBNET_ID")
}

variable "ami_name" {
  default = "webAMI"
}

variable "dev_user" {
  type    = string
  default = env("DEV_USER")
}

variable "demo_user" {
  type    = string
  default = env("DEMO_USER")
}

variable "gcp_project_id" {
  type    = string
  default = "gcp-packer-451719"
}

variable "gcp_zone" {
  type    = string
  default = "us-central1-a"
}

variable "gcp_credentials" {
  type    = string
  default = "./gcp-packer-key.json"
}

variable "ami_name_gcp" {
  default = "webami"
}


locals {
  ami_description = "Image for webapp"
  timestamp       = regex_replace(timestamp(), "[- TZ:]", "")
}


source "amazon-ebs" "ubuntu" {
  ami_name      = "${var.ami_name}-${local.timestamp}"
  instance_type = var.instance_type
  region        = var.aws_region
  access_key    = var.access_key
  secret_key    = var.secret_key
  source_ami    = "ami-04b4f1a9cf54c11d0"
  ssh_username  = var.ssh_username
  subnet_id     = var.subnet_id
  vpc_id        = var.vpc_id
  ami_users     = [var.dev_user, var.demo_user]

  tags = {
    Name        = "webAMI"
    Environment = "dev"
  }

  launch_block_device_mappings {
    device_name           = "/dev/sda1"
    volume_size           = 25
    volume_type           = "gp2"
    delete_on_termination = true
  }
}

source "googlecompute" "gcp_image" {
  project_id          = var.gcp_project_id
  source_image_family = "ubuntu-2004-lts"
  image_name          = "webami-gcp-${local.timestamp}"
  machine_type        = "e2-medium"
  zone                = var.gcp_zone
  credentials_file    = var.gcp_credentials
  ssh_username        = "ubuntu"
}

build {
  sources = ["source.amazon-ebs.ubuntu", "source.googlecompute.gcp_image"]


  provisioner "file" {
    source      = "webapp.zip"
    destination = "/tmp/webapp.zip"
    generated   = true
  }

  provisioner "file" {
    source      = "./csye6225-aws.service"
    destination = "/tmp/csye6225-aws.service"
  }


  provisioner "file" {
    source      = ".env"
    destination = "/tmp/.env"
    generated   = true
  }


  provisioner "shell" {
    script = "./setup.sh"


    environment_vars = [
      "DB_PASSWORD=${var.db_password}",
      "DB_NAME=${var.db_name}",
      "DB_USER=${var.db_name}",
      "DB_HOST=${var.db_host}",
      "DB_PORT=${var.db_port}",
    ]

  }



  provisioner "shell" {

    script = "./init-app.sh"
  }

}
