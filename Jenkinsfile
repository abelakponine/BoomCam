pipeline {
    agent any
    stages {
        stage('NodeJS Agent') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                echo "NodeJs Installed - ${env.WORKSPACE}"
                sh '''
                node -v
                ls -altr
                touch demo.txt
                ls -altr
                '''
            }
        }
        stage('Python Agent') {
            steps {
                echo "Python3.9 Installed"
                sh '''
                apt update
                apt install -y python3 python3-pip
                python3 --version
                ls -altr
                touch demo2.txt
                ls -altr
                '''
            }
        }
    }
}