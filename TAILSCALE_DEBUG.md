# Tailscale Connectivity Debug Instructions for Claude Code

## Context
- **Server (WSL/NucBox):** 100.98.17.27
- **Your Laptop:** 100.94.8.37 (roblaptop)
- **Services Running:**
  - TAU Reporting: http://100.98.17.27:5174
  - Signal Platform: http://100.98.17.27:3001
  - Clawdbot Dashboard: https://100.98.17.27

## Problem
Tailscale shows both devices connected, but URLs don't work from Windows laptop.

## Diagnostic Steps for Claude Code

### 1. Check Tailscale Status on Windows
Run in PowerShell or Command Prompt:
```powershell
# Check if Tailscale is running
tailscale status

# Try to ping the server
ping 100.98.17.27

# Check if you can reach the port
Test-NetConnection -ComputerName 100.98.17.27 -Port 5174
Test-NetConnection -ComputerName 100.98.17.27 -Port 3001
Test-NetConnection -ComputerName 100.98.17.27 -Port 443
```

### 2. Check Windows Firewall
Run in PowerShell (as Admin):
```powershell
# Check if Windows Firewall is blocking
Get-NetFirewallProfile | Select-Object Name, Enabled

# Check specific rules for Tailscale
Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*Tailscale*"} | Select-Object DisplayName, Enabled, Direction
```

### 3. Test from Browser Developer Tools
Open browser DevTools (F12) and run in Console:
```javascript
fetch('http://100.98.17.27:5174')
  .then(r => console.log('Success:', r.status))
  .catch(e => console.error('Failed:', e))
```

### 4. Check Browser Settings
- Clear browser cache
- Try incognito/private mode
- Check if proxy settings are interfering:
  - Chrome: Settings → System → Open proxy settings
  - Firefox: Settings → Network Settings

### 5. WSL2 Network Issue
WSL2 might not be forwarding ports properly. On the Windows laptop in PowerShell:
```powershell
# Check if WSL is involved
wsl --list --verbose

# Try accessing via WSL's own IP instead
# Get WSL IP from within WSL:
# ip addr show eth0 | grep inet
```

### 6. Tailscale Subnet Routing
Check if subnet routing is needed:
```powershell
tailscale status --json | Select-String "AllowedIPs"
```

## Common Fixes

### Fix 1: Restart Tailscale on Windows
```powershell
# In system tray, right-click Tailscale → Exit
# Then restart Tailscale
```

### Fix 2: Flush DNS Cache
```powershell
ipconfig /flushdns
```

### Fix 3: Add Windows Firewall Rule
If firewall is blocking, add rule:
```powershell
New-NetFirewallRule -DisplayName "Tailscale Outbound" -Direction Outbound -Action Allow -Protocol TCP -RemoteAddress 100.98.17.27
```

### Fix 4: Check Tailscale Exit Node
Make sure exit node isn't interfering:
```powershell
tailscale status
# Look for "Exit node: " - should be none or intentional
```

### Fix 5: Try Different Access Method
If 100.98.17.27 doesn't work, try the machine name:
```
http://nucboxm5plus:5174
```

## What to Report Back
1. Output of `tailscale status` from Windows
2. Result of `ping 100.98.17.27`
3. Result of `Test-NetConnection` commands
4. Any error messages from browser console
5. Whether incognito mode works differently

## Server-Side Verification (Already Done)
- ✅ Services are running and bound to 0.0.0.0
- ✅ Server accepts connections on Tailscale IP: `curl -I http://100.98.17.27:5174` returns 200 OK
- ✅ Tailscale shows laptop connected: `idle, tx 8624 rx 16520`
- ✅ Ports are listening: `ss -tuln` confirms 5174, 3001, 443 open

## Next Steps if Nothing Works
1. Check if MagicDNS is enabled: `tailscale status --json`
2. Try accessing via direct IP instead of Tailscale IP
3. Check if WSL2 networking mode needs changing (mirrored vs NAT)
4. Verify Tailscale admin console doesn't have ACLs blocking access
