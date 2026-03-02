// OpenWrt 固件构建器 - 主逻辑

// 切换自定义固件大小输入框
function toggleCustomSize() {
    const firmwareSize = document.getElementById('firmwareSize').value;
    const customSizeGroup = document.getElementById('customSizeGroup');
    
    if (firmwareSize === 'custom') {
        customSizeGroup.classList.remove('hidden');
    } else {
        customSizeGroup.classList.add('hidden');
    }
}

// 切换 PPPoE 输入框
function togglePppoeFields() {
    const enablePppoe = document.getElementById('enablePppoe').checked;
    const pppoeFields = document.getElementById('pppoeFields');
    
    if (enablePppoe) {
        pppoeFields.classList.remove('hidden');
    } else {
        pppoeFields.classList.add('hidden');
    }
}

// 显示状态消息
function showStatus(message, type) {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = message;
    statusMessage.className = 'status-message ' + type;
}

// 更新配置摘要
function updateConfigSummary() {
    const configList = document.getElementById('configList');
    const configSummary = document.getElementById('configSummary');
    
    const buildType = document.getElementById('buildType').value;
    const luciVersion = document.getElementById('luciVersion').value;
    const firmwareSize = document.getElementById('firmwareSize').value;
    const customFirmwareSize = document.getElementById('customFirmwareSize').value;
    const lanIp = document.getElementById('lanIp').value;
    const enableStore = document.getElementById('enableStore').checked;
    const enableDocker = document.getElementById('enableDocker').checked;
    const enablePppoe = document.getElementById('enablePppoe').checked;
    const autoRelease = document.getElementById('autoRelease').checked;
    
    let finalSize = firmwareSize === 'custom' ? customFirmwareSize + ' MB' : firmwareSize + ' MB';
    
    configList.innerHTML = `
        <li><strong>构建类型:</strong> ${buildType}</li>
        <li><strong>OpenWrt 版本:</strong> ${luciVersion}</li>
        <li><strong>固件大小:</strong> ${finalSize}</li>
        <li><strong>LAN IP:</strong> ${lanIp}</li>
        <li><strong>iStore:</strong> ${enableStore ? '✓ 启用' : '✗ 未启用'}</li>
        <li><strong>Docker:</strong> ${enableDocker ? '✓ 启用' : '✗ 未启用'}</li>
        <li><strong>PPPoE:</strong> ${enablePppoe ? '✓ 启用' : '✗ 未启用'}</li>
        <li><strong>自动发布:</strong> ${autoRelease ? '✓ 启用' : '✗ 未启用'}</li>
    `;
    
    configSummary.classList.remove('hidden');
}

// 触发 GitHub Actions
async function triggerWorkflow(formData) {
    const { githubToken, githubRepo } = formData;
    
    const [owner, repo] = githubRepo.split('/');
    if (!owner || !repo) {
        throw new Error('仓库格式错误，应为：username/repo-name');
    }
    
    const workflowId = 'build.yml';
    const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`;
    
    const inputs = {
        build_type: formData.buildType,
        luci_version: formData.luciVersion,
        auto_release: formData.autoRelease.toString(),
        firmware_size: formData.firmwareSize,
        custom_firmware_size: formData.customFirmwareSize,
        lan_ip: formData.lanIp,
        enable_store: formData.enableStore.toString(),
        enable_docker: formData.enableDocker.toString(),
        enable_pppoe: formData.enablePppoe.toString(),
        pppoe_user: formData.pppoeUser || '',
        pppoe_pass: formData.pppoePass || ''
    };
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ref: 'main',
            inputs: inputs
        })
    });
    
    if (response.status === 204) {
        return {
            success: true,
            message: '构建任务已成功触发！',
            actionsUrl: `https://github.com/${githubRepo}/actions`
        };
    } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            `触发失败 (${response.status}): ${errorData.message || '未知错误'}`
        );
    }
}

// 表单提交处理
document.getElementById('buildForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ 正在触发构建...';
    
    try {
        // 收集表单数据
        const firmwareSize = document.getElementById('firmwareSize').value;
        const formData = {
            githubToken: document.getElementById('githubToken').value.trim(),
            githubRepo: document.getElementById('githubRepo').value.trim(),
            buildType: document.getElementById('buildType').value,
            luciVersion: document.getElementById('luciVersion').value,
            autoRelease: document.getElementById('autoRelease').checked,
            firmwareSize: firmwareSize,
            customFirmwareSize: firmwareSize === 'custom' ? 
                document.getElementById('customFirmwareSize').value : '1024',
            lanIp: document.getElementById('lanIp').value.trim(),
            enableStore: document.getElementById('enableStore').checked,
            enableDocker: document.getElementById('enableDocker').checked,
            enablePppoe: document.getElementById('enablePppoe').checked,
            pppoeUser: document.getElementById('pppoeUser').value.trim(),
            pppoePass: document.getElementById('pppoePass').value.trim()
        };
        
        // 验证必填字段
        if (!formData.githubToken) {
            throw new Error('请填写 GitHub Token');
        }
        if (!formData.githubRepo) {
            throw new Error('请填写 GitHub 仓库');
        }
        if (formData.enablePppoe && (!formData.pppoeUser || !formData.pppoePass)) {
            throw new Error('启用了 PPPoE 但请填写用户名和密码');
        }
        
        // 更新配置摘要
        updateConfigSummary();
        
        // 触发工作流
        showStatus('正在连接 GitHub API...', 'info');
        const result = await triggerWorkflow(formData);
        
        showStatus(
            `${result.message}\n\n请前往 GitHub Actions 查看构建进度和下载固件：${result.actionsUrl}`,
            'success'
        );
        
        // 清空 Token（安全考虑）
        document.getElementById('githubToken').value = '';
        
    } catch (error) {
        showStatus(`❌ 错误：${error.message}`, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '🚀 开始构建';
    }
});

// 页面加载时初始化
window.addEventListener('DOMContentLoaded', function() {
    console.log('OpenWrt 固件构建器已加载');
    console.log('提示：请确保你已 Fork 了正确的仓库，并且 GitHub Token 有 workflow 权限');
});
