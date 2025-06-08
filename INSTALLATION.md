# Installation Instructions

## macOS - "Cannot verify developer" Issue

When you download and try to open Steroid Vibe on macOS, you might see:

> **"Steroid Vibe" cannot be opened because Apple cannot verify the developer.**

This happens because the app isn't code-signed with an Apple Developer certificate. Here's how to install it safely:

### Method 1: Right-click to Open

1. Download the app
2. **Right-click** on the app → **Open**
3. Click **Open** in the dialog that appears
4. The app will open and remember this choice

### Method 2: System Preferences

1. Try to open the app normally (it will be blocked)
2. Go to **System Preferences** → **Security & Privacy** → **General**
3. You'll see: _"Steroid Vibe" was blocked from use because it is not from an identified developer_
4. Click **Open Anyway**
5. Click **Open** in the confirmation dialog

### Method 3: Terminal (Advanced)

```bash
# Remove quarantine attribute
xattr -d com.apple.quarantine "/path/to/Steroid Vibe.app"
```

## Why This Happens

- The app is safe but not code-signed with Apple's $99/year developer certificate
- macOS Gatekeeper blocks unsigned apps by default
- Once you approve it once, it will open normally

## Windows & Linux

No special steps needed - download and run normally.
