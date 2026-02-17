# WSL2 + Tailscale Issue - Fix Instructions

## The Problem
**Root cause:** Tailscale is running **inside WSL2** (Linux), but your laptop's Tailscale (Windows) can't route to WSL2's internal Tailscale interface.

Even though ping works (because ICMP routes through), **TCP connections to specific ports fail** because Windows Tailscale doesn't know the WSL2 network topology.

## Verification (Server Side - Already Confirmed)
✅ Services are listening on correct interfaces:
- Port 5174 (TAU): Listening on 0.0.0.0
- Port 3001 (Signal): Listening on 0.0.0.0  
- Port 443 (Dashboard): Listening on 100.98.17.27
- All respond correctly from within WSL2

## Solution Options

### Option 1: Access via Windows Localhost (EASIEST)
Since you're running these in WSL2 on your Windows machine, WSL2 automatically forwards ports to Windows localhost.

**From your Windows laptop browser, try:**
```
http://localhost:5174     (TAU Reporting)
http://localhost:3001     (Signal Platform)
https://localhost         (Clawdbot Dashboard)
```

This works because WSL2 forwards localhost ports to the Windows host automatically.

### Option 2: Get Windows Host IP
Find your Windows host's actual IP on the network:

**In Windows PowerShell:**
```powershell
ipconfig | Select-String "IPv4"
```

Then access via that IP from your laptop:
```
http://<windows-ip>:5174
http://<windows-ip>:3001
https://<windows-ip>
```

### Option 3: Move Tailscale to Windows Host (PERMANENT FIX)
This is the proper long-term solution:

1. **Stop Tailscale in WSL2:**
   ```bash
   sudo systemctl stop tailscaled
   sudo systemctl disable tailscaled
   ```

2. **Install Tailscale on Windows instead:**
   - Download from https://tailscale.com/download/windows
   - Install and authenticate
   - WSL2 will be accessible through the Windows Tailscale

3. **Verify:**
   - Windows will get the Tailscale IP (100.98.17.27 or new one)
   - WSL2 services will be accessible via that IP from other machines
   - No routing issues

### Option 4: WSL2 Subnet Routing (ADVANCED)
Configure Tailscale to advertise WSL2's subnet:

**In WSL2:**
```bash
# Enable IP forwarding
sudo sysctl -w net.ipv4.ip_forward=1

# Advertise WSL2 subnet
tailscale up --advertise-routes=172.22.71.0/24

# On Tailscale admin console, approve the subnet route
```

Then access via WSL2's internal IP instead:
```
http://172.22.71.223:5174
```

## Recommended Immediate Fix

**On your Windows laptop, try localhost first:**
```
http://localhost:5174
```

If that works, you're accessing through Windows host → WSL2 port forwarding.

If you want remote access (from other devices), do **Option 3** (move Tailscale to Windows host).

## Why This Happened
WSL2 creates a virtualized network namespace. When Tailscale runs inside WSL2, it only sees the WSL2 network. Windows Tailscale and Linux Tailscale are running **separately** and don't share routing tables.

Think of it as:
```
[Your Laptop Tailscale] → [Windows Host Tailscale] → ❌ → [WSL2 Tailscale]
                                                      (no route)
```

vs the correct setup:
```
[Your Laptop Tailscale] → [Windows Host Tailscale] → [WSL2 via localhost]
```
