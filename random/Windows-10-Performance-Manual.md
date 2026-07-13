# ⚡ Windows 10 Performance Optimization Manual

> **Target System:** Intel Core i3-3240 · 8GB RAM · Windows 10
> **Goal:** Maximum gaming performance on legacy hardware

---

## 📋 Table of Contents

1. [Pre-Flight Checklist](#-pre-flight-checklist)
2. [Startup & Background Apps](#-step-1--startup--background-apps)
3. [Disable Unnecessary Services](#-step-2--disable-unnecessary-services)
4. [Visual Effects](#-step-3--visual-effects)
5. [Power Plan Tuning](#-step-4--power-plan-tuning)
6. [Memory & RAM Optimization](#-step-5--memory--ram-optimization)
7. [Storage & Disk Health](#-step-6--storage--disk-health)
8. [Windows Update Control](#-step-7--windows-update-control)
9. [In-Game Settings for i3-3240](#-step-8--in-game-settings-for-i3-3240)
10. [Advanced Tweaks](#-step-9--advanced-tweaks)
11. [Thermal Maintenance](#-step-10--thermal-maintenance)
12. [Quick Reference Card](#-quick-reference-card)

---

## ✈️ Pre-Flight Checklist

Before you start, gather these:

- [ ] **Admin access** to your Windows account
- [ ] **A USB recovery drive** (just in case) — create via Start → "Recovery Drive"
- [ ] **15–20 minutes** of uninterrupted time
- [ ] **Your motherboard manual** (for RAM slot layout)
- [ ] **GPU model** noted (NVIDIA / AMD / Intel HD 2500?)
- [ ] **Storage type** confirmed (HDD or SSD?)

> 💡 **Tip:** Create a **System Restore Point** before making changes.
> `Win + R` → `sysdm.cpl` → *System Protection* → *Create*

---

## 🟢 Step 1 — Startup & Background Apps

The single biggest win for boot time and idle RAM usage.

### 📌 Via Task Manager
Press **`Ctrl + Shift + Esc`** → **Startup** tab

| ✅ Keep Enabled | ❌ Disable |
|---|---|
| Antivirus (Defender) | OneDrive |
| Realtek Audio | Skype |
| GPU Driver Service | Discord *(if not needed)* |
| | Spotify |
| | Edge / Chrome auto-launch |
| | Java / Adobe update helpers |
| | Manufacturer bloat (HP, Dell, Lenovo) |

### 📌 Via Settings
**Settings** → **Privacy** → **Background apps** → Turn **all off**

> 🎯 **Expected gain:** 30–60s faster boot · 500MB–1GB more free RAM

---

## 🟡 Step 2 — Disable Unnecessary Services

Press **`Win + R`** → type `services.msc` → **Enter**

For each service below: double-click → **Startup type: Disabled** → Stop → OK

| Service | Why Disable |
|---|---|
| 🔴 **SysMain** (Superfetch) | Preloads apps into RAM — wastes memory on 8GB |
| 🔴 **DiagTrack** | Telemetry / data collection |
| 🟡 **WSearch** (Windows Search) | Indexing — only disable on HDD |
| 🔴 **Fax** | You don't fax in 2026 |
| 🔴 **MapsBroker** | Offline maps — unused on desktop |
| 🔴 **lfsvc** | Geolocation service |
| 🔴 **RetailDemo** | Retail demo mode |
| 🟡 **WerSvc** | Crash reporting (optional) |

> ⚠️ **Warning:** Don't disable services you're unsure about. If unsure, skip it.

### 🚀 Bonus: Use `msconfig` for Safe Bulk Disable
1. `Win + R` → `msconfig` → **Services** tab
2. ☑️ Check **"Hide all Microsoft services"**
3. Disable the remaining third-party ones
4. Restart when prompted

---

## 🟢 Step 3 — Visual Effects

Windows draws fancy animations that eat CPU cycles. On an i3, **every cycle counts**.

### 📍 The Path
**This PC** → Right-click → **Properties** → **Advanced system settings**
→ **Performance** → **Settings**

### 🎯 Recommended Setup
- Select **"Adjust for best performance"** (disables all)
- Then re-enable these **3 essentials** for usability:
  - ✨ Smooth edges of screen fonts
  - ✨ Show thumbnails instead of icons
  - ✨ Smooth-scroll list boxes

> 🎯 **Expected gain:** 5–10% FPS in some games · Snappier UI

---

## 🔵 Step 4 — Power Plan Tuning

Your i3-3240 will downclock under the default "Balanced" plan — that's bad for gaming.

### 🛠️ Unlock the Hidden Ultimate Performance Plan
Open **CMD as Administrator** and paste:

```powershell
powercfg -duplicatescheme 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c
```

### 🛠️ Set It Active
1. **Control Panel** → **Power Options**
2. Select **"Ultimate Performance"**
3. Close the panel

> 💡 On desktops this prevents CPU throttling — **a free 5–15% in CPU-bound games.**

---

## 🟣 Step 5 — Memory & RAM Optimization

You only have **8GB** — every megabyte matters.

### 🔍 Find What's Eating Your RAM
**Task Manager** → **Details** tab → Right-click columns → add **"Memory (Private Working Set)"**

### 🎯 Quick Wins
- [ ] Close Chrome/Edge tabs when not in use
- [ ] Use **Firefox** or **ungoogled-chromium** (lighter than Chrome)
- [ ] Disable **Game Bar DVR** (background recording)
- [ ] Stop **OneDrive** sync temporarily while gaming

### 💾 RAM Hardware Check
Make sure both 4GB sticks are in the **correct dual-channel slots** on your motherboard. Check the manual — usually:

```
A1 (empty)   A2 (4GB stick)
B1 (empty)   B2 (4GB stick)
```

> Dual-channel gives **15–20% more memory bandwidth** — a real FPS boost in CPU-heavy games.

### 💰 Future Upgrade
DDR3 is dirt cheap. A **second 8GB kit** (2x4GB or 2x8GB) costs ~$10–15 used. Highly recommended.

---

## 🟠 Step 6 — Storage & Disk Health

### ❓ Are You on HDD or SSD?

| Storage | Recommendation |
|---|---|
| 💿 HDD | **Buy a cheap SATA SSD** — biggest upgrade you can make |
| 💾 SSD | Run a TRIM check: `fsutil behavior query DisableDeleteNotify` (should return 0) |

### 🛠️ Cleanup Commands (Admin CMD)
```powershell
cleanmgr /d C
dism /online /cleanup-image /restorehealth
dism /online /cleanup-image /startcomponentcleanup
```

### 🗑️ Remove Old Stuff
- [ ] Uninstall games you don't play (Settings → Apps)
- [ ] Clear `%temp%` folder (`Win + R` → `temp` → delete all)
- [ ] Empty Recycle Bin
- [ ] Run `Disk Cleanup` with "System files" checked

> 🎯 **Target:** Keep at least **20% of your drive free** for page file & temp files.

---

## 🔴 Step 7 — Windows Update Control

Windows Update loves to kick in mid-game and tank your FPS.

### 🛑 Pause Updates
**Settings** → **Update & Security** → **Advanced options** → **Pause updates** → Pick the longest date

### ⏰ Set Active Hours
**Settings** → **Update & Security** → **Change active hours** → Set to your typical gaming time

> 💡 Active hours stops forced reboots and background update installs during play.

---

## 🎮 Step 8 — In-Game Settings for i3-3240

Your CPU: **2 cores / 4 threads @ 3.4GHz** (Ivy Bridge, 2013)

### 📊 The Golden Settings Template

| Setting | Recommended |
|---|---|
| **Resolution** | 1080p (or 720p for heavy games) |
| **Preset** | Low / Medium |
| **Anti-Aliasing** | **OFF** or FXAA only |
| **Anti-Aliasing Quality** | Performance > Quality |
| **Draw Distance** | Low–Medium |
| **Shadows** | Low |
| **Textures** | Medium–High (uses VRAM, not CPU) |
| **Effects / Particles** | Low |
| **Post-Processing** | Low |
| **V-Sync** | **OFF** in-game |
| **Frame Cap** | Use **RTSS** or in-game cap at 60 |
| **Field of View** | 75–90 (lower = more FPS) |

### 🎯 Per-Game Quick Tips
- **CS2 / Valorant:** Medium-Low, no AA, 1080p → 100+ FPS possible
- **GTA V:** High traffic off, advanced graphics off, FXAA only
- **Fortnite:** Performance mode (Epic preset) → 60+ FPS
- **Cyberpunk / AAA:** 720p Medium → 30–45 FPS realistic
- **Minecraft:** OptiFine or Sodium mod → massive boost

### 🛠️ Frame Cap with RTSS
Download **RivaTuner Statistics Server** (free) and cap frames 2–3 below your refresh rate. Eliminates stutter from V-Sync without input lag.

---

## ⚫ Step 9 — Advanced Tweaks

### 🎮 Game Bar (Disable)
**Settings** → **Gaming** → **Captures** → All off
**Settings** → **Gaming** → **Game Mode** → **Off** *(yes, off — helps on weak CPUs)*

### 🪟 Disable Fullscreen Optimizations
For each game:
1. Right-click `.exe` → **Properties**
2. **Compatibility** tab
3. ☑️ Check **"Disable fullscreen optimizations"**
4. Apply

### 🎨 GPU Control Panel
- **NVIDIA:** Manage 3D settings → Power management → **Prefer maximum performance**
- **AMD:** Radeon Settings → Wait for Vertical Refresh → **Off**
- Add each game `.exe` and set as **"High performance"**

### 🔧 Registry: Disable Transparency
`Win + R` → `regedit`
```
HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize
```
Set **EnableTransparency** to `0`

---

## 🌡️ Step 10 — Thermal Maintenance

The i3-3240 is **over a decade old**. Dust and dried thermal paste are silent FPS killers.

### 🧹 Cleaning Checklist
- [ ] Open the case
- [ ] Blow out dust with compressed air (especially CPU cooler fins)
- [ ] Check that the CPU fan spins freely
- [ ] Reapply **thermal paste** if temperatures are high (Arctic MX-4 ~$6)
- [ ] Verify case fans are working

### 📊 Temperature Targets

| State | Temperature |
|---|---|
| 🟢 Idle | 30–45°C |
| 🟡 Light Load | 50–65°C |
| 🟠 Gaming | 65–80°C |
| 🔴 Throttling | 85°C+ |

Download **HWMonitor** (free) to check. If you see 90°C+ in games, **stop and clean your cooler first**.

> 🎯 Lower temps = higher sustained clock = more FPS.

---

## 📇 Quick Reference Card

> Print this or save it for quick lookup.

```
╔══════════════════════════════════════════════════════════╗
║         WINDOWS 10 PERFORMANCE CHEAT SHEET               ║
╠══════════════════════════════════════════════════════════╣
║ BOOT SPEED      → Task Manager → Startup tab             ║
║ RAM USAGE       → Disable SysMain + background apps      ║
║ CPU THROTTLE    → Enable Ultimate Performance plan       ║
║ VISUAL LAG      → Adjust for best performance            ║
║ GAME STUTTER    → Disable V-Sync, use RTSS frame cap     ║
║ UPDATE INTERRUPT → Pause updates + set active hours      ║
║ THERMAL THROTTLE → Clean cooler, repaste if >85°C        ║
║                                                          ║
║ GOLDEN RULE: GPU matters more than CPU for FPS           ║
╚══════════════════════════════════════════════════════════╝
```

---

## 🎯 Expected Results

After completing this guide, you should see:

| Metric | Before | After |
|---|---|---|
| Boot time | 60–120s | 25–40s |
| Idle RAM usage | 4–6 GB | 2.5–3.5 GB |
| 1% lows in games | Stuttery | Smoother |
| Avg FPS (CPU-bound) | Baseline | +10–20% |
| System responsiveness | Sluggish | Snappy |

---

## 🆘 If Something Breaks

- **System feels broken?** Boot into Safe Mode and undo the last change
- **Can't boot?** Use your USB recovery drive
- **One tweak caused issues?** Most changes are reversible in Task Manager / `services.msc`
- **Unsure about a setting?** Google the service name before disabling

---

<div align="center">

### 🏁 You're Done!

Your i3-3240 + 8GB system is now optimized for the best possible gaming experience on legacy hardware.

**Have fun, and game on!** 🎮

*Made with ⚡ for budget warriors everywhere*

</div>
