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

                script {
                    def exitCode = sh(script: 'node -v', returnStatus: true)
                    def NODE_VERSION = sh(script: 'node -v', returnStdout: true).trim()

                    if (exitCode == 0) {
                        echo "NodeJS Installed (${NODE_VERSION})"
                    } else {
                        echo 'NodeJS Not Installed'
                    }

                    echo "Change to TypeScript Directory"
                    sh '''
                    cd TypeScript && ls -altr
                    npm install
                    npm install -g serve
                    '''

                    echo "Running Build..."
                    exitCode = sh(script: 'cd TypeScript && ls -altr && npm ci && CI=false npm run build', returnStatus: true)

                    if (exitCode == 0){
                        echo "Build completed"
                        echo "Serving build..."
                        sh 'serve -s build'
                    } else {
                        echo "Build failed! | exitCode: ${exitCode}"
                    }
                }
            }
        }
        stage('Check Build') {
            steps {
                echo "Checking Build Directory..."
                sh 'ls -altr'
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