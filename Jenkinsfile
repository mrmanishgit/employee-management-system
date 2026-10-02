pipeline {

    agent any

    environment {
        MYSQL_ROOT_PASSWORD = credentials('ems-mysql-root-password')
        MYSQL_USER          = credentials('ems-mysql-user')
        MYSQL_PASSWORD      = credentials('ems-mysql-password')
        JWT_SECRET          = credentials('ems-jwt-secret')
        ADMIN_EMAIL         = credentials('ems-admin-email')
        ADMIN_PASSWORD      = credentials('ems-admin-password')
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Build & Test') {
            steps {
                dir('ems-backend') {
                    bat 'mvn clean package'
                }
            }
        }

        stage('Frontend Install') {
            steps {
                dir('ems-frontend') {
                    bat 'npm ci'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('ems-frontend') {
                    bat 'npm run build'
                }
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker compose build'
            }
        }

        stage('Deploy') {
            steps {
                bat 'docker compose up -d'
            }
        }
    }

    post {

        success {
            echo 'EMS CI/CD pipeline completed successfully.'
        }

        failure {
            echo 'EMS CI/CD pipeline failed.'
        }

        always {
            echo 'Pipeline execution completed.'
        }
    }
}