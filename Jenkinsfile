pipeline {

    agent any

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
            echo 'EMS CI pipeline completed successfully.'
        }

        failure {
            echo 'EMS CI pipeline failed.'
        }

        always {
            echo 'Pipeline execution completed.'
        }
    }
}