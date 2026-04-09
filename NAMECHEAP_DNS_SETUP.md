# 🌐 Connect Namecheap Domain to SalonLink - Quick Guide

## 📋 **What You Need:**
1. Your Namecheap account login
2. Your domain name (e.g., salonlink.com)
3. 5-10 minutes

---

## ⚡ **FASTEST METHOD - 2 Steps:**

### **Step 1: Login to Namecheap**
1. Go to: https://www.namecheap.com
2. Login to your account
3. Click **"Domain List"** in left sidebar
4. Find your domain and click **"Manage"**

---

### **Step 2: Add DNS Records**

1. Click the **"Advanced DNS"** tab
2. Scroll to **"Host Records"** section
3. Click **"Add New Record"**

#### **Add These 2 Records:**

**Record 1 - Main Domain:**
```
Type: CNAME Record
Host: @
Value: project-ba6e9ce4.pages.dev
TTL: Automatic (or 3600)
```

**Record 2 - WWW Subdomain:**
```
Type: CNAME Record
Host: www
Value: project-ba6e9ce4.pages.dev
TTL: Automatic (or 3600)
```

4. Click **"Save All Changes"** (green checkmark button)

---

## ⏱️ **Wait for DNS Propagation:**
- Takes 5-60 minutes (usually 10-15 minutes)
- Sometimes up to 24 hours

---

## ✅ **Tell Cloudflare About Your Domain:**

1. Go to: https://dash.cloudflare.com
2. Click **"Workers & Pages"**
3. Click **"project-ba6e9ce4"**
4. Click **"Custom domains"** tab
5. Click **"Set up a custom domain"**
6. Enter your domain: `yourdomain.com`
7. Click **"Continue"**
8. Follow prompts (Cloudflare will verify DNS)

---

## 🔍 **Check If It's Working:**

### Method 1: DNS Checker
1. Go to: https://dnschecker.org
2. Enter your domain name
3. Select "CNAME" from dropdown
4. Click search
5. Should show: `project-ba6e9ce4.pages.dev` ✅

### Method 2: Browser Test
1. Wait 15 minutes after adding DNS
2. Visit: `https://yourdomain.com`
3. Should show SalonLink! 🎉

---

## 📸 **Visual Guide:**

### Namecheap DNS Settings Should Look Like:

```
┌─────────────┬──────┬───────────────────────────────┬─────┐
│ TYPE        │ HOST │ VALUE                         │ TTL │
├─────────────┼──────┼───────────────────────────────┼─────┤
│ CNAME Record│  @   │ project-ba6e9ce4.pages.dev    │ Auto│
│ CNAME Record│ www  │ project-ba6e9ce4.pages.dev    │ Auto│
└─────────────┴──────┴───────────────────────────────┴─────┘
```

---

## 🐛 **Troubleshooting:**

**Problem: "CNAME record for @ not allowed"**
- Some registrars don't allow CNAME for @
- Solution: Use ALIAS or ANAME instead (if available)
- Or: Add A record pointing to Cloudflare IP (see below)

**Alternative - Use A Records:**
```
Type: A Record
Host: @
Value: 192.0.2.1 (temporary, Cloudflare will provide correct IP)
TTL: Automatic
```

**Problem: "Domain not found" after 1 hour**
- Double-check spelling of: `project-ba6e9ce4.pages.dev`
- Make sure you saved changes in Namecheap
- Try clearing browser cache

**Problem: "Not secure" or SSL error**
- Wait 10 more minutes - Cloudflare is provisioning SSL
- SSL certificate takes 5-15 minutes after DNS connects

---

## 🎯 **Quick Checklist:**

- [ ] Logged into Namecheap
- [ ] Opened Domain → Manage → Advanced DNS
- [ ] Added CNAME for @ → project-ba6e9ce4.pages.dev
- [ ] Added CNAME for www → project-ba6e9ce4.pages.dev
- [ ] Clicked "Save All Changes"
- [ ] Told Cloudflare about domain (Workers & Pages → Custom domains)
- [ ] Waited 15 minutes
- [ ] Tested at dnschecker.org
- [ ] Visited https://yourdomain.com

---

## 📞 **Need More Help?**

Tell me:
1. ✅ What domain name you bought
2. ✅ Which step you're on
3. ✅ Any error messages you see

I'll help you get it connected!

---

## 🔐 **After Domain Connects:**

✅ Your site will be at: `https://yourdomain.com`
✅ SSL (HTTPS) automatic - Free forever
✅ All old URLs redirect to your domain
✅ Ready to share with customers!

---

*Connection usually takes 10-15 minutes total! 🚀*
