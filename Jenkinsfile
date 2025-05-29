pipeline {
    agent any
    stages {
        stage('Build') {
            agent {
                docker {
                    image 'node:20.19.0'
                    reuseNode true
                }
            }
            steps {
                echo "Workspace - ${env.WORKSPACE}"
                echo "Initiallizing NodeJs Environment..."

                def exitCode = sh(script: 'node -v', returnStatus: true)
                def NODE_VERSION = sh(script: 'node -v', returnStdout: true).trim()

                if (exitCode == 0) {
                    echo "NodeJS Installed (${NODE_VERSION})"
                } else {
                    echo 'NodeJS Not Installed'
                }

                echo "Running Build..."
                exitCode = sh(script: 'npm run build', returnStatus: true)

                if (exitCode == 0){
                    echo "Build completed"
                } else {
                    echo "Build failed! | exitCode: ${exitCode}"
                }
            }
        }
        stage('Check Build') {
            echo "Checking Build Directory..."
            sh 'ls -altr'
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