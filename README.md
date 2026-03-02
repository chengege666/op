# OpenWrt x86_64 自动构建项目 (Image Builder 版) - 扩容固件

这是一个基于 GitHub Actions 的 OpenWrt/ImmortalWrt 固件自动构建项目。本项目采用 **Image Builder (镜像生成器)** 技术，而非传统的源码编译，能够在几分钟内快速生成定制化的 OpenWrt 固件。

## 支持设备

| 设备 | 固件类型 | 说明 |
|------|---------|------|
| **x86_64 (软路由)** | OpenWrt / ImmortalWrt | 官方 Image Builder，支持自动扩容 |
| **P&W R619AC (竞斗云 2.0)** | OpenWrt | 适配 128M 闪存，需 OpBoot |

## ✨ 主要特性

*   **极速构建**: 使用官方 Image Builder，构建时间通常在 5-20 分钟内
*   **双固件支持**: 同时支持 OpenWrt 和 ImmortalWrt 两个分支
*   **高度可定制**: 支持在构建前配置固件大小 (x86)、LAN IP、版本等
*   **常用插件集成**:
    *   **iStore 应用商店**: 方便新手安装和管理插件（已解决密钥验证问题）
    *   **Docker**: 容器化应用支持（含 dockerd 自启配置）
    *   **PPPoE**: 支持预设拨号账号密码
*   **中文界面**: 默认集成简体中文语言包 (LuCI, Firewall, ttyd, 包管理器)
*   **自动扩容**: 支持自定义系统分区大小 (1GB/2GB/4GB/自定义)，避免空间不足
*   **多种构建类型**: 支持 squashfs/ext4 (物理机)、ISO (虚拟机)、rootfs (容器)
*   **PVE 部署神器**: 推荐搭配 [PVE 镜像转换工具 (pvezh)](https://github.com/chengege666/pvezh) 使用，一键导入固件到 Proxmox VE

## 🚀 快速开始

### 方式一：使用 GitHub Actions (推荐)

#### 1. 构建 x86_64 (OpenWrt)

1.  进入本仓库的 **[Actions](https://github.com/your-username/your-repo/actions)** 页面
2.  在左侧选择 **"构建 OpenWrt x86_64 (Image Builder)"** 工作流
3.  点击右侧的 **"Run workflow"** 按钮
4.  根据需求填写/选择参数：

| 参数 | 说明 | 默认值 |
|------|------|--------|
| **固件构建类型** | squashfs_ext4 (物理机/通用) / iso (虚拟机/光盘) / rootfs (容器/LXC) | squashfs_ext4 |
| **OpenWrt 版本** | 24.10.5 / 24.10.4 / 24.10.3 / SNAPSHOT | 24.10.5 |
| **自动发布到 Release** | 构建成功后是否自动发布到 GitHub Release | false |
| **固件大小 (MB)** | 1024 / 2048 / 4096 / custom (rootfs 类型时无效) | 1024 |
| **自定义固件大小** | 当固件大小选择 custom 时生效 | 5120 |
| **路由器管理地址** | LAN IP 地址 | 192.168.1.1 |
| **启用应用商店 (iStore)** | 勾选以集成 iStore | false |
| **启用 Docker** | 勾选以集成 Docker 环境 | false |
| **启用 PPPoE** | 勾选以预设拨号信息 | false |
| **PPPoE 用户名** | PPPoE 拨号账号 | - |
| **PPPoE 密码** | PPPoE 拨号密码 | - |

5.  点击绿色的 **"Run workflow"** 开始构建

#### 2. 构建 x86_64 (ImmortalWrt)

ImmortalWrt 是基于 OpenWrt 的第三方固件分支，提供更多预编译包和优化的内核。

操作步骤与 OpenWrt 相同，选择 **"构建 ImmortalWrt x86-64 (Image Builder)"** 工作流即可。

#### 3. 构建 P&W R619AC (竞斗云 2.0)

1.  进入本仓库的 **[Actions](https://github.com/your-username/your-repo/actions)** 页面
2.  在左侧选择 **"构建 P&W R619AC (OpenWrt)"** 工作流
3.  点击 **"Run workflow"**
4.  参数说明：

| 参数 | 说明 | 默认值 |
|------|------|--------|
| **路由器管理地址** | LAN IP 地址 | 192.168.1.1 |
| **OpenWrt 版本** | 24.10.5 / 24.10.4 / 24.10.3 / SNAPSHOT | 24.10.5 |
| **启用应用商店 (iStore)** | 勾选以集成 iStore | true |
| **启用 Docker** | 勾选以集成 Docker（建议配合 USB 存储使用） | false |
| **启用 PPPoE** | 勾选以预设拨号信息 | false |

> **注意**: R619AC 固件适配 **OpBoot** (支持 128M 分区)。刷机前请确保已刷入 OpBoot。

## 📦 构建产物

构建完成后，在 Workflow 运行记录页面的 **Artifacts** 区域可以下载生成的固件包。下载并解压 zip 包后：

### x86_64 固件

| 文件类型 | 说明 | 用途 |
|---------|------|------|
| `squashfs-combined-efi.img.gz` | 压缩的 squashfs 格式镜像 | 物理机/虚拟机（推荐） |
| `ext4-combined-efi.img.gz` | 压缩的 ext4 格式镜像 | 物理机/虚拟机 |
| `rootfs.tar.gz` | 根文件系统压缩包 | LXC/Docker 容器 |
| `*.iso` | ISO 光盘镜像 | 虚拟机/CD-ROM 安装 |

> **提示**: 
> - `.img.gz` 文件需要再次解压得到 `.img` 文件后，方可写入硬盘或转换为虚拟磁盘
> - 推荐使用 [PVE 镜像转换工具 (pvezh)](https://github.com/chengege666/pvezh) 自动处理解压和导入

### R619AC 固件

| 文件类型 | 说明 | 用途 |
|---------|------|------|
| `*-sysupgrade.bin` | 升级固件 | OpBoot 环境下升级 |
| `*-factory.bin` | 工厂固件 | 原厂固件首次刷入 |
| `*-factory.ubi` | UBI 工厂固件 | UBI 分区刷入 |

## 🛠️ 项目结构

```
.
├── .github/
│   └── workflows/
│       ├── build.yml                    # OpenWrt x86_64 构建工作流
│       ├── build-immortalwrt.yml        # ImmortalWrt x86_64 构建工作流
│       └── build-r619ac.yml             # R619AC 构建工作流
├── config/
│   └── base.config                      # 基础配置文件
├── scripts/
│   ├── set_ip.sh                        # 设置 LAN IP
│   ├── set_partition.sh                 # 调整分区大小 (x86)
│   ├── add_docker.sh                    # 添加 Docker 相关包
│   ├── set_pppoe.sh                     # 配置 PPPoE 拨号
│   └── add_store.sh                     # 添加 iStore (已集成到工作流)
└── README.md                            # 项目说明文档
```

## 🔧 脚本说明

### set_ip.sh
设置路由器管理地址（LAN IP）
```bash
# 用法
LAN_IP=192.168.1.1 ./scripts/set_ip.sh
```

### set_partition.sh
调整系统分区大小（仅 x86_64，rootfs 类型无效）
```bash
# 用法
FIRMWARE_SIZE=1024 ./scripts/set_partition.sh
```

### add_docker.sh
添加 Docker 支持及 LuCI 管理界面
```bash
# 用法
ENABLE_DOCKER=true ./scripts/add_docker.sh
```

### set_pppoe.sh
预设 PPPoE 拨号账号密码
```bash
# 用法
ENABLE_PPPOE=true PPPOE_USER=账号 PPPOE_PASS=密码 ./scripts/set_pppoe.sh
```

## ⚠️ 注意事项

### 通用
*   **版本选择**: 推荐使用 `24.10.x` 或 `23.05.x` 稳定版。SNAPSHOT 版本可能不够稳定
*   **固件大小**: 安装 Docker/iStore 时建议选择 2GB 或更大空间
*   **默认凭证**: 
    *   管理地址：http://192.168.1.1 (可自定义)
    *   用户名：`root`
    *   密码：无（首次登录需设置密码）

### iStore 集成
*   由于 iStore 官方源密钥验证问题，项目采用离线包下载方式集成
*   构建时会自动从 `https://istore.linkease.com/repo/all/store/` 下载所需 ipk 包
*   本地构建时需确保网络连接正常

### R619AC 特别说明
*   **闪存限制**: R619AC 仅有 128M 闪存，安装 Docker 时建议插入 USB 3.0 U 盘并挂载为 Docker 数据盘
*   **OpBoot**: 必须使用 OpBoot 引导，不支持原厂 U-Boot
*   **WiFi 驱动**: 已集成 `wpad-openssl` 和 `ath10k-ct` 固件，确保 WiFi 正常工作

### Docker 配置
*   已配置 dockerd 服务开机自启
*   如果 LuCI 界面仅显示"配置"菜单，请检查 dockerd 服务是否正常运行：
    ```bash
    /etc/init.d/dockerd status
    ```

## 🤝 配合工具

*   **[PVE 镜像转换工具 (pvezh)](https://github.com/chengege666/pvezh)**: 一键将 OpenWrt 镜像导入 Proxmox VE
*   **[iStore](https://github.com/linkease/istore)**: 易用的 OpenWrt 应用商店

## 📝 常见问题

### Q: 构建失败，提示下载 Image Builder 失败
A: 检查版本号是否正确，或尝试切换到另一种压缩格式（.tar.xz / .tar.zst）

### Q: 固件刷入后无法启动
A: 
- x86_64: 检查 BIOS/UEFI 启动模式，确保使用 EFI 引导
- R619AC: 确保已刷入 OpBoot，并使用正确的固件类型（sysupgrade/factory）

### Q: Docker 无法启动
A: 检查内核模块是否加载：
```bash
lsmod | grep overlay
dockerd --debug
```

### Q: 如何自定义添加其他插件？
A: 修改对应工作流文件中的 `BASE_PACKAGES` 变量，添加所需包名

## 📄 许可证

本项目基于 GitHub Actions 构建，使用的 OpenWrt/ImmortalWrt 固件遵循各自项目的开源许可证。

## 🙏 致谢

*   [OpenWrt](https://openwrt.org/) - 强大的开源路由器固件
*   [ImmortalWrt](https://immortalwrt.org/) - OpenWrt 的优化分支
*   [iStore](https://github.com/linkease/istore) - 易用的应用商店
*   [pvezh](https://github.com/chengege666/pvezh) - PVE 镜像转换工具

---

**构建时间**: 通常 5-20 分钟  
**适用人群**: 软路由玩家、OpenWrt 爱好者、需要定制固件的用户  
**难度等级**: ⭐⭐☆☆☆（新手友好）
