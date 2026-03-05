pipeline {
    agent {
        docker {
            image '10.0.0.55:6001/jenkins-agent-with-jq:latest'
            args '-u root:root -v /var/run/docker.sock:/var/run/docker.sock -v /usr/libexec/docker/cli-plugins:/usr/libexec/docker/cli-plugins:ro'  // 🚀 挂载 Docker socket
        }
    }
    options {
        ansiColor('xterm')
        timestamps()
        gitLabConnection('gitlab-connection')
        disableConcurrentBuilds()     // 不允许同分支并发，即：新来旧止 
        buildDiscarder(logRotator(numToKeepStr: '5', daysToKeepStr: '7'))   // 保留最近 5 次构建或 7 天内的构建历史
    }
    environment {
        DOCKER_IMAGE = '10.0.0.55:6001/lydc-cloud-web'
        DEV_REMOTE_HOST = '10.0.0.56'
        DEV_REMOTE_USER = 'ph'
        DEV_SSH_CREDENTIALS_ID = 'lydc_dev_56_server'
        DEV_SSH_REMOTE_PORT = '222'
        DEV_CONTAINER_NAME = 'lydc-web-docker'
        TEST_KUBOARD_TOKEN = 'hzbkryirhxw6.ad3rijdft8kch4h6a7kcsz6netbzis4i'
        PROD_KUBOARD_TOKEN = 'rj773rxpa5kr.z5mhx32ee2dstwwiar4przb7e5eeyjt2'

        // 代码检测流程变量
        SONARQUBE_ENV = 'sonar'
        SCANNER_TOOL = 'SonarQube-Scanner'
        PROJECT_KEY = 'lydc_web'
        SONAR_HOST = 'http://lysonar.lstech.com'
        DING_WEBHOOK = 'https://oapi.dingtalk.com/robot/send?access_token=8c6fee779e4a0fcbf3b14dc5a629cc0241284db277aec01a608b9a02400f9da8'

        // 🚀 优化： 启用BuildKit
        DOCKER_BUILDKIT = '1'
        BUILDKIT_PROGRESS = 'plain'
        GITLAB_HOST = "10.0.0.55:8090"
        PROJECT_PATH = "diecut_bg%2Ffrontend%2Flydc.server.web"
    }
    stages {
      stage('初始化状态') {
          steps {
              script {
                  echo "🚀 开始构建流程..."
                  echo "构建任务: ${env.JOB_NAME}"
                  echo "构建编号: ${env.BUILD_NUMBER}"
                  echo "分支名称: ${env.BRANCH_NAME}"
                  try {
                      gitlabCommitStatus(name: 'jenkins-ci') {
                          // 在这个 block 中执行，Jenkins 会自动设置状态为 pending
                          echo "开始构建流程，状态已设置为 pending"
                      }
                      echo "✅ gitlabCommitStatus 成功"
                  } catch (Exception e) {
                      echo "GitLab 状态设置失败: ${e.getMessage()}"
                      echo "继续执行构建流程..."
                  }
              }
          }
      }
      stage('初始化函数') {
          steps {
              script {
                  getImageTag = { branch, shortCommit ->
                      if (branch == 'dev') return "dev-${shortCommit}"
                      else if (branch == 'test') return "uat-${shortCommit}"
                      else if (branch == 'pre_release') return "rc-${shortCommit}"
                      else if (branch == 'release') return "prod-${shortCommit}"
                      else if (branch == 'release_external') return "prod-${shortCommit}"
                      else error("未知分支，无法确定镜像tag")
                  }

                  checkMRApproval = {  ->
                    def mrId = env.CHANGE_ID

                    if (!mrId) {
                        echo "检测到非 MR 直接构建，尝试从 Git Commit 记录追溯 MR 信息..."

                        def lastCommitMsg = sh(
                            script: "git log -1 --pretty=format:'%B'",
                            returnStdout: true
                        ).trim()

                        echo "=== 完整提交信息 ==="
                        echo "${lastCommitMsg}"
                        echo "===================="

                        // 🔧 使用简单的字符串匹配代替复杂正则表达式
                        def foundMR = false

                        // 查找 "See merge request" 或 "merge request" 后面的 !数字
                        if ((lastCommitMsg.contains("See merge request") || lastCommitMsg.contains("merge request")) && lastCommitMsg.contains("!")) {
                            def idx = lastCommitMsg.indexOf("!")
                            if (idx > 0 && idx < lastCommitMsg.length() - 1) {
                                def afterExclaim = lastCommitMsg.substring(idx + 1)
                                // 使用正则表达式提取数字（Sandbox 允许这种方式）
                                def matcher = afterExclaim =~ /^(\d+)/
                                if (matcher.find()) {
                                    mrId = matcher.group(1)
                                    echo "✅ 成功提取 MR 编号: !${mrId}"
                                    foundMR = true
                                }
                            }
                        }

                        if (!foundMR) {
                            echo "⚠️ 在最新提交中未找到 MR 信息，检查最近 5 次提交..."
                            def recentCommits = sh(
                                script: "git log -5 --pretty=format:'%B%n---COMMIT---'",
                                returnStdout: true
                            ).trim()

                            echo "=== 最近提交历史 ==="
                            echo "${recentCommits}"
                            echo "===================="

                            if ((recentCommits.contains("See merge request") || recentCommits.contains("merge request")) && recentCommits.contains("!")) {
                                def idx = recentCommits.indexOf("!")
                                if (idx > 0 && idx < recentCommits.length() - 1) {
                                    def afterExclaim = recentCommits.substring(idx + 1)
                                    def matcher = afterExclaim =~ /^(\d+)/
                                    if (matcher.find()) {
                                        mrId = matcher.group(1)
                                        echo "✅ 在历史提交中找到 MR 编号: !${mrId}"
                                        foundMR = true
                                    }
                                }
                            }

                            if (!foundMR) {
                                echo "❌ 无法在提交历史中找到 MR 信息，拒绝构建"
                                return false
                            }
                        }
                    }

                    echo "\n检测到合并请求: MR-${mrId}"
                    if (env.CHANGE_BRANCH) echo "源分支: ${env.CHANGE_BRANCH}"
                    if (env.CHANGE_TARGET) echo "目标分支: ${env.CHANGE_TARGET}"

                    def gitlabHost = env.GITLAB_HOST
                    def projectPath = env.PROJECT_PATH
                    def apiBase = "http://${gitlabHost}/api/v4/projects/${projectPath}/merge_requests/${mrId}"

                    // 条件1: MR 必须已合并
                    def isMerged = false
                    // 条件2: 必须有审批评论
                    def hasApprovalComment = false

                    withCredentials([string(credentialsId: 'gitlab_amber_token', variable: 'GITLAB_TOKEN')]) {
                        // 步骤1: 检查 MR 是否已合并
                        try {
                            def mrInfoResponse = sh(
                                script: """
                                    curl -s -w '\\nHTTP_CODE:%{http_code}' \\
                                    --header "PRIVATE-TOKEN: ${GITLAB_TOKEN}" \\
                                    "${apiBase}"
                                """,
                                returnStdout: true
                            ).trim()

                            def parts = mrInfoResponse.split('HTTP_CODE:')
                            def httpCode = parts.length > 1 ? parts[1].trim() : '000'
                            def responseBody = parts[0].trim()

                            if (httpCode != '200') {
                                echo "❌ 无法获取 MR 信息，HTTP ${httpCode}"
                                return false
                            }

                            def mrData = readJSON text: responseBody
                            echo "✓ MR 标题: ${mrData.title}"
                            echo "✓ MR 状态: ${mrData.state}"

                            if (mrData.state == 'merged') {
                                echo "✅ 条件1通过: MR 已合并"
                                isMerged = true
                            } else {
                                echo "❌ 条件1不满足: MR 状态为 '${mrData.state}'，必须是 'merged'"
                                return false
                            }
                        } catch (Exception e) {
                            echo "❌ 获取 MR 信息失败: ${e.message}"
                            return false
                        }

                        // 步骤2: 检查是否有审批评论
                        try {
                            def notesResponse = sh(
                                script: """
                                    curl -s --header "PRIVATE-TOKEN: ${GITLAB_TOKEN}" \\
                                    "${apiBase}/notes?sort=desc&order_by=created_at&per_page=100"
                                """,
                                returnStdout: true
                            ).trim()

                            def notes = readJSON text: notesResponse

                            // 🔧 配置审批关键字
                            def approvedKeywords = ['approved', 'lgtm', '批准', '同意发布', 'approve', '通过', '已审核']

                            // 🔒 从 Jenkins Credentials 获取审批人列表（防篡改）
                            def approvers = []
                            withCredentials([string(credentialsId: 'mr-approvers-list', variable: 'APPROVERS_LIST')]) {
                                approvers = APPROVERS_LIST.split(',').collect { it.trim() }.findAll { it }
                            }

                            echo "检查评论中是否有审批..."
                            echo "授权审查者: ${approvers.join(', ')}"
                            echo "审批关键字: ${approvedKeywords.join(', ')}"

                            for (note in notes) {
                                if (!note.system && note.author && note.body) {
                                    def author = note.author.username
                                    def bodyLower = note.body.toLowerCase()

                                    // 检查是否是授权审查者
                                    if (approvers.contains(author)) {
                                        // 检查评论是否包含审批关键字
                                        def matchedKeyword = approvedKeywords.find { keyword ->
                                            bodyLower.contains(keyword.toLowerCase())
                                        }
                                        if (matchedKeyword) {
                                            echo "✅ 条件2通过: 找到审批评论"
                                            echo "   审查者: ${author}"
                                            echo "   关键字: ${matchedKeyword}"
                                            echo "   评论: ${note.body.take(100)}..."
                                            hasApprovalComment = true
                                            break  // 找到一个有效审批就够了
                                        }
                                    }
                                }
                            }

                            if (!hasApprovalComment) {
                                echo "❌ 条件2不满足: 未找到授权审查者的审批评论"
                            }

                        } catch (Exception e) {
                            echo "❌ 检查评论失败: ${e.message}"
                            return false
                        }
                    }

                    // 两个条件都必须满足
                    if (isMerged && hasApprovalComment) {
                        echo "\n" + "="*50
                        echo "✅✅✅ 审批检查通过"
                        echo "="*50
                        return true
                    } else {
                        echo "\n" + "="*50
                        echo "❌❌❌ 审批检查未通过"
                        echo "  - MR 已合并: ${isMerged ? '是' : '否'}"
                        echo "  - 有审批评论: ${hasApprovalComment ? '是' : '否'}"
                        echo "="*50
                        return false
                    }
                  }
              }
          }
      }
      stage('识别真实来源分支') {
          steps {
              script {
                  if (env.TAG_NAME) {
                      echo "🔔 当前是通过标签触发构建，标签名：${env.TAG_NAME}"
                      
                      def commitId = sh(script: "git rev-list -n 1 ${env.TAG_NAME}", returnStdout: true).trim()
                      def branches = sh(
                          script: "git branch -r --contains ${commitId} | grep -v '->' | awk -F/ '{print \$2}'",
                          returnStdout: true
                      ).trim().split("\n") as List
      
                      if (branches.size() > 0) {
                          env.SOURCE_BRANCH = branches[0].trim()
                          echo "✅ 标签 ${env.TAG_NAME} 来源于分支：${env.SOURCE_BRANCH}"
                      } else {
                          echo "⚠️ 无法自动识别标签来源分支，默认使用 'unknown'"
                          env.SOURCE_BRANCH = 'unknown'
                      }
                  } else if (env.BRANCH_NAME) {
                      echo "🛠️ 当前是通过手动或分支触发构建，分支名：${env.BRANCH_NAME}"
                      env.SOURCE_BRANCH = env.BRANCH_NAME
                  } else if (env.GIT_BRANCH) {
                      echo "📦 推测当前分支为：${env.GIT_BRANCH}"
                      env.SOURCE_BRANCH = env.GIT_BRANCH
                  } else {
                      echo "⚠️ 未能识别来源分支，默认使用 'unknown'"
                      env.SOURCE_BRANCH = 'unknown'
                  }
                  echo "📌 最终来源分支：${env.SOURCE_BRANCH}"
              }
          }
      }
      stage('环境检测') {
          steps {
              script {
                  echo "========== 关键变量 =========="
                  echo "BRANCH_NAME: ${env.BRANCH_NAME}"
                  echo "CHANGE_ID: ${env.CHANGE_ID}"           // ⚠️ 关键：这个值是什么？
                  echo "CHANGE_TARGET: ${env.CHANGE_TARGET}"
                  echo "================================"
              }
          }
      }
      stage('MR代码审查(pre_release)') {
          when {
              expression {
                  // 仅当是合并请求且目标分支为 pre_release 时执行
                  if (!(env.CHANGE_ID != null && env.CHANGE_TARGET == 'pre_release')) {
                      return false
                  }
                  // 检查 MR 是否已关闭或已合并，跳过
                  if (env.gitlabMergeRequestState == 'closed' || env.gitlabMergeRequestState == 'merged') {
                      echo "⚠️ MR 状态为 ${env.gitlabMergeRequestState}，跳过代码审查"
                      return false
                  }
                  return true
              }
          }
          steps {
              script {
                  echo "=== 合并请求全量代码审查 ==="
                  echo "MR ID: ${env.CHANGE_ID}"
                  echo "源分支: ${env.CHANGE_BRANCH}"
                  echo "目标分支: ${env.CHANGE_TARGET}"

                  def scannerHome = tool SCANNER_TOOL

                  withSonarQubeEnv(SONARQUBE_ENV) {
                      echo "🔍 执行全量代码扫描..."
                      sh """
                          ${scannerHome}/bin/sonar-scanner \
                              -Dsonar.scanner.skipCertificateCheck=true \
                              -Dsonar.scm.provider=git
                      """
                  }
              }
          }
      }
      stage('等待MR代码审查完成') {
          when {
              expression {
                  if (!(env.CHANGE_ID != null && env.CHANGE_TARGET == 'pre_release')) {
                      return false
                  }
                  if (env.gitlabMergeRequestState == 'closed' || env.gitlabMergeRequestState == 'merged') {
                      return false
                  }
                  return true
              }
          }
          steps {
              script {
                  timeout(time: 30, unit: 'MINUTES') {
                      // 等待 SonarQube 分析完成
                      def qg = waitForQualityGate()
                      echo "质量门状态: ${qg.status}"

                      // 获取 MR 作者信息
                      def mrAuthor = "未知"
                      def mrTitle = ""
                      withCredentials([string(credentialsId: 'gitlab_amber_token', variable: 'GITLAB_TOKEN')]) {
                          try {
                              def mrInfoResponse = sh(
                                  script: """
                                      curl -s --header "PRIVATE-TOKEN: ${GITLAB_TOKEN}" \
                                      "http://${GITLAB_HOST}/api/v4/projects/${PROJECT_PATH}/merge_requests/${env.CHANGE_ID}"
                                  """,
                                  returnStdout: true
                              ).trim()
                              def mrData = readJSON text: mrInfoResponse
                              mrAuthor = mrData.author?.name ?: mrData.author?.username ?: "未知"
                              mrTitle = mrData.title ?: ""
                              echo "MR 作者: ${mrAuthor}"
                              echo "MR 标题: ${mrTitle}"
                          } catch (Exception e) {
                              echo "⚠️ 获取 MR 作者信息失败: ${e.message}"
                          }
                      }

                      withCredentials([string(credentialsId: '86733c2b-9296-4169-9d44-286b9a27b3fb', variable: 'SONAR_TOKEN')]) {
                          try {
                              // 获取质量门状态
                              def qualityGateResponse = sh(
                                  script: "curl -s -u ${SONAR_TOKEN}: '${SONAR_HOST}/api/qualitygates/project_status?projectKey=${PROJECT_KEY}'",
                                  returnStdout: true
                              ).trim()

                              def qualityGate = sh(script: "echo '${qualityGateResponse}' | jq -r '.projectStatus.status // \"UNKNOWN\"'", returnStdout: true).trim()

                              // 获取代码指标
                              def metricsResponse = sh(
                                  script: """curl -s -u ${SONAR_TOKEN}: '${SONAR_HOST}/api/measures/component?component=${PROJECT_KEY}&metricKeys=bugs,vulnerabilities,code_smells,coverage,duplicated_lines_density,ncloc'""",
                                  returnStdout: true
                              ).trim()

                              def bugs = sh(script: "echo '${metricsResponse}' | jq -r '.component.measures[] | select(.metric==\"bugs\") | .value // \"0\"'", returnStdout: true).trim()
                              def vuln = sh(script: "echo '${metricsResponse}' | jq -r '.component.measures[] | select(.metric==\"vulnerabilities\") | .value // \"0\"'", returnStdout: true).trim()
                              def smells = sh(script: "echo '${metricsResponse}' | jq -r '.component.measures[] | select(.metric==\"code_smells\") | .value // \"0\"'", returnStdout: true).trim()
                              def cover = sh(script: "echo '${metricsResponse}' | jq -r '.component.measures[] | select(.metric==\"coverage\") | .value // \"0\"'", returnStdout: true).trim()
                              def dup = sh(script: "echo '${metricsResponse}' | jq -r '.component.measures[] | select(.metric==\"duplicated_lines_density\") | .value // \"0\"'", returnStdout: true).trim()
                              def ncloc = sh(script: "echo '${metricsResponse}' | jq -r '.component.measures[] | select(.metric==\"ncloc\") | .value // \"0\"'", returnStdout: true).trim()

                              // 图标判断
                              def qgIcon = qualityGate == 'OK' ? '✅' : qualityGate == 'ERROR' ? '❌' : '⚠️'
                              def bugsIcon = bugs.toInteger() == 0 ? '✅' : bugs.toInteger() < 10 ? '⚠️' : '❌'
                              def vulnIcon = vuln.toInteger() == 0 ? '✅' : '❌'
                              def coverFloat = cover.toFloat()
                              def coverIcon = coverFloat >= 80 ? '✅' : coverFloat >= 60 ? '⚠️' : coverFloat > 0 ? '❌' : '⚪'
                              def dupFloat = dup.toFloat()
                              def dupIcon = dupFloat <= 5 ? '✅' : dupFloat <= 10 ? '⚠️' : '❌'

                              // 构建消息
                              def markdown = """### 🧩 SonarQube 扫描结果

**项目:** ${PROJECT_KEY}

**MR:** !${env.CHANGE_ID} ${mrTitle}

**发起人:** ${mrAuthor}

**分支:** ${env.CHANGE_BRANCH} → ${env.CHANGE_TARGET}

**构建:** #${env.BUILD_NUMBER}

---

#### 📊 质量门状态

${qgIcon} **${qualityGate}**

#### 🔍 代码质量指标

- 🐞 **Bugs:** ${bugs} ${bugsIcon}

- 🔓 **安全漏洞:** ${vuln} ${vulnIcon}

- 💨 **代码异味:** ${smells} ${smells.toInteger() > 1000 ? '⚠️' : '✅'}

- 📏 **代码行数:** ${ncloc}

#### 📈 测试与重复

- 📊 **测试覆盖率:** ${cover}% ${coverIcon}

- 🔁 **代码重复率:** ${dup}% ${dupIcon}

---

[🔗 查看详细报告](${SONAR_HOST}/dashboard?id=${PROJECT_KEY})

⏰ ${new Date().format('yyyy-MM-dd HH:mm:ss', TimeZone.getTimeZone('GMT+8'))}"""

                              // 添加建议
                              def suggestions = []
                              if (coverFloat < 60) {
                                  suggestions << "建议增加单元测试覆盖率（目标 ≥ 80%）"
                              }
                              if (dupFloat > 10) {
                                  suggestions << "建议重构重复代码（目标 ≤ 5%）"
                              }
                              if (bugs.toInteger() > 10) {
                                  suggestions << "建议优先修复 Bugs"
                              }
                              if (vuln.toInteger() > 0) {
                                  suggestions << "⚠️ 存在安全漏洞，请立即修复"
                              }

                              if (suggestions) {
                                  markdown += "\n\n#### 💡 优化建议\n"
                                  suggestions.each { markdown += "- ${it}\n" }
                              }

                              def dingMessage = groovy.json.JsonOutput.toJson([
                                  msgtype: 'markdown',
                                  markdown: [
                                      title: "SonarQube MR代码审查结果",
                                      text: markdown
                                  ]
                              ])

                              // 发送钉钉消息
                              sh """
                                  curl -s -X POST '${DING_WEBHOOK}' \
                                  -H 'Content-Type: application/json' \
                                  -d '${dingMessage.replace("'", "'\\''")}'
                              """

                              // 可选：生成 PDF 报告（如果 CNES Report 已安装）
                              sh """
                                  curl -u ${SONAR_TOKEN}: -o sonar-report.pdf '${SONAR_HOST}/api/report/export?project=${PROJECT_KEY}&format=pdf' || echo '⚠️ 未安装报告插件，跳过 PDF 导出'
                              """
                          } catch (Exception e) {
                              echo "❌ SonarQube 结果通知失败: ${e.message}"
                              e.printStackTrace()
                          }
                      }
                  }
              }
          }
      }
      stage('检查审批') {
          when {
            expression {
              // MR 到 pre_release 时跳过（只做代码审查）
              if (env.CHANGE_ID != null && env.CHANGE_TARGET == 'pre_release') {
                  return false
              }
              // 只要是 pre_release 或 release 分支的构建，无论是 MR 过程还是合并后，都进入检查
              return (env.BRANCH_NAME == 'pre_release' || env.BRANCH_NAME == 'release' || env.CHANGE_ID != null)
            }
          }
          steps {
              script {
                  echo "\n" + "="*60
                  echo "开始审批检查"
                  echo "="*60 + "\n"
                  
                  if (!checkMRApproval()) {
                      error("❌❌❌ 此合并请求未获得审查者批准，构建终止！")
                  }
                  
                  echo "\n" + "="*60
                  echo "✓✓✓ 审批检查通过，继续构建流程"
                  echo "="*60 + "\n"
              }
          }
      }
      // stage('SonarQube代码审查') {
      //     when {
      //         expression {
      //             return env.SOURCE_BRANCH == 'test'
      //         }
      //     }
      //     steps{
      //         script {
      //             def scannerHome = tool SCANNER_TOOL

      //             // 获取变更的代码文件(排除配置文件等)
      //             def changedFiles = sh(
      //                 script: '''
      //                     git diff --name-only --diff-filter=ACMR origin/release...HEAD | \
      //                     grep -E '\\.(java|js|jsx|ts|tsx|py|go|php|cs|cpp|c|h|vue)$' | \
      //                     tr '\\n' ',' | sed 's/,$//'
      //                 ''',
      //                 returnStdout: true
      //             ).trim()

      //             withSonarQubeEnv(SONARQUBE_ENV) {
      //                 if (changedFiles) {
      //                     echo "=== 增量扫描模式 ==="
      //                     echo "扫描文件: ${changedFiles}"
      //                     sh """
      //                         ${scannerHome}/bin/sonar-scanner \
      //                             -Dsonar.scanner.skipCertificateCheck=true \
      //                             -Dsonar.inclusions="${changedFiles}" \
      //                             -Dsonar.scm.provider=git
      //                     """
      //                 } else {
      //                     echo "=== 全量扫描模式 ==="
      //                     echo "未检测到代码文件变更,执行全量扫描"
      //                     sh """
      //                         ${scannerHome}/bin/sonar-scanner \
      //                             -Dsonar.scanner.skipCertificateCheck=true \
      //                             -Dsonar.scm.provider=git
      //                     """
      //                 }
      //             }
      //         }
      //     }
      // }
      // stage('等待 SonarQube 分析完成') {
      //     when {
      //         expression {
      //             return env.SOURCE_BRANCH == 'test'
      //         }
      //     }
      //     steps {
      //         timeout(time: 3, unit: 'MINUTES') {
      //             waitForQualityGate abortPipeline: false
      //         }
      //     }
      // }
      // stage('获取 SonarQube 扫描结果并通知钉钉') {
      //     when {
      //         expression {
      //             return env.SOURCE_BRANCH == 'test'
      //         }
      //     }
      //     steps {
      //         script {
      //             withCredentials([string(credentialsId: '86733c2b-9296-4169-9d44-286b9a27b3fb', variable: 'SONAR_TOKEN')]) {
      //                 // 获取质量门状态
      //                 def result = sh(
      //                     script: "curl -s -u ${SONAR_TOKEN}: '${SONAR_HOST}/api/qualitygates/project_status?projectKey=${PROJECT_KEY}'",
      //                     returnStdout: true
      //                 ).trim()

      //                 def qualityGate = sh(script: "echo '${result}' | jq -r '.projectStatus.status'", returnStdout: true).trim()

      //                 // 获取代码指标
      //                 def metrics = sh(
      //                     script: """curl -s -u ${SONAR_TOKEN}: '${SONAR_HOST}/api/measures/component?component=${PROJECT_KEY}&metricKeys=bugs,vulnerabilities,code_smells,coverage,duplicated_lines_density'""",
      //                     returnStdout: true
      //                 ).trim()

      //                 def bugs = sh(script: "echo '${metrics}' | jq -r '.component.measures[] | select(.metric==\"bugs\") | .value'", returnStdout: true).trim()
      //                 def vuln = sh(script: "echo '${metrics}' | jq -r '.component.measures[] | select(.metric==\"vulnerabilities\") | .value'", returnStdout: true).trim()
      //                 def smells = sh(script: "echo '${metrics}' | jq -r '.component.measures[] | select(.metric==\"code_smells\") | .value'", returnStdout: true).trim()
      //                 def cover = sh(script: "echo '${metrics}' | jq -r '.component.measures[] | select(.metric==\"coverage\") | .value'", returnStdout: true).trim()
      //                 def dup = sh(script: "echo '${metrics}' | jq -r '.component.measures[] | select(.metric==\"duplicated_lines_density\") | .value'", returnStdout: true).trim()

      //                 // 发送钉钉消息
      //                 sh """
      //                     curl -s -X POST '${DING_WEBHOOK}' \
      //                     -H 'Content-Type: application/json' \
      //                     -d '{
      //                         "msgtype": "markdown",
      //                         "markdown": {
      //                         "title": "SonarQube 扫描结果",
      //                         "text": "### 🧩 SonarQube 扫描结果 (${PROJECT_KEY})\\n- 质量门：**${qualityGate}**\\n- 🐞 Bugs：${bugs}\\n- 🔓 漏洞：${vuln}\\n- 💨 异味：${smells}\\n- 📊 覆盖率：${cover}%\\n- 🔁 重复率：${dup}%\\n\\n[👉 点击查看详情](${SONAR_HOST}/dashboard?id=${PROJECT_KEY})"
      //                         }
      //                     }'
      //                 """

      //                 // 可选：生成 PDF 报告
      //                 sh """
      //                     curl -u ${SONAR_TOKEN}: -o sonar-report.pdf '${SONAR_HOST}/api/report/export?project=${PROJECT_KEY}&format=pdf' || echo '⚠️ 未安装报告插件，跳过 PDF 导出'
      //                 """
      //             }
      //         }
      //     }
      // }
      stage('环境确认') {
          when {
              expression {
                  return !(env.CHANGE_ID != null && env.CHANGE_TARGET == 'pre_release')
              }
          }
          steps {
              sh "docker --version"
              sh "docker buildx version || echo '⚠️ BuildKit 未安装，使用传统构建'"
              script {
                  echo "构建触发方式: ${env.TAG_NAME ? '标签' : '分支'}"
                  if (env.TAG_NAME) {
                      echo "标签名: ${env.TAG_NAME}"
                  } else {
                      echo "分支名: ${env.GIT_BRANCH}"
                  }
              }
          }
      }
      stage('准备变量') {
          when {
              expression {
                  return !(env.CHANGE_ID != null && env.CHANGE_TARGET == 'pre_release')
              }
          }
          steps {
              script {
                  env.SHORT_COMMIT = env.GIT_COMMIT ? env.GIT_COMMIT.substring(0,7) : sh(script:'git rev-parse --short HEAD', returnStdout:true).trim()
                  echo "短commit: ${env.SHORT_COMMIT}"

                  // 计算 package.json 的哈希值，用于 Docker 缓存隔离
                  env.PKG_HASH = sh(script: 'md5sum package.json | cut -d" " -f1 | cut -c1-8', returnStdout: true).trim()
                  echo "package.json 哈希: ${env.PKG_HASH}"

                  env.IMAGE_TAG = getImageTag(env.SOURCE_BRANCH, env.SHORT_COMMIT)
                  echo "镜像标签：${env.IMAGE_TAG}"
                  // 🚀 新增：设置缓存镜像标签
                  if (env.SOURCE_BRANCH == 'dev') {
                      env.CACHE_TAG = 'dev-cache'
                      env.BUILD_ARG = 'yarn build:dev'
                  } else if (env.SOURCE_BRANCH == 'test') {
                      env.CACHE_TAG = 'uat-cache'
                      env.BUILD_ARG = 'yarn build:test'
                  } else if (env.SOURCE_BRANCH == 'pre_release') {
                      env.CACHE_TAG = 'rc-cache'
                      env.BUILD_ARG = 'yarn build:pre'
                  } else if (env.SOURCE_BRANCH == 'release' || env.SOURCE_BRANCH == 'release_external') {
                      env.CACHE_TAG = 'prod-cache'
                      env.BUILD_ARG = 'yarn build'
                  }
                  try {
                      updateGitlabCommitStatus(
                          name: 'jenkins-ci',
                          state: 'running'
                      )
                      echo "✅ GitLab 状态更新: running"
                  } catch (Exception e) {
                      echo "⚠️ GitLab 状态更新失败: ${e.getMessage()}"
                  }
              }
          }
      }
      // 🚀 新增：拉取缓存镜像
      stage('拉取缓存镜像') {
          when {
              expression {
                  return !(env.CHANGE_ID != null && env.CHANGE_TARGET == 'pre_release')
              }
          }
          steps {
              script {
                  echo "🔍 尝试拉取缓存镜像: ${DOCKER_IMAGE}:${env.CACHE_TAG}"
                  sh """
                      docker pull ${DOCKER_IMAGE}:${env.CACHE_TAG} || \
                      echo "⚠️ 缓存镜像不存在，将进行完整构建"
                  """
              }
          }
      }
      // 🚀 优化：合并所有构建阶段
      stage('构建镜像') {
          when {
              expression {
                  return !(env.CHANGE_ID != null && env.CHANGE_TARGET == 'pre_release')
              }
          }
          steps {
              script {
                  try {
                      updateGitlabCommitStatus(
                          name: 'jenkins-ci',
                          state: 'running'
                      )
                      echo "✅ GitLab 状态更新: running"
                  } catch (Exception e) {
                      echo "⚠️ GitLab 状态更新失败: ${e.getMessage()}"
                  }
                  
                  echo "🏗️ 开始构建镜像..."
                  echo "分支: ${env.SOURCE_BRANCH}"
                  echo "package.json 哈希: ${env.PKG_HASH}"
                  echo "构建命令: ${env.BUILD_ARG}"
                  echo "镜像标签: ${env.IMAGE_TAG}"
                  echo "缓存标签: ${env.CACHE_TAG}"

                  // 🚀 使用 BuildKit 缓存构建，按 package.json 哈希隔离缓存
                  sh """
                      docker build \
                          --cache-from ${DOCKER_IMAGE}:${env.CACHE_TAG} \
                          --build-arg BUILDKIT_INLINE_CACHE=1 \
                          --build-arg PKG_HASH="${env.PKG_HASH}" \
                          --build-arg BUILD_COMMAND="${env.BUILD_ARG}" \
                          -t ${DOCKER_IMAGE}:${env.IMAGE_TAG} \
                          -t ${DOCKER_IMAGE}:${env.CACHE_TAG} \
                          .
                  """
                  
                  echo "✅ 镜像构建完成"
              }
          }
      }
      stage('连接镜像私有库') {
          when {
              expression {
                  return !(env.CHANGE_ID != null && env.CHANGE_TARGET == 'pre_release')
              }
          }
          steps {
              withCredentials([usernamePassword(credentialsId: 'docker-registry-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                  sh '''
                      docker login 10.0.0.55:6001 -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
                  '''
              }
          }
      }
      stage('推送镜像') {
          when {
              expression {
                  return !(env.CHANGE_ID != null && env.CHANGE_TARGET == 'pre_release')
              }
          }
          steps {
              script {
                  try {
                      updateGitlabCommitStatus(
                          name: 'jenkins-ci',
                          state: 'running'
                      )
                  } catch (Exception e) {
                      echo "⚠️ GitLab 状态更新失败: ${e.getMessage()}"
                  }
              }
              echo "📤 推送镜像: ${DOCKER_IMAGE}:${env.IMAGE_TAG}"
              sh "docker push ${DOCKER_IMAGE}:${env.IMAGE_TAG}"
              echo "📤 推送缓存镜像: ${DOCKER_IMAGE}:${env.CACHE_TAG}"
              sh "docker push ${DOCKER_IMAGE}:${env.CACHE_TAG}"
              echo "✅ 镜像推送完成"
          }
      }
      stage('部署开发服务') {
          when {
              expression {
                  return env.SOURCE_BRANCH == 'dev'
              }
          }
          steps {
              script {
                  try {
                      updateGitlabCommitStatus(
                          name: 'jenkins-ci',
                          state: 'running'
                      )
                  } catch (Exception e) {
                      echo "⚠️ GitLab 状态更新失败: ${e.getMessage()}"
                  }
              }
              sshPublisher(
                  publishers: [
                      sshPublisherDesc(
                          configName: 'dev-server',
                          transfers: [
                              sshTransfer(
                                  execCommand: """
                                      echo "🚀 ✅ 开始远程部署..."
                                      echo "🧹 清理旧镜像（保留当前版本）"
                                      docker images ${DOCKER_IMAGE} --format '{{.Repository}}:{{.Tag}}' | grep dev- | grep -v dev-${SHORT_COMMIT} | xargs -r docker rmi || echo "⚠️ 没有旧镜像可删除"
                                      echo "🛑 停止现有的容器并移除"
                                      if docker ps -a | grep -q "${DEV_CONTAINER_NAME}"; then
                                          docker stop ${DEV_CONTAINER_NAME} && echo "🛑 容器停止成功"
                                          docker rm ${DEV_CONTAINER_NAME} && echo "🗑️ 容器已删除"
                                      else
                                          echo "⚠️ 容器不存在，跳过停止和删除步骤"
                                      fi
                                      
                                      echo "🔥 启动容器"
                                      docker run -d --name ${DEV_CONTAINER_NAME} --restart=always -p 8099:80 ${DOCKER_IMAGE}:dev-${SHORT_COMMIT} && echo "🎉 容器启动成功！"
                                  """
                              )
                          ],
                          usePromotionTimestamp: false,
                          verbose: true
                      )
                  ]
              )
          }
      }
      stage('部署测试服务') {
          when {
              expression {
                  return env.SOURCE_BRANCH == 'test'
              }
          }
          steps {
              script {
                  try {
                      updateGitlabCommitStatus(
                          name: 'jenkins-ci',
                          state: 'running'
                      )
                  } catch (Exception e) {
                      echo "⚠️ GitLab 状态更新失败: ${e.getMessage()}"
                  }
                  echo '触发自动更新镜像服务...'
                  sh """
                      echo "🔥 更新镜像为：${env.IMAGE_TAG}"
                      curl -X POST -H "content-type: application/json" \\
                        -H "Kb-Access-Key: ${TEST_KUBOARD_TOKEN}" \\
                        -d '{"cluster":"1o6RXKkYOT6","kind":"deployments","namespace":"lydc-test-cloud","name":"lydc-cloud-web","images":{"10.0.0.55:6001/lydc-cloud-web":"'${DOCKER_IMAGE}:${env.IMAGE_TAG}'"}}' \\
                        "http://10.0.41.145:27080/api/cd.kuboard.cn/v4/update-image-tag"
                  """
                }
          }
      }
      stage('部署预生产服务') {
          when {
              expression {
                  return env.SOURCE_BRANCH == 'pre_release'
              }
          }
          steps {
              script {
                  try {
                      updateGitlabCommitStatus(
                          name: 'jenkins-ci',
                          state: 'running'
                      )
                  } catch (Exception e) {
                      echo "⚠️ GitLab 状态更新失败: ${e.getMessage()}"
                  }
                  echo '触发自动更新镜像服务...'
                  sh """
                      echo "🔥 更新镜像为：${env.IMAGE_TAG}"
                      curl -X POST -H "content-type: application/json" \\
                        -H "Kb-Access-Key: ${TEST_KUBOARD_TOKEN}" \\
                        -d '{"cluster":"1o6RXKkYOT6","kind":"deployments","namespace":"lydc-pre-cloud","name":"lydc-cloud-web","images":{"10.0.0.55:6001/lydc-cloud-web":"'${DOCKER_IMAGE}:${env.IMAGE_TAG}'"}}' \\
                        "http://10.0.41.145:27080/api/cd.kuboard.cn/v4/update-image-tag"
                  """
                }
          }
      }
      stage('部署正式服务') {
          when {
              expression {
                  return env.SOURCE_BRANCH == 'release'
              }
          }
          steps {
              script {
                  try {
                      updateGitlabCommitStatus(
                          name: 'jenkins-ci',
                          state: 'running'
                      )
                  } catch (Exception e) {
                      echo "⚠️ GitLab 状态更新失败: ${e.getMessage()}"
                  }
                  echo '触发自动更新镜像服务...>'
                  sh """
                      echo "🔥 更新镜像为：${env.IMAGE_TAG}"
                      curl -X PUT -H "content-type: application/json" \\
                        -H "Cookie: KuboardUsername=admin; KuboardAccessKey=${PROD_KUBOARD_TOKEN}" \\
                        -d '{"kind":"deployments","namespace":"lydc-cloud","name":"lydc-cloud-web","images":{"10.0.0.55:6001/lydc-cloud-web":"'${DOCKER_IMAGE}:${env.IMAGE_TAG}'"}}' \\
                        "http://10.0.0.191:27080/kuboard-api/cluster/LYDC-release-cluster/kind/CICDApi/admin/resource/updateImageTag"
                  """
              }
          }
      }
      stage('部署外网正式服务') {
          when {
              expression {
                  return env.SOURCE_BRANCH == 'release_external'
              }
          }
          steps {
              script {
                  try {
                      updateGitlabCommitStatus(
                          name: 'jenkins-ci',
                          state: 'running'
                      )
                  } catch (Exception e) {
                      echo "⚠️ GitLab 状态更新失败: ${e.getMessage()}"
                  }
                  echo '触发自动更新镜像服务...'
                  sh """
                      echo "🔥 更新镜像为：${env.IMAGE_TAG}"
                      curl -X PUT -H "content-type: application/json" \\
                        -H "Cookie: KuboardUsername=admin; KuboardAccessKey=${PROD_KUBOARD_TOKEN}" \\
                        -d '{"kind":"deployments","namespace":"lydc-cloud","name":"lydc-cloud-web2","images":{"10.0.0.55:6001/lydc-cloud-web":"'${DOCKER_IMAGE}:${env.IMAGE_TAG}'"}}' \\
                        "http://10.0.0.191:27080/kuboard-api/cluster/LYDC-release-cluster/kind/CICDApi/admin/resource/updateImageTag"
                  """
              }
          }
      }
    }
    post {
        success {
            script {
                try {
                    updateGitlabCommitStatus(
                        name: 'jenkins-ci',
                        state: 'success'
                    )
                    echo "✅ GitLab 状态更新: success"
                } catch (Exception e) {
                    echo "⚠️ GitLab 状态更新失败: ${e.getMessage()}"
                }
                echo "构建部署成功 ✅"
            }
        }

        failure {
            script {
                try {
                    updateGitlabCommitStatus(
                        name: 'jenkins-ci',
                        state: 'failed'
                    )
                    echo "❌ GitLab 状态更新: failed"
                } catch (Exception e) {
                    echo "⚠️ GitLab 状态更新失败: ${e.getMessage()}"
                }
                echo "构建或部署失败 ❌"
            }
        }
    }
}

